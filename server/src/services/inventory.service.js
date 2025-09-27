import { productModel, stockMovementModel } from '../models/product.model.js';
import { locationModel } from '../models/user.model.js';
import { auditLogModel, notificationModel } from '../models/system.model.js';
import { generateSKU } from '../utils/generators.js';

class InventoryService {
  async createProduct(productData, userId) {
    try {
      // Generate SKU if not provided
      if (!productData.sku) {
        productData.sku = await generateSKU(productData.name, productData.category?.main);
      }

      // Set default values
      const product = await productModel.create({
        ...productData,
        addedBy: userId,
        updatedBy: userId,
      });

      // Initialize stock in default location if provided
      if (productData.initialStock && productData.locationId) {
        await this.addStock(
          product._id,
          productData.locationId,
          productData.initialStock,
          'initial',
          userId,
          'Initial stock'
        );
      }

      // Log audit
      await auditLogModel.create({
        user: userId,
        action: 'create',
        resource: 'product',
        resourceId: product._id.toString(),
        details: `Created product: ${product.name}`,
      });

      return {
        success: true,
        product: await productModel.findById(product._id).populate('locations.location addedBy updatedBy'),
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Product with this SKU or barcode already exists');
      }
      throw new Error(error.message || 'Failed to create product');
    }
  }

