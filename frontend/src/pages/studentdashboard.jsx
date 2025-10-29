
import React from 'react';
import { Link } from 'react-router-dom';

export default function StudentDashboard({ user }) {
  return (
    <div className="space-y-6">
      <header className="bg-white rounded-lg p-8 shadow">
        <h1 className="text-3xl font-bold">Welcome to SmartLearn</h1>
        <p className="text-gray-600 mt-2">Browse courses and start learning today.</p>
        <Link to="/courses" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded">Browse Courses</Link>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">Feature block 1</div>
        <div className="bg-white p-6 rounded shadow">Feature block 2</div>
      </section>
    </div>
  );
}
