import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/lib/config.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudnaryCloudName || 'dnjfvujwg',
  api_key: config.cloudnaryApiKey || '811693858436646',
  api_secret: config.cloudnaryApiSecret || 'gkD9Qi38X190ZmuNqetYQYt4svI',
});

class CloudinaryService {
  /**
   * Upload image to Cloudinary
   * @param {string} imagePath - Local path or base64 string of image
   * @param {object} options - Upload options
   * @returns {Promise<object>} Upload result
   */
  async uploadImage(imagePath, options = {}) {
    try {
      const defaultOptions = {
        folder: 'inventory-genie',
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        resource_type: 'image',
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      };

      const uploadOptions = { ...defaultOptions, ...options };
      const result = await cloudinary.uploader.upload(imagePath, uploadOptions);

      return {
        success: true,
        data: {
          public_id: result.public_id,
          url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          created_at: result.created_at
        }
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Upload multiple images
   * @param {Array} imagePaths - Array of image paths
   * @param {object} options - Upload options
   * @returns {Promise<Array>} Array of upload results
   */
  async uploadMultipleImages(imagePaths, options = {}) {
    try {
      const uploadPromises = imagePaths.map(imagePath => 
        this.uploadImage(imagePath, options)
      );
      
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error('Multiple upload error:', error);
      throw error;
    }
  }

  /**
   * Delete image from Cloudinary
   * @param {string} publicId - Public ID of the image to delete
   * @returns {Promise<object>} Deletion result
   */
  async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return {
        success: result.result === 'ok',
        result: result.result
      };
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate optimized image URL
   * @param {string} publicId - Public ID of the image
   * @param {object} transformations - Image transformations
   * @returns {string} Optimized image URL
   */
  getOptimizedUrl(publicId, transformations = {}) {
    const defaultTransformations = {
      quality: 'auto',
      fetch_format: 'auto'
    };

    const finalTransformations = { ...defaultTransformations, ...transformations };
    
    return cloudinary.url(publicId, finalTransformations);
  }

  /**
   * Generate thumbnail URL
   * @param {string} publicId - Public ID of the image
   * @param {number} width - Thumbnail width
   * @param {number} height - Thumbnail height
   * @returns {string} Thumbnail URL
   */
  getThumbnailUrl(publicId, width = 150, height = 150) {
    return cloudinary.url(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto'
    });
  }

  /**
   * Get image details
   * @param {string} publicId - Public ID of the image
   * @returns {Promise<object>} Image details
   */
  async getImageDetails(publicId) {
    try {
      const result = await cloudinary.api.resource(publicId);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Get image details error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * List images in a folder
   * @param {string} folder - Folder name
   * @param {number} maxResults - Maximum number of results
   * @returns {Promise<object>} List of images
   */
  async listImages(folder = 'inventory-genie', maxResults = 50) {
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folder,
        max_results: maxResults
      });

      return {
        success: true,
        data: result.resources,
        total: result.total_count
      };
    } catch (error) {
      console.error('List images error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new CloudinaryService();