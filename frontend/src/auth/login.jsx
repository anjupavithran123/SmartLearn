import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '../services/auth';
import { supabase } from '../supabaseClient'; // ✅ Add this import if you have Supabase setup

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.email || !form.password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      console.log('🔸 Login attempt:', form);
      const data = await login({ email: form.email, password: form.password });
      console.log('✅ Backend login response:', data);

      // extract tokens
      const token =
        data?.token ||
        data?.accessToken ||
        data?.access_token ||
        data?.jwt ||
        null;

      const refresh =
        data?.refresh_token ||
        data?.refreshToken ||
        null;

      // store in localStorage
      if (token) {
        localStorage.setItem('token', token);
      }

      if (data?.user) {
        try {
          localStorage.setItem('user', JSON.stringify(data.user));
        } catch (err) {
          console.warn('Could not store user:', err);
        }
      }

      // ✅ Optional: sync Supabase session (only if you’re using Supabase Auth)
      if (token && refresh && typeof supabase !== 'undefined') {
        try {
          await supabase.auth.setSession({
            access_token: token,
            refresh_token: refresh,
          });
          console.log('🔹 Supabase session set successfully');
        } catch (err) {
          console.error('Failed to set Supabase session:', err);
        }
      }

      // redirect after successful login
      if (token) {
        console.log('➡️ Navigating to /dashboard');
        navigate('/dashboard', { replace: true });
      } else {
        console.warn('⚠️ No token returned from backend');
        setError('Login succeeded but no token was returned from server.');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err?.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        {error && <div className="text-red-600 mb-3 text-sm">{error}</div>}

        {/* Email */}
        <label className="block mb-1 text-gray-700 font-semibold">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Password */}
        <label className="block mb-1 text-gray-700 font-semibold">Password</label>
        <div className="relative mb-4">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded py-2 transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{' '}
          <Link
            to="/signup"
            className="text-orange-500 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
