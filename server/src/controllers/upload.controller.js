import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cloudinaryService from '../services/cloudinary.service.js';

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedFileTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

class UploadController {
  /**
   * Upload single image
   */
  static uploadSingle = upload.single('image');

  /**
   * Upload multiple images
   */
  static uploadMultiple = upload.array('images', 10);

  /**
   * Handle single image upload to Cloudinary
   */
  static async handleSingleUpload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      // Convert buffer to base64 for Cloudinary upload
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      
      const uploadOptions = {
        folder: 'inventory-genie/products',
        public_id: `product_${Date.now()}`,
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      };

      const result = await cloudinaryService.uploadImage(base64Image, uploadOptions);

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: 'Image uploaded successfully',
          data: result.data
        });
      } else {
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Handle multiple images upload to Cloudinary
   */
  static async handleMultipleUpload(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No image files provided'
        });
      }

      const uploadPromises = req.files.map((file, index) => {
        const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        
        const uploadOptions = {
          folder: 'inventory-genie/products',
          public_id: `product_${Date.now()}_${index}`,
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        };

        return cloudinaryService.uploadImage(base64Image, uploadOptions);
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(result => result.success);
      const failedUploads = results.filter(result => !result.success);

      return res.status(200).json({
        success: true,
        message: `${successfulUploads.length} images uploaded successfully`,
        data: {
          successful: successfulUploads.map(result => result.data),
          failed: failedUploads.length,
          failedErrors: failedUploads.map(result => result.error)
        }
      });
    } catch (error) {
      console.error('Multiple upload error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Delete image from Cloudinary
   */
  static async deleteImage(req, res) {
    try {
      const { publicId } = req.params;

      if (!publicId) {
        return res.status(400).json({
          success: false,
          message: 'Public ID is required'
        });
      }

      const result = await cloudinaryService.deleteImage(publicId);

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: 'Image deleted successfully'
        });
      } else {
        return res.status(500).json({
          success: false,
          message: 'Failed to delete image',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Get optimized image URL
   */
  static async getOptimizedUrl(req, res) {
    try {
      const { publicId } = req.params;
      const { width, height, crop } = req.query;

      if (!publicId) {
        return res.status(400).json({
          success: false,
          message: 'Public ID is required'
        });
      }

      const transformations = {};
      if (width) transformations.width = parseInt(width);
      if (height) transformations.height = parseInt(height);
      if (crop) transformations.crop = crop;

      const optimizedUrl = cloudinaryService.getOptimizedUrl(publicId, transformations);

      return res.status(200).json({
        success: true,
        data: {
          originalPublicId: publicId,
          optimizedUrl: optimizedUrl
        }
      });
    } catch (error) {
      console.error('Get optimized URL error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * List all uploaded images
   */
  static async listImages(req, res) {
    try {
      const { folder, limit } = req.query;
      const maxResults = limit ? parseInt(limit) : 50;
      const folderName = folder || 'inventory-genie';

      const result = await cloudinaryService.listImages(folderName, maxResults);

      if (result.success) {
        return res.status(200).json({
          success: true,
          data: result.data,
          total: result.total
        });
      } else {
        return res.status(500).json({
          success: false,
          message: 'Failed to list images',
          error: result.error
        });
      }
    } catch (error) {
      console.error('List images error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

export default UploadController;