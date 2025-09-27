import mongoose from 'mongoose';

// Enhanced User Schema with RBAC
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 6,
    },
    role: {
      type: String,
      required: true,
      enum: ['super_admin', 'admin', 'manager', 'inventory_staff', 'sales_staff', 'viewer'],
      default: 'viewer',
    },
    permissions: [{
      module: {
        type: String,
        required: true,
        enum: ['users', 'products', 'inventory', 'sales', 'customers', 'vendors', 'reports', 'settings'],
      },
      actions: [{
        type: String,
        enum: ['create', 'read', 'update', 'delete', 'export'],
      }],
    }],
    profile: {
      avatar: String,
      phone: String,
      address: String,
      department: String,
      employeeId: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    lastLogin: Date,
    refreshToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    twoFactorSecret: String,
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    locations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
    }],
  },
  {
    timestamps: true,
  }
);

// Enhanced Customer Schema
const customerSchema = new mongoose.Schema({
  customerId: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  customerType: {
    type: String,
    enum: ['regular', 'vip', 'wholesale', 'retail'],
    default: 'regular',
  },
  creditLimit: {
    type: Number,
    default: 0,
  },
  outstandingBalance: {
    type: Number,
    default: 0,
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active',
  },
  notes: String,
  tags: [String],
  totalPurchases: {
    type: Number,
    default: 0,
  },
  lastPurchaseDate: Date,
}, {
  timestamps: true,
});

// Enhanced Vendor Schema
const vendorSchema = new mongoose.Schema({
  vendorId: {
    type: String,
    unique: true,
    required: true,
  },
  agentName: {
    type: String,
    required: true,
    trim: true,
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  taxNumber: String,
  bankDetails: {
    accountNumber: String,
    routingNumber: String,
    bankName: String,
  },
  paymentTerms: {
    type: String,
    enum: ['net_15', 'net_30', 'net_60', 'net_90', 'cod', 'prepaid'],
    default: 'net_30',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  notes: String,
  tags: [String],
  totalPurchases: {
    type: Number,
    default: 0,
  },
  lastPurchaseDate: Date,
}, {
  timestamps: true,
});

// Location/Warehouse Schema
const locationSchema = new mongoose.Schema({
  locationId: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['warehouse', 'store', 'outlet', 'online'],
    required: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active',
  },
  capacity: {
    maxItems: Number,
    maxWeight: Number,
    maxVolume: Number,
  },
  settings: {
    autoReorder: {
      type: Boolean,
      default: false,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
  },
}, {
  timestamps: true,
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

customerSchema.index({ customerId: 1 });
customerSchema.index({ email: 1 });
customerSchema.index({ phone: 1 });
customerSchema.index({ customerType: 1 });

vendorSchema.index({ vendorId: 1 });
vendorSchema.index({ companyName: 1 });
vendorSchema.index({ email: 1 });

locationSchema.index({ locationId: 1 });
locationSchema.index({ type: 1 });
locationSchema.index({ status: 1 });

const userModel = mongoose.model('User', userSchema);
const customerModel = mongoose.model('Customer', customerSchema);
const vendorModel = mongoose.model('Vendor', vendorSchema);
const locationModel = mongoose.model('Location', locationSchema);

export { customerModel, userModel, vendorModel, locationModel };