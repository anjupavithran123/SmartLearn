const API_URL = 'http://localhost:4000/api';

export async function signup({ full_name, email, password, role }) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name, email, password, role }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || `Signup failed (${res.status})`);
  return data; // { user, token } or whatever backend returns
}

export async function login({ email, password }) {
  // debug: log request start
  console.log('auth.login: calling', `${API_URL}/auth/login`, { email });
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.error('auth.login: failed to parse JSON response', e);
    throw new Error(`Login failed: invalid JSON response (${res.status})`);
  }

  console.log('auth.login: response', res.status, data);

  if (!res.ok) {
    // backend might return { error } or { message }
    throw new Error(data.error || data.message || `Login failed (${res.status})`);
  }

  // Normalize token field name: support token, accessToken, jwt
  const token = data.token || data.accessToken || data.jwt || data.access_token;

  // Return normalized shape
  return { ...data, token };
}

// helper for authorized requests
export function authFetch(url, opts = {}) {
  const token = localStorage.getItem('token');
  return fetch(url, {
    ...opts,
    headers: {
      ...(opts.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
