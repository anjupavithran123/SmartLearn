// src/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controller/courseController');

// Debug log to confirm router is loaded
console.log('✅ courseRoutes loaded');

// Routes
router.post('/', controller.createCourse);        // POST /api/courses
router.get('/', controller.getCourses);           // GET /api/courses
router.get('/:id', controller.getCourseById);     // GET /api/courses/:id
router.put('/:id', controller.updateCourse);      // PUT /api/courses/:id
router.patch('/:id', controller.updateCourse);    // PATCH /api/courses/:id
router.delete('/:id', controller.deleteCourse);   // DELETE /api/courses/:id

// Fallback to catch invalid course routes
router.use((req, res) => {
  res.status(404).json({ error: `Invalid course route: ${req.originalUrl}` });
});

module.exports = router;
