import mongoose from 'mongoose';

// Audit Log Schema for tracking all system activities
const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['create', 'read', 'update', 'delete', 'login', 'logout', 'export', 'import'],
  },
  resource: {
    type: String,
    required: true,
    enum: ['user', 'product', 'customer', 'vendor', 'order', 'inventory', 'report', 'settings'],
  },
  resourceId: {
    type: String, // Can be ObjectId or other identifier
    required: true,
  },
  changes: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed,
  },
  ipAddress: String,
  userAgent: String,
  location: String,
  sessionId: String,
  details: String,
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low',
  },
}, {
  timestamps: true,
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    required: true,
    enum: [
      'low_stock',
      'out_of_stock',
      'reorder_alert',
      'expiry_warning',
      'new_order',
      'order_shipped',
      'payment_due',
      'system_alert',
      'user_activity',
      'report_ready',
    ],
  },
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  data: mongoose.Schema.Types.Mixed, // Additional data related to notification
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread',
  },
  channels: [{
    type: String,
    enum: ['in_app', 'email', 'sms', 'push'],
  }],
  scheduledFor: Date,
  expiresAt: Date,
  readAt: Date,
  archivedAt: Date,
}, {
  timestamps: true,
});

// System Settings Schema
const systemSettingsSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['general', 'inventory', 'sales', 'purchasing', 'notifications', 'security', 'integrations'],
  },
  key: {
    type: String,
    required: true,
  },
  value: mongoose.Schema.Types.Mixed,
  description: String,
  type: {
    type: String,
    enum: ['string', 'number', 'boolean', 'object', 'array'],
    required: true,
  },
  isEditable: {
    type: Boolean,
    default: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Report Schema for saved/scheduled reports
const reportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: [
      'inventory_summary',
      'low_stock',
      'sales_report',
      'purchase_report',
      'profit_loss',
      'customer_analysis',
      'vendor_analysis',
      'product_performance',
      'custom',
    ],
  },
  filters: mongoose.Schema.Types.Mixed,
  schedule: {
    enabled: {
      type: Boolean,
      default: false,
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
    },
    dayOfWeek: Number, // 0-6 for weekly reports
    dayOfMonth: Number, // 1-31 for monthly reports
    time: String, // HH:MM format
    timezone: {
      type: String,
      default: 'UTC',
    },
    lastRun: Date,
    nextRun: Date,
  },
  recipients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  format: {
    type: String,
    enum: ['pdf', 'excel', 'csv', 'json'],
    default: 'pdf',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'error'],
    default: 'active',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastGenerated: Date,
  fileUrl: String,
}, {
  timestamps: true,
});

// Backup Schema for system backups
const backupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['full', 'incremental', 'differential'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed'],
    default: 'pending',
  },
  size: Number, // in bytes
  location: String, // file path or cloud URL
  checksum: String,
  collections: [String], // which collections were backed up
  startedAt: Date,
  completedAt: Date,
  error: String,
  triggeredBy: {
    type: String,
    enum: ['manual', 'scheduled', 'system'],
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Tax Configuration Schema
const taxConfigSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  rate: {
    type: Number,
    required: true,
    min: 0,
  },
  applicableOn: {
    type: String,
    enum: ['product', 'order', 'shipping'],
    required: true,
  },
  regions: [String], // applicable regions/states
  categories: [String], // applicable product categories
  isActive: {
    type: Boolean,
    default: true,
  },
  effectiveFrom: {
    type: Date,
    default: Date.now,
  },
  effectiveTo: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Dashboard Widget Schema for customizable dashboards
const dashboardWidgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  widgets: [{
    id: String,
    type: {
      type: String,
      enum: [
        'sales_overview',
        'inventory_status',
        'low_stock_alerts',
        'recent_orders',
        'top_products',
        'revenue_chart',
        'expense_chart',
        'customer_analytics',
        'custom_metric',
      ],
    },
    position: {
      x: Number,
      y: Number,
      width: Number,
      height: Number,
    },
    config: mongoose.Schema.Types.Mixed,
    isVisible: {
      type: Boolean,
      default: true,
    },
  }],
  layout: {
    type: String,
    enum: ['grid', 'flex'],
    default: 'grid',
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'auto'],
    default: 'light',
  },
}, {
  timestamps: true,
});

// Indexes
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ resource: 1, action: 1 });
auditLogSchema.index({ createdAt: -1 });

notificationSchema.index({ recipient: 1, status: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ createdAt: -1 });

systemSettingsSchema.index({ category: 1, key: 1 }, { unique: true });

reportSchema.index({ type: 1 });
reportSchema.index({ createdBy: 1 });
reportSchema.index({ 'schedule.enabled': 1, 'schedule.nextRun': 1 });

backupSchema.index({ createdAt: -1 });
backupSchema.index({ status: 1 });

taxConfigSchema.index({ isActive: 1 });
taxConfigSchema.index({ applicableOn: 1 });

dashboardWidgetSchema.index({ user: 1 }, { unique: true });

const auditLogModel = mongoose.model('AuditLog', auditLogSchema);
const notificationModel = mongoose.model('Notification', notificationSchema);
const systemSettingsModel = mongoose.model('SystemSettings', systemSettingsSchema);
const reportModel = mongoose.model('Report', reportSchema);
const backupModel = mongoose.model('Backup', backupSchema);
const taxConfigModel = mongoose.model('TaxConfig', taxConfigSchema);
const dashboardWidgetModel = mongoose.model('DashboardWidget', dashboardWidgetSchema);

export {
  auditLogModel,
  notificationModel,
  systemSettingsModel,
  reportModel,
  backupModel,
  taxConfigModel,
  dashboardWidgetModel,
};