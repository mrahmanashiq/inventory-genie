import express from 'express';
import UploadController from '../controllers/upload.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UploadResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             public_id:
 *               type: string
 *             url:
 *               type: string
 *             width:
 *               type: number
 *             height:
 *               type: number
 *             format:
 *               type: string
 *             bytes:
 *               type: number
 */

/**
 * @swagger
 * /api/upload/single:
 *   post:
 *     summary: Upload a single image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: No image file provided
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/single', 
  authenticate,
  authorize(['admin', 'manager', 'employee']),
  UploadController.uploadSingle,
  UploadController.handleSingleUpload
);

/**
 * @swagger
 * /api/upload/multiple:
 *   post:
 *     summary: Upload multiple images
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of image files to upload (max 10)
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     successful:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UploadResponse/properties/data'
 *                     failed:
 *                       type: number
 *                     failedErrors:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: No image files provided
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/multiple',
  authenticate,
  authorize(['admin', 'manager', 'employee']),
  UploadController.uploadMultiple,
  UploadController.handleMultipleUpload
);

/**
 * @swagger
 * /api/upload/delete/{publicId}:
 *   delete:
 *     summary: Delete an image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: publicId
 *         required: true
 *         schema:
 *           type: string
 *         description: Public ID of the image to delete
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       400:
 *         description: Public ID is required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:publicId',
  authenticate,
  authorize(['admin', 'manager']),
  UploadController.deleteImage
);

/**
 * @swagger
 * /api/upload/optimize/{publicId}:
 *   get:
 *     summary: Get optimized image URL
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: publicId
 *         required: true
 *         schema:
 *           type: string
 *         description: Public ID of the image
 *       - in: query
 *         name: width
 *         schema:
 *           type: integer
 *         description: Desired width of the image
 *       - in: query
 *         name: height
 *         schema:
 *           type: integer
 *         description: Desired height of the image
 *       - in: query
 *         name: crop
 *         schema:
 *           type: string
 *           enum: [fill, fit, limit, scale, crop]
 *         description: Crop mode for the image
 *     responses:
 *       200:
 *         description: Optimized URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     originalPublicId:
 *                       type: string
 *                     optimizedUrl:
 *                       type: string
 *       400:
 *         description: Public ID is required
 *       500:
 *         description: Internal server error
 */
router.get('/optimize/:publicId', UploadController.getOptimizedUrl);

/**
 * @swagger
 * /api/upload/list:
 *   get:
 *     summary: List all uploaded images
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: folder
 *         schema:
 *           type: string
 *         description: Folder name to list images from
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of images to return (default 50)
 *     responses:
 *       200:
 *         description: Images listed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/list',
  authenticate,
  authorize(['admin', 'manager']),
  UploadController.listImages
);

export default router;