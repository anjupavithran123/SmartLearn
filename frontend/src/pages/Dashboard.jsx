// simple redirect route
import { Routes, Route, Navigate } from "react-router-dom";

<Route
  path="/dashboard"
  element={<DashboardRedirect />}
/>

// DashboardRedirect.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../services/auth';

export default function DashboardRedirect() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('http://localhost:4000/api/users/me');
        if (!res.ok) { navigate('/login'); return; }
        const { user } = await res.json();
        if (user.role === 'tutor') navigate('/dashboard/tutor', { replace: true });
        else navigate('/dashboard/student', { replace: true });
      } catch (err) {
        console.error(err);
        navigate('/login');
      } finally { setLoading(false); }
    })();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  return null;
}
