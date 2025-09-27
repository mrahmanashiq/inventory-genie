import { Router } from 'express';
import inventoryController from '../controllers/inventory.controller.js';
import { 
  authenticate, 
  authorize, 
  checkLocationAccess,
  apiRateLimit, 
  auditLog,
  sanitizeInput 
} from '../middleware/auth.middleware.js';

const router = Router();

// Apply authentication, rate limiting, and input sanitization to all routes
router.use(authenticate);
router.use(apiRateLimit);
router.use(sanitizeInput);

/**
 * @swagger
 * /inventory/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - pricing
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *               description:
 *                 type: string
 *               category:
 *                 type: object
 *                 properties:
 *                   main:
 *                     type: string
 *                   sub:
 *                     type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *               brand:
 *                 type: string
 *               pricing:
 *                 type: object
 *                 properties:
 *                   cost:
 *                     type: number
 *                     minimum: 0
 *                   price:
 *                     type: number
 *                     minimum: 0
 *                   wholesalePrice:
 *                     type: number
 *                     minimum: 0
 *                   currency:
 *                     type: string
 *                     default: USD
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Insufficient permissions
 */
router.post('/products',
  authorize(['super_admin', 'admin', 'manager', 'inventory_staff'], ['products:create']),
  auditLog('create', 'product'),
  inventoryController.createProduct
);

/**
 * @swagger
 * /inventory/products:
 *   get:
 *     summary: Get products with filtering and pagination
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, discontinued]
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: lowStock
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: outOfStock
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       403:
 *         description: Insufficient permissions
 */
router.get('/products',
  authorize(['super_admin', 'admin', 'manager', 'inventory_staff', 'sales_staff', 'viewer'], ['products:read']),
  inventoryController.getProducts
);

/**
 * @swagger
 * /inventory/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 *       403:
 *         description: Insufficient permissions
 */
router.get('/products/:id',
  authorize(['super_admin', 'admin', 'manager', 'inventory_staff', 'sales_staff', 'viewer'], ['products:read']),
  inventoryController.getProductById
);

/**
 * @swagger
 * /inventory/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               pricing:
 *                 type: object
 *                 properties:
 *                   cost:
 *                     type: number
 *                   price:
 *                     type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 *       403:
 *         description: Insufficient permissions
 */
router.put('/products/:id',
  authorize(['super_admin', 'admin', 'manager', 'inventory_staff'], ['products:update']),
  auditLog('update', 'product'),
  inventoryController.updateProduct
);

/**
 * @swagger
 * /inventory/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Cannot delete product with existing stock
 *       404:
 *         description: Product not found
 *       403:
 *         description: Insufficient permissions
 */
router.delete('/products/:id',
  authorize(['super_admin', 'admin'], ['products:delete']),
  auditLog('delete', 'product'),
  inventoryController.deleteProduct
);

/**
 * @swagger
 * /inventory/stock/add:
 *   post:
 *     summary: Add stock to product
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - locationId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               locationId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *               type:
 *                 type: string
 *                 enum: [purchase, adjustment, return]
 *                 default: adjustment
 *               reason:
 *                 type: string
 *               reference:
 *                 type: string
 *     responses:
 *       200:
 *         description: Stock added successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Insufficient permissions
 */
router.post('/stock/add',
  authorize(['super_admin', 'admin', 'manager', 'inventory_staff'], ['inventory:update']),
  checkLocationAccess('locationId'),
  auditLog('update', 'inventory'),
  inventoryController.addStock
);

/**
 * @swagger
 * /inventory/stock/remove:
 *   post:
 *     summary: Remove stock from product
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - locationId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               locationId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *               type:
 *                 type: string
 *                 enum: [sale, adjustment, damage, expired]
 *                 default: adjustment
 *               reason:
 *                 type: string
 *               reference:
 *                 type: string
 *     responses:
 *       200:
 *         description: Stock removed successfully
 *       400:
 *         description: Insufficient stock available
 *       403:
 *         description: Insufficient permissions
 */
router.post('/stock/remove',
  authorize(['super_admin', 'admin', 'manager', 'inventory_staff'], ['inventory:update']),
  checkLocationAccess('locationId'),
  auditLog('update', 'inventory'),
  inventoryController.removeStock
);

/**
 * @swagger
 * /inventory/stock/transfer:
 *   post:
 *     summary: Transfer stock between locations
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - fromLocationId
 *               - toLocationId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               fromLocationId:
 *                 type: string
 *               toLocationId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Stock transferred successfully
 *       400:
 *         description: Insufficient stock or invalid locations
 *       403:
 *         description: Insufficient permissions
 */
router.post('/stock/transfer',
  authorize(['super_admin', 'admin', 'manager', 'inventory_staff'], ['inventory:update']),
  auditLog('update', 'inventory'),
  inventoryController.transferStock
);

/**
 * @swagger
 * /inventory/stock/movements:
 *   get:
 *     summary: Get stock movement history
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *       - in: query
 *         name: locationId
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Stock movements retrieved successfully
 *       403:
 *         description: Insufficient permissions
 */
router.get('/stock/movements',
  authorize(['super_admin', 'admin', 'manager', 'inventory_staff', 'viewer'], ['inventory:read']),
  inventoryController.getStockMovements
);

/**
 * @swagger
 * /inventory/alerts/low-stock:
 *   get:
 *     summary: Get low stock products
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: locationId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Low stock products retrieved successfully
 *       403:
 *         description: Insufficient permissions
 */
router.get('/alerts/low-stock',
  authorize(['super_admin', 'admin', 'manager', 'inventory_staff', 'viewer'], ['inventory:read']),
  inventoryController.getLowStockProducts
);

/**
 * @swagger
 * /inventory/alerts/out-of-stock:
 *   get:
 *     summary: Get out of stock products
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: locationId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Out of stock products retrieved successfully
 *       403:
 *         description: Insufficient permissions
 */
router.get('/alerts/out-of-stock',
  authorize(['super_admin', 'admin', 'manager', 'inventory_staff', 'viewer'], ['inventory:read']),
  inventoryController.getOutOfStockProducts
);

/**
 * @swagger
 * /inventory/analytics:
 *   get:
 *     summary: Get inventory analytics
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: locationId
 *         schema:
 *           type: string
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y]
 *           default: 30d
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 *       403:
 *         description: Insufficient permissions
 */
router.get('/analytics',
  authorize(['super_admin', 'admin', 'manager', 'viewer'], ['reports:read']),
  inventoryController.getInventoryAnalytics
);

export default router;