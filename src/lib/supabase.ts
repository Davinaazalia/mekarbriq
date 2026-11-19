// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseKey) {
//   throw new Error('Konfigurasi Supabase belum lengkap!');
// }

// export const supabase = createClient(
//   supabaseUrl,
//   supabaseKey
// );
import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) throw new Error('Konfigurasi Supabase belum lengkap. Periksa file .env.');
export const supabase = createClient(url, key);
