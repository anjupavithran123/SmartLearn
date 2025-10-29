// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Health check route (to confirm server is running)
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// ✅ Optional root route
app.get('/', (req, res) => {
  res.send('✅ SmartLearn API Server is running');
});

// ✅ Mount API routers
try {
  const courseRoutes = require('./src/routes/courseRoutes');
  app.use('/api/courses', courseRoutes);
  console.log('✅ courseRoutes loaded');
} catch (err) {
  console.error('❌ Failed to load courseRoutes:', err.message);
}

try {
  const authRoutes = require('./src/routes/authroute.js');
  app.use('/api/auth', authRoutes);
  console.log('✅ authRoutes loaded');
} catch (err) {
  console.error('❌ Failed to load authRoutes:', err.message);
}

try {
  const userRoutes = require('./src/routes/userroute.js');
  app.use('/api/users', userRoutes);
  console.log('✅ userRoutes loaded');
} catch (err) {
  console.error('❌ Failed to load userRoutes:', err.message);
}

// 🚀 Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
