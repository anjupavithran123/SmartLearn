import React from 'react';
import { supabase } from '../supabaseClient';
import CourseForm from '../components/CourseForm';

export default function InstructorDashboard() {
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [error, setError] = React.useState(null);

  // get current user (for filtering by instructor)
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    const u = supabase.auth.getUser().then(res => {
      // supabase v2 returns { data: { user } } shape; handle both
      const userObj = res?.data?.user ?? res?.user ?? null;
      setUser(userObj);
    });
  }, []);

  React.useEffect(() => {
    fetchCourses();
    // subscribe to realtime changes (optional)
    // return cleanup if you add subscription
  }, []);

  async function fetchCourses() {
    setLoading(true);
    setError(null);
    try {
      // If you want instructors to only see their courses, filter by user.id in 'instructor_id' column.
      // This example assumes `courses` table has an `instructor_id` column (uuid) referencing auth user id.
      const userRes = await supabase.auth.getUser();
      const currentUser = userRes?.data?.user ?? null;

      let query = supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (currentUser) {
        query = query.eq('instructor_id', currentUser.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (course) => {
    setEditing(course);
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (!confirm('Delete this course?')) return;
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);
      if (error) throw error;
      setCourses(prev => prev.filter(c => c.id !== courseId));
    } catch (err) {
      alert('Delete failed: ' + (err.message || err));
    }
  };

  const onSaved = (saved) => {
    // saved is the created/updated course object
    // replace or add to list
    setShowForm(false);
    setEditing(null);
    setCourses(prev => {
      const idx = prev.findIndex(c => c.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
  };

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
        <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded">New Course</button>
      </header>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map(course => (
          <div key={course.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <p className="text-sm text-gray-500">{course.instructor}</p>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleEdit(course)} className="px-3 py-1 bg-blue-600 text-white rounded">Edit</button>
                <button onClick={() => handleDelete(course.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
              </div>
            </div>

            <p className="mt-3 text-sm">{course.description}</p>
            {Array.isArray(course.video_links) && course.video_links.length > 0 && (
              <p className="mt-2 text-sm text-blue-600">{course.video_links.length} video(s)</p>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <CourseForm
          course={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}
