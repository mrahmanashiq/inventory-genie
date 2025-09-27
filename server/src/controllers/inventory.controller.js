import { z } from 'zod';
import inventoryService from '../services/inventory.service.js';

// Validation schemas
const createProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().optional(),
  category: z.object({
    main: z.string().min(1, 'Main category is required'),
    sub: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
  brand: z.string().optional(),
  manufacturer: z.object({
    name: z.string().optional(),
    partNumber: z.string().optional(),
  }).optional(),
  pricing: z.object({
    cost: z.number().min(0, 'Cost must be positive'),
    price: z.number().min(0, 'Price must be positive'),
    wholesalePrice: z.number().min(0).optional(),
    discountPrice: z.number().min(0).optional(),
    currency: z.string().default('USD'),
  }),
  inventory: z.object({
    trackQuantity: z.boolean().default(true),
    reorderPoint: z.number().min(0).default(10),
    maxStock: z.number().min(0).optional(),
    unit: z.enum(['piece', 'kg', 'gram', 'liter', 'ml', 'meter', 'cm', 'pack', 'box', 'dozen']).default('piece'),
  }).optional(),
  variants: z.array(z.object({
    name: z.string(),
    value: z.string(),
    price: z.number().optional(),
    stock: z.number().optional(),
  })).optional(),
  dimensions: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    weight: z.number().optional(),
    unit: z.enum(['cm', 'inch', 'kg', 'lb']).default('cm'),
  }).optional(),
  status: z.enum(['active', 'inactive', 'discontinued']).default('active'),
  visibility: z.enum(['public', 'private', 'hidden']).default('public'),
  taxable: z.boolean().default(true),
  taxRate: z.number().min(0).max(100).default(0),
  expiryDate: z.string().transform(str => new Date(str)).optional(),
  initialStock: z.number().min(0).optional(),
  locationId: z.string().optional(),
});

const updateProductSchema = createProductSchema.partial();

const stockAdjustmentSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  locationId: z.string().min(1, 'Location ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be a positive integer'),
  type: z.enum(['purchase', 'sale', 'adjustment', 'transfer', 'return', 'damage', 'expired']).default('adjustment'),
  reason: z.string().optional(),
  reference: z.string().optional(),
});

const stockTransferSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  fromLocationId: z.string().min(1, 'From location is required'),
  toLocationId: z.string().min(1, 'To location is required'),
  quantity: z.number().int().min(1, 'Quantity must be a positive integer'),
  reason: z.string().optional(),
});

const querySchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1),
  limit: z.string().transform(val => Math.min(parseInt(val) || 20, 100)),
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  location: z.string().optional(),
  lowStock: z.string().transform(val => val === 'true').optional(),
  outOfStock: z.string().transform(val => val === 'true').optional(),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export class InventoryController {
  async createProduct(req, res) {
    try {
      const validatedData = createProductSchema.parse(req.body);
      const result = await inventoryService.createProduct(validatedData, req.user.id);
      
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const validatedData = updateProductSchema.parse(req.body);
      
      const result = await inventoryService.updateProduct(id, validatedData, req.user.id);
      
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await inventoryService.deleteProduct(id, req.user.id);
      
      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getProducts(req, res) {
    try {
      const validatedQuery = querySchema.parse(req.query);
      
      const { page, limit, ...filters } = validatedQuery;
      const result = await inventoryService.getProducts(filters, { page, limit });
      
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const result = await inventoryService.getProductById(id);
      
      res.json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async addStock(req, res) {
    try {
      const validatedData = stockAdjustmentSchema.parse(req.body);
      const { productId, locationId, quantity, type, reason, reference } = validatedData;
      
      const result = await inventoryService.addStock(
        productId,
        locationId,
        quantity,
        type,
        req.user.id,
        reason,
        reference
      );
      
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async removeStock(req, res) {
    try {
      const validatedData = stockAdjustmentSchema.parse(req.body);
      const { productId, locationId, quantity, type, reason, reference } = validatedData;
      
      const result = await inventoryService.removeStock(
        productId,
        locationId,
        quantity,
        type,
        req.user.id,
        reason,
        reference
      );
      
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async transferStock(req, res) {
    try {
      const validatedData = stockTransferSchema.parse(req.body);
      const { productId, fromLocationId, toLocationId, quantity, reason } = validatedData;
      
      const result = await inventoryService.transferStock(
        productId,
        fromLocationId,
        toLocationId,
        quantity,
        req.user.id,
        reason
      );
      
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getStockMovements(req, res) {
    try {
      const validatedQuery = querySchema.parse(req.query);
      
      const filters = {
        productId: req.query.productId,
        locationId: req.query.locationId,
        type: req.query.type,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
      };

      const { page, limit } = validatedQuery;
      const result = await inventoryService.getStockMovements(filters, { page, limit });
      
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getLowStockProducts(req, res) {
    try {
      const { locationId } = req.query;
      const result = await inventoryService.getLowStockProducts(locationId);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getOutOfStockProducts(req, res) {
    try {
      const { locationId } = req.query;
      const result = await inventoryService.getOutOfStockProducts(locationId);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getInventoryAnalytics(req, res) {
    try {
      const { locationId, period = '30d' } = req.query;
      
      // Calculate date range based on period
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(startDate.getDate() - 30);
      }

      // Get analytics data
      const [
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
        recentMovements,
      ] = await Promise.all([
        inventoryService.getProducts({ status: 'active' }, { page: 1, limit: 1 }),
        inventoryService.getLowStockProducts(locationId),
        inventoryService.getOutOfStockProducts(locationId),
        inventoryService.getStockMovements(
          { dateFrom: startDate.toISOString(), dateTo: endDate.toISOString() },
          { page: 1, limit: 100 }
        ),
      ]);

      // Calculate stock value (simplified - would need actual cost data)
      const stockValue = await inventoryService.calculateStockValue(locationId);

      res.json({
        success: true,
        analytics: {
          totalProducts: totalProducts.pagination.total,
          lowStockCount: lowStockProducts.count,
          outOfStockCount: outOfStockProducts.count,
          stockValue: stockValue || 0,
          recentMovements: recentMovements.movements.length,
          movementsByType: this._aggregateMovementsByType(recentMovements.movements),
          topMovedProducts: this._getTopMovedProducts(recentMovements.movements),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  _aggregateMovementsByType(movements) {
    const aggregation = {};
    movements.forEach(movement => {
      if (!aggregation[movement.type]) {
        aggregation[movement.type] = 0;
      }
      aggregation[movement.type] += Math.abs(movement.quantity);
    });
    return aggregation;
  }

  _getTopMovedProducts(movements) {
    const productMovements = {};
    movements.forEach(movement => {
      const productId = movement.product._id || movement.product;
      const productName = movement.product.name || 'Unknown Product';
      
      if (!productMovements[productId]) {
        productMovements[productId] = {
          name: productName,
          totalMovement: 0,
        };
      }
      productMovements[productId].totalMovement += Math.abs(movement.quantity);
    });

    return Object.entries(productMovements)
      .sort(([,a], [,b]) => b.totalMovement - a.totalMovement)
      .slice(0, 10)
      .map(([id, data]) => ({ id, ...data }));
  }
}

export default new InventoryController();