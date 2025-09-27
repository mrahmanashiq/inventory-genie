import { v4 as uuidv4 } from 'uuid';
import { productModel } from '../models/product.model.js';

// Generate unique SKU for products
export const generateSKU = async (productName, category = '') => {
  try {
    // Create base SKU from product name and category
    const namePrefix = productName
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 3);
    
    const categoryPrefix = category
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 2);
    
    const timestamp = Date.now().toString().slice(-4);
    const baseSKU = `${categoryPrefix}${namePrefix}${timestamp}`;
    
    // Check if SKU exists and make it unique
    let counter = 1;
    let finalSKU = baseSKU;
    
    while (await productModel.findOne({ sku: finalSKU })) {
      finalSKU = `${baseSKU}${counter.toString().padStart(2, '0')}`;
      counter++;
    }
    
    return finalSKU;
  } catch (error) {
    // Fallback to UUID-based SKU
    return `PRD${uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase()}`;
  }
};

// Generate unique User ID
export const generateUserId = async () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `USER${timestamp.slice(-6)}${random}`;
};

// Generate unique Customer ID
export const generateCustomerId = async () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `CUST${timestamp.slice(-6)}${random}`;
};

// Generate unique Vendor ID
export const generateVendorId = async () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `VEND${timestamp.slice(-6)}${random}`;
};

// Generate unique Location ID
export const generateLocationId = async () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `LOC${timestamp.slice(-6)}${random}`;
};

// Generate unique Order Numbers
export const generateOrderNumber = (prefix = 'ORD') => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `${prefix}${timestamp.slice(-8)}${random}`;
};

// Generate unique Purchase Order Numbers
export const generatePONumber = () => {
  return generateOrderNumber('PO');
};

// Generate unique Sales Order Numbers
export const generateSONumber = () => {
  return generateOrderNumber('SO');
};

// Generate Barcode (placeholder - in real implementation, use proper barcode algorithm)
export const generateBarcode = () => {
  // Simple 13-digit barcode generator (EAN-13 format placeholder)
  const timestamp = Date.now().toString();
  const random = Math.random().toString().substring(2, 8);
  return `${timestamp.slice(-7)}${random}`;
};

// Generate Batch Number
export const generateBatchNumber = (productName = '') => {
  const prefix = productName
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 3);
  
  const date = new Date();
  const dateString = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 4).toUpperCase();
  
  return `${prefix}${dateString}${random}`;
};

// Generate Serial Number
export const generateSerialNumber = (productSKU = '') => {
  const skuPrefix = productSKU.slice(0, 4);
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return `${skuPrefix}${timestamp.slice(-6)}${random}`;
};