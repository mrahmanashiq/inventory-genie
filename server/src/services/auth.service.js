import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.model.js';
import { auditLogModel } from '../models/system.model.js';
import { generateUserId } from '../utils/generators.js';

class AuthService {
  async register(userData, addedBy = null) {
    try {
      const { name, email, password, role = 'viewer', permissions = [] } = userData;

      // Check if user already exists
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Generate user ID
      const userId = await generateUserId();

      // Create user
      const user = await userModel.create({
        userId,
        name,
        email,
        password: hashedPassword,
        role,
        permissions,
        addedBy,
      });

      // Log audit
      if (addedBy) {
        await auditLogModel.create({
          user: addedBy,
          action: 'create',
          resource: 'user',
          resourceId: user._id.toString(),
          details: `Created user: ${email}`,
        });
      }

      return {
        success: true,
        user: this._sanitizeUser(user),
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to register user');
    }
  }

  async login(email, password, ipAddress, userAgent) {
    try {
      // Find user with password
      const user = await userModel.findOne({ email }).select('+password');
      if (!user || user.status !== 'active') {
        throw new Error('Invalid credentials or account is inactive');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Generate tokens
      const accessToken = this._generateAccessToken(user);
      const refreshToken = this._generateRefreshToken(user);

      // Update user with refresh token and last login
      await userModel.findByIdAndUpdate(user._id, {
        refreshToken,
        lastLogin: new Date(),
      });

      // Log audit
      await auditLogModel.create({
        user: user._id,
        action: 'login',
        resource: 'user',
        resourceId: user._id.toString(),
        ipAddress,
        userAgent,
        details: 'User logged in',
      });

      return {
        success: true,
        user: this._sanitizeUser(user),
        tokens: {
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to login');
    }
  }

  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // Find user with the refresh token
      const user = await userModel.findOne({
        _id: decoded.id,
        refreshToken,
        status: 'active',
      });

      if (!user) {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      const newAccessToken = this._generateAccessToken(user);
      const newRefreshToken = this._generateRefreshToken(user);

      // Update user with new refresh token
      await userModel.findByIdAndUpdate(user._id, {
        refreshToken: newRefreshToken,
      });

      return {
        success: true,
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async logout(userId, ipAddress, userAgent) {
    try {
      // Clear refresh token
      await userModel.findByIdAndUpdate(userId, {
        refreshToken: null,
      });

      // Log audit
      await auditLogModel.create({
        user: userId,
        action: 'logout',
        resource: 'user',
        resourceId: userId.toString(),
        ipAddress,
        userAgent,
        details: 'User logged out',
      });

      return { success: true };
    } catch (error) {
      throw new Error('Failed to logout');
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      // Find user with password
      const user = await userModel.findById(userId).select('+password');
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await userModel.findByIdAndUpdate(userId, {
        password: hashedNewPassword,
        refreshToken: null, // Clear refresh token to force re-login
      });

      // Log audit
      await auditLogModel.create({
        user: userId,
        action: 'update',
        resource: 'user',
        resourceId: userId.toString(),
        details: 'Password changed',
        severity: 'medium',
      });

      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Failed to change password');
    }
  }

  async resetPassword(email) {
    try {
      const user = await userModel.findOne({ email, status: 'active' });
      if (!user) {
        // Don't reveal if user exists or not
        return { success: true, message: 'If the email exists, a reset link has been sent' };
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_RESET_SECRET,
        { expiresIn: '1h' }
      );

      // Save reset token
      await userModel.findByIdAndUpdate(user._id, {
        passwordResetToken: resetToken,
        passwordResetExpires: new Date(Date.now() + 3600000), // 1 hour
      });

      // TODO: Send email with reset link
      // await emailService.sendPasswordResetEmail(user.email, resetToken);

      // Log audit
      await auditLogModel.create({
        user: user._id,
        action: 'update',
        resource: 'user',
        resourceId: user._id.toString(),
        details: 'Password reset requested',
        severity: 'medium',
      });

      return { success: true, message: 'Password reset link sent to your email' };
    } catch (error) {
      throw new Error('Failed to process password reset');
    }
  }

  async verifyResetToken(token, newPassword) {
    try {
      // Verify reset token
      const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
      
      // Find user with valid reset token
      const user = await userModel.findOne({
        _id: decoded.id,
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() },
      });

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password and clear reset token
      await userModel.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        refreshToken: null, // Clear refresh token
      });

      // Log audit
      await auditLogModel.create({
        user: user._id,
        action: 'update',
        resource: 'user',
        resourceId: user._id.toString(),
        details: 'Password reset completed',
        severity: 'medium',
      });

      return { success: true, message: 'Password reset successful' };
    } catch (error) {
      throw new Error(error.message || 'Failed to reset password');
    }
  }

  async getUserProfile(userId) {
    try {
      const user = await userModel.findById(userId).populate('addedBy', 'name email');
      if (!user) {
        throw new Error('User not found');
      }

      return {
        success: true,
        user: this._sanitizeUser(user),
      };
    } catch (error) {
      throw new Error('Failed to get user profile');
    }
  }

  async updateProfile(userId, updateData) {
    try {
      const allowedUpdates = ['name', 'profile.phone', 'profile.address', 'profile.avatar'];
      const updates = {};

      // Filter allowed updates
      Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates[key] = updateData[key];
        }
      });

      if (Object.keys(updates).length === 0) {
        throw new Error('No valid updates provided');
      }

      const user = await userModel.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
      );

      // Log audit
      await auditLogModel.create({
        user: userId,
        action: 'update',
        resource: 'user',
        resourceId: userId.toString(),
        changes: { after: updates },
        details: 'Profile updated',
      });

      return {
        success: true,
        user: this._sanitizeUser(user),
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  _generateAccessToken(user) {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );
  }

  _generateRefreshToken(user) {
    return jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
  }

  _sanitizeUser(user) {
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.refreshToken;
    delete userObject.passwordResetToken;
    delete userObject.passwordResetExpires;
    delete userObject.twoFactorSecret;
    return userObject;
  }
}

export default new AuthService();