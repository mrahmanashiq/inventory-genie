import { API_CLIENT } from './axios';

export const uploadApis = {
  // Upload single image
  uploadSingle: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await API_CLIENT.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload multiple images
  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    
    const response = await API_CLIENT.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete image
  deleteImage: async (publicId) => {
    const response = await API_CLIENT.delete(`/upload/delete/${publicId}`);
    return response.data;
  },

  // Get optimized image URL
  getOptimizedUrl: async (publicId, options = {}) => {
    const params = new URLSearchParams(options);
    const response = await API_CLIENT.get(`/upload/optimize/${publicId}?${params}`);
    return response.data;
  },

  // List uploaded images
  listImages: async (options = {}) => {
    const params = new URLSearchParams(options);
    const response = await API_CLIENT.get(`/upload/list?${params}`);
    return response.data;
  },
};

export default uploadApis;