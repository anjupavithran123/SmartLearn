import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { signup } from '../services/auth'; // ✅ Correct import

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const strongRegex = useMemo(
    () => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
    []
  );

  const passwordStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^\w\s]/.test(pw)) score++;
    return Math.min(score, 4);
  };

  const strength = passwordStrength(form.password);
  const strengthLabel = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'][strength] || 'Very weak';
  const meterColor = (s) => (['bg-red-500','bg-yellow-400','bg-blue-500','bg-green-500'][Math.min(s,3)]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!strongRegex.test(form.password)) {
      setError('⚠️ Password must include uppercase, lowercase, number, special character, and be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      const data = await signup(form);
      localStorage.setItem('token', data.token);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your JSX (same as before)



  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        {error && <div className="text-red-600 mb-3 text-sm">{error}</div>}

        <label className="block mb-1 font-semibold">Full Name</label>
        <input
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-3"
        />

        <label className="block mb-1 font-semibold">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-3"
        />

        <label className="block mb-1 font-semibold">Password</label>
        <div className="relative mb-2">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Password strength meter */}
        {form.password && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Strength: {strengthLabel}</span>
              <span>{form.password.length} chars</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
              <div
                className={`h-2 ${meterColor(strength)} transition-all duration-200`}
                style={{ width: `${(strength / 4) * 100}%` }}
              />
            </div>
            <ul className="mt-2 text-xs text-gray-600 space-y-1">
              <li className={form.password.length >= 8 ? 'text-green-600' : ''}>● At least 8 characters</li>
              <li className={/[A-Z]/.test(form.password) ? 'text-green-600' : ''}>● Uppercase letter</li>
              <li className={/[a-z]/.test(form.password) ? 'text-green-600' : ''}>● Lowercase letter</li>
              <li className={/\d/.test(form.password) ? 'text-green-600' : ''}>● Number</li>
              <li className={/[^\w\s]/.test(form.password) ? 'text-green-600' : ''}>● Special character</li>
            </ul>
          </div>
        )}

        <label className="block mb-1 font-semibold">Role</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="student">Student</option>
          <option value="tutor">Tutor</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded py-2 mt-2"
        >
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
      </form>
    </div>
  );
}
