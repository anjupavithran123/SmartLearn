import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '../services/auth'; // <- use centralized auth service

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.email || !form.password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      // call the service that hits your backend
      const data = await login({ email: form.email, password: form.password });
      // expected data: { user, token }
      if (data?.token) {
        localStorage.setItem('token', data.token);
      }
      // optionally persist user object
      try { localStorage.setItem('user', JSON.stringify(data.user)); } catch (e) {}

      // redirect after successful login
      navigate('/dashboard');
    } catch (err) {
      // `services/auth.js` throws an Error with message, or you might get an object
      setError(err.message || err.error || 'Invalid login credentials');
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
        <label className="block mb-1 text-gray-700 font-semibold">
          Password
        </label>
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

        {/* Sign up link */}
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
