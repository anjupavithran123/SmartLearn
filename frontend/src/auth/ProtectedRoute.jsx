// src/auth/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Navigate } from 'react-router-dom';

async function validateBackendToken(token) {
  if (!token) return null;
  try {
    const res = await fetch('http://localhost:4000/api/users/me', {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json(); // expected: { user: { ... } }
  } catch (err) {
    console.error('validateBackendToken error', err);
    return null;
  }
}

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // 1) Supabase session if present
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        if (data?.user) {
          setUser(data.user);
          setLoading(false);
          return;
        }

        // 2) fallback: validate backend token
        const token = localStorage.getItem('token');
        const localUserJson = localStorage.getItem('user');
        const localUser = localUserJson ? JSON.parse(localUserJson) : null;

        if (token) {
          const validated = await validateBackendToken(token);
          if (!mounted) return;
          if (validated?.user) {
            setUser(validated.user);
            setLoading(false);
            return;
          }

          // else if backend can't validate, but you still want to allow (not recommended)
          // setUser(localUser || { tokenPresent: true });
        }

        // nothing valid
        setUser(null);
      } catch (err) {
        console.error('ProtectedRoute error', err);
        const localToken = localStorage.getItem('token');
        const localUserJson = localStorage.getItem('user');
        setUser(localToken ? (localUserJson ? JSON.parse(localUserJson) : { tokenPresent: true }) : null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
