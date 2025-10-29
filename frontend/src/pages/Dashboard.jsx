// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) return;
      const { data, error } = await supabase.from('profiles').select('full_name, role').eq('id', userId).single();
      if (error) {
        console.error(error);
      } else {
        setProfile(data);
      }
    })();
  }, []);

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {profile.full_name || 'User'}!</h1>
      <p className="mt-2">Role: <strong>{profile.role}</strong></p>

      {profile.role === 'tutor' ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Tutor Dashboard</h2>
          <p>Create courses, manage students, etc.</p>
        </div>
      ) : (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Student Dashboard</h2>
          <p>Browse courses, enroll, track progress.</p>
        </div>
      )}
    </div>
  );
}
