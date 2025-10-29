// routes/users.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const db = require('../db');

// GET /api/users/me
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
});

// Example: admin-only route to list users (very basic)
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== 'tutor') return res.status(403).json({ error: 'Admins/tutors only' });
    const { rows } = await db.query('SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
