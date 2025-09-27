import mongoose from 'mongoose';

// Enhanced Product Schema
const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
    },
    barcode: {
      type: String,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    category: {
      main: {
        type: String,
        required: true,
      },
      sub: String,
      tags: [String],
    },
    brand: {
      type: String,
      trim: true,
    },
    manufacturer: {
      name: String,
      partNumber: String,
    },
    pricing: {
      cost: {
        type: Number,
        required: true,
        min: 0,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      wholesalePrice: {
        type: Number,
        min: 0,
      },
      discountPrice: {
        type: Number,
        min: 0,
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
    inventory: {
      trackQuantity: {
        type: Boolean,
        default: true,
      },
      currentStock: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
      reservedStock: {
        type: Number,
        default: 0,
        min: 0,
      },
      availableStock: {
        type: Number,
        default: 0,
        min: 0,
      },
      reorderPoint: {
        type: Number,
        default: 10,
        min: 0,
      },
      maxStock: {
        type: Number,
        min: 0,
      },
      unit: {
        type: String,
        enum: ['piece', 'kg', 'gram', 'liter', 'ml', 'meter', 'cm', 'pack', 'box', 'dozen'],
        default: 'piece',
      },
    },
    variants: [{
      name: String, // e.g., 'Size', 'Color'
      value: String, // e.g., 'Large', 'Red'
      sku: String,
      barcode: String,
      price: Number,
      stock: Number,
      images: [String],
    }],
    images: [{
      url: {
        type: String,
        required: true,
      },
      alt: String,
      isPrimary: {
        type: Boolean,
        default: false,
      },
    }],
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      weight: Number,
      unit: {
        type: String,
        enum: ['cm', 'inch', 'kg', 'lb'],
        default: 'cm',
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'discontinued', 'out_of_stock'],
      default: 'active',
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'hidden'],
      default: 'public',
    },
    taxable: {
      type: Boolean,
      default: true,
    },
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    expiryDate: Date,
    batchTracking: {
      enabled: {
        type: Boolean,
        default: false,
      },
      batches: [{
        batchNumber: String,
        quantity: Number,
        expiryDate: Date,
        cost: Number,
        supplier: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Vendor',
        },
      }],
    },
    serialTracking: {
      enabled: {
        type: Boolean,
        default: false,
      },
      serialNumbers: [{
        serial: String,
        status: {
          type: String,
          enum: ['available', 'sold', 'returned', 'damaged'],
          default: 'available',
        },
        location: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Location',
        },
      }],
    },
    locations: [{
      location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 0,
      },
      reservedQuantity: {
        type: Number,
        default: 0,
        min: 0,
      },
      reorderPoint: {
        type: Number,
        default: 10,
      },
    }],
    suppliers: [{
      vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
      },
      supplierSku: String,
      cost: Number,
      leadTime: Number, // in days
      minimumOrderQuantity: {
        type: Number,
        default: 1,
      },
      isPrimary: {
        type: Boolean,
        default: false,
      },
    }],
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    analytics: {
      views: {
        type: Number,
        default: 0,
      },
      sales: {
        type: Number,
        default: 0,
      },
      revenue: {
        type: Number,
        default: 0,
      },
      lastSold: Date,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Product Stock Movement Schema
const stockMovementSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  type: {
    type: String,
    enum: ['purchase', 'sale', 'adjustment', 'transfer', 'return', 'damage', 'expired'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  previousStock: {
    type: Number,
    required: true,
  },
  newStock: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    default: 'piece',
  },
  reference: {
    type: String, // Reference to the transaction (PO, SO, etc.)
  },
  reason: String,
  cost: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  notes: String,
}, {
  timestamps: true,
});

// Enhanced Stock In Schema (Purchase Orders)
const purchaseOrderSchema = new mongoose.Schema({
  poNumber: {
    type: String,
    unique: true,
    required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitCost: {
      type: Number,
      required: true,
      min: 0,
    },
    totalCost: {
      type: Number,
      required: true,
      min: 0,
    },
    receivedQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    batchNumber: String,
    expiryDate: Date,
  }],
  status: {
    type: String,
    enum: ['draft', 'sent', 'confirmed', 'partial', 'received', 'cancelled'],
    default: 'draft',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  expectedDate: Date,
  receivedDate: Date,
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  tax: {
    type: Number,
    default: 0,
    min: 0,
  },
  shipping: {
    type: Number,
    default: 0,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  dueAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'overdue'],
    default: 'pending',
  },
  notes: String,
  attachments: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Enhanced Sales Order Schema
const salesOrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    serialNumbers: [String],
    batchNumber: String,
  }],
  status: {
    type: String,
    enum: ['draft', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'draft',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  shippingDate: Date,
  deliveryDate: Date,
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
  tax: {
    type: Number,
    default: 0,
    min: 0,
  },
  shipping: {
    type: Number,
    default: 0,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  dueAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'check', 'credit'],
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Indexes for better performance
productSchema.index({ sku: 1 });
productSchema.index({ barcode: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ 'category.main': 1 });
productSchema.index({ status: 1 });
productSchema.index({ 'inventory.currentStock': 1 });

stockMovementSchema.index({ product: 1, createdAt: -1 });
stockMovementSchema.index({ location: 1, createdAt: -1 });
stockMovementSchema.index({ type: 1 });

purchaseOrderSchema.index({ poNumber: 1 });
purchaseOrderSchema.index({ vendor: 1 });
purchaseOrderSchema.index({ status: 1 });
purchaseOrderSchema.index({ createdAt: -1 });

salesOrderSchema.index({ orderNumber: 1 });
salesOrderSchema.index({ customer: 1 });
salesOrderSchema.index({ status: 1 });
salesOrderSchema.index({ createdAt: -1 });

const productModel = mongoose.model('Product', productSchema);
const stockMovementModel = mongoose.model('StockMovement', stockMovementSchema);
const purchaseOrderModel = mongoose.model('PurchaseOrder', purchaseOrderSchema);
const salesOrderModel = mongoose.model('SalesOrder', salesOrderSchema);

export { 
  productModel, 
  stockMovementModel, 
  purchaseOrderModel, 
  salesOrderModel 
};