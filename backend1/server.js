// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/authroute.js');
const userRoutes = require('./src/routes/userroute.js');

const app = express();
app.use(cors());
app.use(express.json());

// Health
app.get('/', (req, res) => res.json({ ok: true, message: 'Auth server running' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
