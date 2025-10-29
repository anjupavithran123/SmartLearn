// backend1/src/controllers/courseController.js
const supabase = require('../supabaseclient'); // <-- ensure file is named supabaseClient.js

// Helper: get user id from Supabase token (works with supabase-js v2)
async function getUserIdFromToken(token) {
  if (!token) return null;
  try {
    const result = await supabase.auth.getUser(token);
    // supabase v2 returns { data: { user }, error }
    const user = result?.data?.user ?? result?.user ?? null;
    return user?.id ?? null;
  } catch (err) {
    console.error('getUserIdFromToken error:', err);
    return null;
  }
}

// Create a course
exports.createCourse = async (req, res) => {
  try {
    const { title, description = '', instructor, videoLinks = [], instructor_id } = req.body;

    if (!title || !instructor) {
      return res.status(400).json({ error: 'title and instructor are required' });
    }

    const payload = {
      title,
      description,
      instructor,
      video_links: videoLinks,
      instructor_id: instructor_id || null
    };

    console.log('createCourse payload:', payload);

    const { data, error } = await supabase
      .from('courses')
      .insert([payload])
      .select('*')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: error.message || error });
    }

    return res.status(201).json(data);
  } catch (err) {
    console.error('createCourse exception:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

// Get all courses
exports.getCourses = async (req, res) => {
  try {
    // optional: support query params like ?limit=10&page=1 or ?instructor_id=...
    const { instructor_id, limit, page } = req.query;
    let query = supabase.from('courses').select('*').order('created_at', { ascending: false });

    if (instructor_id) query = query.eq('instructor_id', instructor_id);

    if (limit) {
      const l = Math.min(parseInt(limit, 10) || 20, 100);
      if (page) {
        const p = Math.max(parseInt(page, 10) || 1, 1);
        const from = (p - 1) * l;
        const to = from + l - 1;
        query = query.range(from, to);
      } else {
        query = query.limit(l);
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    return res.json({ data });
  } catch (err) {
    console.error('getCourses err:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

// Get course by id
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Course not found' });
    return res.json(data);
  } catch (err) {
    console.error('getCourseById err:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};

    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.instructor !== undefined) updates.instructor = req.body.instructor;
    if (req.body.videoLinks !== undefined) updates.video_links = req.body.videoLinks;
    if (req.body.video_links !== undefined) updates.video_links = req.body.video_links;

    if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No fields to update' });

    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Course not found' });
    return res.json(data);
  } catch (err) {
    console.error('updateCourse err:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Course not found' });
    return res.json({ message: 'Course deleted', id: data.id });
  } catch (err) {
    console.error('deleteCourse err:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

// Enroll user in a course
// POST /api/courses/:id/enroll
exports.enrollCourse = async (req, res) => {
  try {
    const { id: courseId } = req.params;

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Authorization required' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authorization token missing' });

    const userId = await getUserIdFromToken(token);
    if (!userId) return res.status(401).json({ error: 'Invalid or expired token' });

    const { data, error } = await supabase
      .from('course_enrollments')
      .insert([{ course_id: courseId, user_id: userId }])
      .select('*')
      .single();

    if (error) {
      const message = error?.message ?? JSON.stringify(error);
      if (error?.code === '23505' || message?.toLowerCase().includes('unique') || (error?.details && error.details.includes('already exists'))) {
        return res.status(200).json({ message: 'Already enrolled' });
      }
      console.error('enrollCourse supabase error:', error);
      return res.status(500).json({ error: message });
    }

    return res.status(201).json({ message: 'Enrolled', enrollment: data });
  } catch (err) {
    console.error('enrollCourse err:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};
