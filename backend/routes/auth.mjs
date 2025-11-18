import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'bcs-desktop-app-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Get user
    const user = await db.get(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.active) {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await db.run(
      `INSERT INTO sessions (user_id, token, expires_at, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?)`,
      [
        user.id,
        token,
        expiresAt.toISOString(),
        req.ip || req.connection.remoteAddress,
        req.headers['user-agent']
      ]
    );

    // Update last login
    await db.run(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    // Log audit
    await db.run(
      `INSERT INTO audit_logs (user_id, action, details, ip_address)
       VALUES (?, ?, ?, ?)`,
      [user.id, 'login', 'User logged in', req.ip || req.connection.remoteAddress]
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
});

// POST /api/auth/logout
router.post('/logout', authenticate, async (req, res, next) => {
  try {
    // Delete session
    await db.run('DELETE FROM sessions WHERE token = ?', [req.session.token]);

    // Log audit
    await db.run(
      `INSERT INTO audit_logs (user_id, action, details, ip_address)
       VALUES (?, ?, ?, ?)`,
      [req.user.id, 'logout', 'User logged out', req.ip || req.connection.remoteAddress]
    );

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    next(error);
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      full_name: req.user.full_name,
      role: req.user.role
    }
  });
});

// POST /api/auth/change-password
router.post('/change-password', authenticate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Get current user with password
    const user = await db.get('SELECT * FROM users WHERE id = ?', [req.user.id]);

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.run(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedPassword, req.user.id]
    );

    // Log audit
    await db.run(
      `INSERT INTO audit_logs (user_id, action, details, ip_address)
       VALUES (?, ?, ?, ?)`,
      [req.user.id, 'password_change', 'User changed password', req.ip || req.connection.remoteAddress]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    next(error);
  }
});

// POST /api/auth/register (admin only)
router.post('/register', authenticate, async (req, res, next) => {
  try {
    // Only admins can create users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only administrators can create users' });
    }

    const { username, email, password, full_name, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existing = await db.get(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await db.run(
      `INSERT INTO users (username, email, password_hash, full_name, role, active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, email, hashedPassword, full_name || username, role || 'user', 1]
    );

    const newUser = await db.get(
      'SELECT id, username, email, full_name, role, active FROM users WHERE username = ?',
      [username]
    );

    // Log audit
    await db.run(
      `INSERT INTO audit_logs (user_id, action, resource, resource_id, details, ip_address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, 'create_user', 'users', newUser.id, `Created user: ${username}`, req.ip || req.connection.remoteAddress]
    );

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error('Register error:', error);
    next(error);
  }
});

export default router;
