
export const API_BASE = (typeof window !== 'undefined' && window.__API_BASE__) ||
  (typeof import.meta !== 'undefined' ? import.meta.env.VITE_API_URL : '') ||
  (typeof process !== 'undefined' ? process.env.REACT_APP_API_URL : '') ||
  '';
