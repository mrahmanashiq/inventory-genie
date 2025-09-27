import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { userModel } from '../models/user.model.js';
import { auditLogModel } from '../models/system.model.js';

// Enhanced Authentication Middleware
export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                 req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and check if still active
    const user = await userModel.findById(decoded.id);
    if (!user || user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user inactive',
      });
    }

    // Add user data to request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      locations: user.locations,
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};

// Enhanced Authorization Middleware with RBAC
export const authorize = (requiredRoles = [], requiredPermissions = []) => {
  return async (req, res, next) => {
    try {
      const { role, permissions } = req.user;

      // Check role-based access
      if (requiredRoles.length > 0) {
        // Super admin has access to everything
        if (role === 'super_admin') {
          return next();
        }

        // Check if user has required role
        if (!requiredRoles.includes(role)) {
          await auditLogModel.create({
            user: req.user.id,
            action: 'read',
            resource: 'access_denied',
            resourceId: req.path,
            details: `Access denied: Role ${role} not authorized for ${req.path}`,
            severity: 'medium',
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
          });

          return res.status(403).json({
            success: false,
            message: 'Insufficient role permissions',
          });
        }
      }

      // Check permission-based access
      if (requiredPermissions.length > 0) {
        const hasPermission = requiredPermissions.every(reqPerm => {
          const [module, action] = reqPerm.split(':');
          const userPermission = permissions.find(p => p.module === module);
          return userPermission && userPermission.actions.includes(action);
        });

        if (!hasPermission) {
          await auditLogModel.create({
            user: req.user.id,
            action: 'read',
            resource: 'access_denied',
            resourceId: req.path,
            details: `Access denied: Missing permissions ${requiredPermissions.join(', ')}`,
            severity: 'medium',
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
          });

          return res.status(403).json({
            success: false,
            message: 'Insufficient permissions',
          });
        }
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Authorization error',
      });
    }
  };
};

// Location-based Access Control
export const checkLocationAccess = (locationField = 'locationId') => {
  return (req, res, next) => {
    try {
      const { locations, role } = req.user;
      const requestedLocation = req.params[locationField] || req.body[locationField];

      // Super admin and admin have access to all locations
      if (role === 'super_admin' || role === 'admin') {
        return next();
      }

      // Check if user has access to the requested location
      if (requestedLocation && !locations.includes(requestedLocation)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Location not authorized',
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Location access check error',
      });
    }
  };
};

// Rate Limiting Middlewares
export const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Different rate limits for different endpoints
export const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  50, // 50 attempts (increased from 5 for development)
  'Too many authentication attempts, please try again later'
);

// Separate rate limit for auth status checks (more permissive)
export const authStatusRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  200, // 200 requests (very permissive for status checks)
  'Too many auth status requests, please try again later'
);

export const apiRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many API requests, please try again later'
);

export const uploadRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 hour
  10, // 10 uploads
  'Too many upload attempts, please try again later'
);

// Security Headers Middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.cloudinary.com"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

// Request Logging Middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
  
  // Log response time
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

// Input Sanitization Middleware
export const sanitizeInput = (req, res, next) => {
  // Basic sanitization - remove potentially dangerous characters
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        obj[key] = sanitize(obj[key]);
      });
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};

// Audit Logging Middleware
export const auditLog = (action, resource) => {
  return async (req, res, next) => {
    try {
      // Store original res.json
      const originalJson = res.json;
      
      res.json = function(data) {
        // Log successful operations
        if (res.statusCode < 400 && req.user) {
          auditLogModel.create({
            user: req.user.id,
            action,
            resource,
            resourceId: req.params.id || req.body.id || 'unknown',
            details: `${action} ${resource}`,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
          }).catch(console.error);
        }
        
        // Call original json method
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      next();
    }
  };
};

// Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};