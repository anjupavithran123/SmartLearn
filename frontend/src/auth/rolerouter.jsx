import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authFetch } from '../services/auth'; // uses localStorage token

// allowedRoles: string or array of strings
export default function RoleRoute({ children, allowedRoles }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await authFetch('http://localhost:4000/api/users/me', {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!mounted) return;
        if (!res.ok) {
          setUser(null);
          return;
        }
        const { user } = await res.json();
        setUser(user);
      } catch (err) {
        console.error('RoleRoute fetch error', err);
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (!allowed.includes(user.role)) {
    // redirect to a safe page. Could be /dashboard or /login depending on your UX
    return <Navigate to="/dashboard" replace />;
  }

  // pass user as prop to page
  return React.cloneElement(children, { user });
}
