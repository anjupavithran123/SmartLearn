// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

exports.signup = async (req, res, next) => {
  console.log('SIGNUP HIT:', req.method, req.path, 'body:', req.body);

  try {
    // accept either `full_name` or `name` from client
    const full_name = req.body.full_name || req.body.name;
    const { email, password, role } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'full_name (or name), email and password are required' });
    }

    // Check exist
    const exists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length) return res.status(409).json({ error: 'Email already registered' });

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const result = await db.query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES ($1,$2,$3,$4)
       RETURNING id, full_name, email, role, created_at`,
      [full_name, email, hash, role || 'student']
    );

    const user = result.rows[0];
    const token = signToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    // Detailed server-side logging (do not return full error to client)
    console.error('Signup DB ERROR:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      hint: err.hint,
      constraint: err.constraint,
      stack: err.stack
    });

    // Specific handling for unique-violation (race condition possibility)
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Generic error forwarded to global handler
    return next({ status: 500, message: 'Database error saving new user' });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const result = await db.query('SELECT id, full_name, email, password_hash, role FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken(user);
    res.json({ user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role }, token });
  } catch (err) {
    next(err);
  }
};
