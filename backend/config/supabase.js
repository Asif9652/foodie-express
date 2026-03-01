const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Supabase URL or Key is missing. Make sure to define them in your .env file.');
}

const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : { from: () => ({ select: () => ({ eq: () => ({ single: () => Promise.resolve({ error: { message: 'Supabase credentials not configured' } }) }) }) }) };

module.exports = supabase;