  async updateProduct(productId, updateData, userId) {
    try {
      const existingProduct = await productModel.findById(productId);
      if (!existingProduct) {
        throw new Error('Product not found');
      }

      const updatedProduct = await productModel.findByIdAndUpdate(
        productId,
        { ...updateData, updatedBy: userId },
        { new: true, runValidators: true }
      ).populate('locations.location addedBy updatedBy');

      // Log audit
      await auditLogModel.create({
        user: userId,
        action: 'update',
        resource: 'product',
        resourceId: productId,
        changes: {
          before: existingProduct.toObject(),
          after: updateData,
        },
        details: `Updated product: ${updatedProduct.name}`,
      });

      return {
        success: true,
        product: updatedProduct,
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to update product');
    }
  }

  async deleteProduct(productId, userId) {
    try {
      const product = await productModel.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      // Check if product has stock
      const hasStock = product.locations.some(loc => loc.quantity > 0);
      if (hasStock) {
        throw new Error('Cannot delete product with existing stock');
      }

      await productModel.findByIdAndDelete(productId);

      // Log audit
      await auditLogModel.create({
        user: userId,
        action: 'delete',
        resource: 'product',
        resourceId: productId,
        details: `Deleted product: ${product.name}`,
        severity: 'medium',
      });

      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Failed to delete product');
    }
  }

  async getProducts(filters = {}, pagination = {}) {
    try {
      const {
        search,
        category,
        status,
        location,
        lowStock,
        outOfStock,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = filters;

      const { page = 1, limit = 20 } = pagination;
      const skip = (page - 1) * limit;

      // Build query
      const query = {};

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } },
          { barcode: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      if (category) {
        query['category.main'] = category;
      }

      if (status) {
        query.status = status;
      }

      if (location) {
        query['locations.location'] = location;
      }

      if (lowStock) {
        query.$expr = {
          $lt: ['$inventory.currentStock', '$inventory.reorderPoint']
        };
      }

      if (outOfStock) {
        query['inventory.currentStock'] = 0;
      }

      // Sort options
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const [products, total] = await Promise.all([
        productModel
          .find(query)
          .populate('locations.location', 'name type')
          .populate('addedBy updatedBy', 'name email')
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .lean(),
        productModel.countDocuments(query),
      ]);

      return {
        success: true,
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to get products');
    }
  }

  async getProductById(productId) {
    try {
      const product = await productModel
        .findById(productId)
        .populate('locations.location', 'name type address')
        .populate('suppliers.vendor', 'companyName agentName email phone')
        .populate('addedBy updatedBy', 'name email');

      if (!product) {
        throw new Error('Product not found');
      }

      // Get recent stock movements
      const stockMovements = await stockMovementModel
        .find({ product: productId })
        .populate('location', 'name type')
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(10);

      return {
        success: true,
        product,
        stockMovements,
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to get product');
    }
  }

  async addStock(productId, locationId, quantity, type = 'adjustment', userId, reason = '', reference = '') {
    try {
      const product = await productModel.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const location = await locationModel.findById(locationId);
      if (!location) {
        throw new Error('Location not found');
      }

      // Find or create location entry in product
      let locationIndex = product.locations.findIndex(
        loc => loc.location.toString() === locationId
      );

      let previousStock = 0;
      if (locationIndex >= 0) {
        previousStock = product.locations[locationIndex].quantity;
        product.locations[locationIndex].quantity += quantity;
      } else {
        product.locations.push({
          location: locationId,
          quantity: quantity,
          reservedQuantity: 0,
          reorderPoint: product.inventory.reorderPoint,
        });
        locationIndex = product.locations.length - 1;
      }

      const newStock = product.locations[locationIndex].quantity;

      // Update total current stock
      product.inventory.currentStock = product.locations.reduce(
        (total, loc) => total + loc.quantity,
        0
      );

      await product.save();

      // Create stock movement record
      await stockMovementModel.create({
        product: productId,
        location: locationId,
        type,
        quantity,
        previousStock,
        newStock,
        reference,
        reason,
        user: userId,
      });

      // Check for low stock and create notification if needed
      await this._checkLowStockAlert(product, locationId, userId);

      // Log audit
      await auditLogModel.create({
        user: userId,
        action: 'update',
        resource: 'inventory',
        resourceId: productId,
        details: `Added ${quantity} units to ${product.name} at ${location.name}`,
      });

      return {
        success: true,
        product: await productModel
          .findById(productId)
          .populate('locations.location', 'name type'),
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to add stock');
    }
  }

  async removeStock(productId, locationId, quantity, type = 'adjustment', userId, reason = '', reference = '') {
    try {
      const product = await productModel.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const location = await locationModel.findById(locationId);
      if (!location) {
        throw new Error('Location not found');
      }

      // Find location entry in product
      const locationIndex = product.locations.findIndex(
        loc => loc.location.toString() === locationId
      );

      if (locationIndex < 0) {
        throw new Error('Product not found in this location');
      }

      const previousStock = product.locations[locationIndex].quantity;

      if (previousStock < quantity) {
        throw new Error('Insufficient stock available');
      }

      product.locations[locationIndex].quantity -= quantity;
      const newStock = product.locations[locationIndex].quantity;

      // Update total current stock
      product.inventory.currentStock = product.locations.reduce(
        (total, loc) => total + loc.quantity,
        0
      );

      await product.save();

      // Create stock movement record
      await stockMovementModel.create({
        product: productId,
        location: locationId,
        type,
        quantity: -quantity,
        previousStock,
        newStock,
        reference,
        reason,
        user: userId,
      });

      // Check for low/out of stock alerts
      await this._checkLowStockAlert(product, locationId, userId);
      await this._checkOutOfStockAlert(product, locationId, userId);

      // Log audit
      await auditLogModel.create({
        user: userId,
        action: 'update',
        resource: 'inventory',
        resourceId: productId,
        details: `Removed ${quantity} units from ${product.name} at ${location.name}`,
      });

      return {
        success: true,
        product: await productModel
          .findById(productId)
          .populate('locations.location', 'name type'),
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to remove stock');
    }
  }

  async transferStock(productId, fromLocationId, toLocationId, quantity, userId, reason = '') {
    try {
      const product = await productModel.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      // Validate locations
      const [fromLocation, toLocation] = await Promise.all([
        locationModel.findById(fromLocationId),
        locationModel.findById(toLocationId),
      ]);

      if (!fromLocation || !toLocation) {
        throw new Error('Invalid location(s)');
      }

      // Remove from source location
      await this.removeStock(
        productId,
        fromLocationId,
        quantity,
        'transfer',
        userId,
        `Transfer to ${toLocation.name}`,
        `TRANSFER-${Date.now()}`
      );

      // Add to destination location
      await this.addStock(
        productId,
        toLocationId,
        quantity,
        'transfer',
        userId,
        `Transfer from ${fromLocation.name}`,
        `TRANSFER-${Date.now()}`
      );

      // Log audit
      await auditLogModel.create({
        user: userId,
        action: 'update',
        resource: 'inventory',
        resourceId: productId,
        details: `Transferred ${quantity} units of ${product.name} from ${fromLocation.name} to ${toLocation.name}`,
      });

      return {
        success: true,
        message: 'Stock transferred successfully',
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to transfer stock');
    }
  }

  async getStockMovements(filters = {}, pagination = {}) {
    try {
      const {
        productId,
        locationId,
        type,
        dateFrom,
        dateTo,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = filters;

      const { page = 1, limit = 20 } = pagination;
      const skip = (page - 1) * limit;

      const query = {};

      if (productId) query.product = productId;
      if (locationId) query.location = locationId;
      if (type) query.type = type;

      if (dateFrom || dateTo) {
        query.createdAt = {};
        if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
        if (dateTo) query.createdAt.$lte = new Date(dateTo);
      }

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const [movements, total] = await Promise.all([
        stockMovementModel
          .find(query)
          .populate('product', 'name sku')
          .populate('location', 'name type')
          .populate('user', 'name email')
          .sort(sortOptions)
          .skip(skip)
          .limit(limit),
        stockMovementModel.countDocuments(query),
      ]);

      return {
        success: true,
        movements,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to get stock movements');
    }
  }

  async getLowStockProducts(locationId = null) {
    try {
      const query = {
        status: 'active',
        $expr: {
          $lt: ['$inventory.currentStock', '$inventory.reorderPoint']
        }
      };

      if (locationId) {
        query['locations.location'] = locationId;
      }

      const products = await productModel
        .find(query)
        .populate('locations.location', 'name type')
        .sort({ 'inventory.currentStock': 1 });

      return {
        success: true,
        products,
        count: products.length,
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to get low stock products');
    }
  }

  async getOutOfStockProducts(locationId = null) {
    try {
      const query = {
        status: 'active',
        'inventory.currentStock': 0,
      };

      if (locationId) {
        query['locations.location'] = locationId;
      }

      const products = await productModel
        .find(query)
        .populate('locations.location', 'name type')
        .sort({ updatedAt: -1 });

      return {
        success: true,
        products,
        count: products.length,
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to get out of stock products');
    }
  }

  async _checkLowStockAlert(product, locationId, userId) {
    const location = product.locations.find(
      loc => loc.location.toString() === locationId
    );

    if (location && location.quantity <= location.reorderPoint && location.quantity > 0) {
      await notificationModel.create({
        recipient: userId,
        type: 'low_stock',
        title: 'Low Stock Alert',
        message: `${product.name} is running low at location`,
        data: {
          productId: product._id,
          locationId,
          currentStock: location.quantity,
          reorderPoint: location.reorderPoint,
        },
        priority: 'high',
        channels: ['in_app', 'email'],
      });
    }
  }

  async _checkOutOfStockAlert(product, locationId, userId) {
    const location = product.locations.find(
      loc => loc.location.toString() === locationId
    );

    if (location && location.quantity === 0) {
      await notificationModel.create({
        recipient: userId,
        type: 'out_of_stock',
        title: 'Out of Stock Alert',
        message: `${product.name} is out of stock at location`,
        data: {
          productId: product._id,
          locationId,
        },
        priority: 'urgent',
        channels: ['in_app', 'email'],
      });
    }
  }
}

export default new InventoryService();