// src/pages/CourseDetails.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function CourseDetails() {
  const { id } = useParams();          // route: /courses/:id
  const navigate = useNavigate();

  const [course, setCourse] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [enrolling, setEnrolling] = React.useState(false);
  const [enrolled, setEnrolled] = React.useState(false);

  // Base API URL override (optional)
  const API_BASE = process.env.REACT_APP_API_URL || '';

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/courses/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        if (!res.ok) throw new Error(`Could not fetch course (${res.status})`);
        const data = await res.json();
        if (!cancelled) setCourse(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [API_BASE, id]);

  // Enrollment action
  const handleEnroll = async () => {
    setEnrolling(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // not logged in — redirect to login
        return navigate('/login', { state: { from: `/courses/${id}` } });
      }
      const res = await fetch(`${API_BASE}/api/courses/${id}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Enroll failed (${res.status})`);
      }
      const body = await res.json();
      setEnrolled(true);
      // optionally show message from body
    } catch (err) {
      setError(err.message || 'Enroll failed');
    } finally {
      setEnrolling(false);
    }
  };

  // Pick playable source: first video link if exists
  const renderPlayer = (link) => {
    if (!link) return null;
    // If link looks like youtube / youtu.be / vimeo, render iframe
    const lower = link.toLowerCase();
    if (lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('vimeo.com')) {
      // transform youtube short URL to embed if needed
      let embed = link;
      // YouTube watch?v= -> embed/
      if (lower.includes('youtube.com/watch')) {
        const url = new URL(link);
        const v = url.searchParams.get('v');
        if (v) embed = `https://www.youtube.com/embed/${v}`;
      }
      // youtu.be short
      if (lower.includes('youtu.be/')) {
        const id = link.split('youtu.be/')[1].split(/[?&]/)[0];
        embed = `https://www.youtube.com/embed/${id}`;
      }
      return (
        <div className="video-wrapper" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            title="Course video"
            src={embed}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        </div>
      );
    }

    // Otherwise, assume raw video file URL — use HTML5 video
    return (
      <video controls style={{ width: '100%', maxHeight: '60vh' }}>
        <source src={link} />
        Your browser does not support the video tag.
      </video>
    );
  };

  if (loading) return <div className="p-4 bg-white rounded shadow">Loading course…</div>;
  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded">Error: {error}</div>;
  if (!course) return <div className="p-4 bg-white rounded shadow">Course not found.</div>;

  const firstVideo = (course.video_links && course.video_links.length > 0) ? course.video_links[0] : null;

  return (
    <div className="space-y-6">
      <header className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <p className="text-gray-600 mt-2">{course.description}</p>
        <p className="text-sm text-gray-500 mt-2">Instructor: {course.instructor}</p>
        <div className="mt-4">
          <button
            className={`px-4 py-2 rounded ${enrolled ? 'bg-gray-400' : 'bg-blue-600 text-white'}`}
            onClick={handleEnroll}
            disabled={enrolling || enrolled}
          >
            {enrolling ? 'Enrolling...' : (enrolled ? 'Enrolled' : 'Enroll')}
          </button>
        </div>
      </header>

      {firstVideo ? (
        <section className="bg-white p-6 rounded shadow">
          {renderPlayer(firstVideo)}
        </section>
      ) : (
        <div className="bg-yellow-50 p-4 rounded">No video available for this course.</div>
      )}

      {course.video_links && course.video_links.length > 1 && (
        <section className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold mb-2">Other videos</h3>
          <ul className="list-disc ml-5">
            {course.video_links.map((v, i) => (
              <li key={i}><a href={v} target="_blank" rel="noreferrer" className="text-blue-600 underline">{v}</a></li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
