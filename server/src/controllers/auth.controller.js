import { z } from 'zod';
import authService from '../services/auth.service.js';

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['super_admin', 'admin', 'manager', 'inventory_staff', 'sales_staff', 'viewer']).optional(),
  permissions: z.array(z.object({
    module: z.string(),
    actions: z.array(z.string()),
  })).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

const verifyResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  'profile.phone': z.string().optional(),
  'profile.address': z.string().optional(),
  'profile.avatar': z.string().url('Invalid avatar URL').optional(),
});

export class AuthController {
  async register(req, res) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await authService.register(validatedData, req.user?.id);
      
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;
      
      const result = await authService.login(
        email,
        password,
        req.ip,
        req.get('User-Agent')
      );

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        success: result.success,
        user: result.user,
        accessToken: result.tokens.accessToken,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token required',
        });
      }

      const result = await authService.refreshToken(refreshToken);

      // Set new refresh token as httpOnly cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        success: result.success,
        accessToken: result.tokens.accessToken,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  async logout(req, res) {
    try {
      await authService.logout(req.user.id, req.ip, req.get('User-Agent'));
      
      // Clear refresh token cookie
      res.clearCookie('refreshToken');
      
      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async changePassword(req, res) {
    try {
      const validatedData = changePasswordSchema.parse(req.body);
      const { currentPassword, newPassword } = validatedData;
      
      const result = await authService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );
      
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const validatedData = resetPasswordSchema.parse(req.body);
      const { email } = validatedData;
      
      const result = await authService.resetPassword(email);
      
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async verifyResetToken(req, res) {
    try {
      const validatedData = verifyResetSchema.parse(req.body);
      const { token, newPassword } = validatedData;
      
      const result = await authService.verifyResetToken(token, newPassword);
      
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getProfile(req, res) {
    try {
      const result = await authService.getUserProfile(req.user.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const validatedData = updateProfileSchema.parse(req.body);
      
      const result = await authService.updateProfile(req.user.id, validatedData);
      
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getMe(req, res) {
    try {
      const result = await authService.getUserProfile(req.user.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async checkAuthStatus(req, res) {
    try {
      // Check if user is authenticated without requiring authentication
      let token;
      
      const cookie = req.cookies?.token || null;
      const bearerToken = req.headers.authorization?.split(' ')[1] || null;

      if (cookie) {
        token = cookie;
      } else {
        token = bearerToken;
      }

      if (!token) {
        return res.json({
          success: true,
          data: {
            isLoggedIn: false,
            user: null
          }
        });
      }

      try {
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
        
        // Get user data
        const result = await authService.getUserProfile(decoded.id || decoded.userId);
        
        return res.json({
          success: true,
          data: {
            isLoggedIn: true,
            user: result.data
          }
        });
      } catch (tokenError) {
        // Token is invalid
        return res.json({
          success: true,
          data: {
            isLoggedIn: false,
            user: null
          }
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new AuthController();