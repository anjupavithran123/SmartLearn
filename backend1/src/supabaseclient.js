// src/supabaseClient.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Read from .env file
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('❌ Missing SUPABASE_URL or SUPABASE_KEY in .env');
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false, // disable file-based session persistence (for servers)
    autoRefreshToken: false,
  },
});

console.log('✅ Supabase client initialized');

module.exports = supabase;
