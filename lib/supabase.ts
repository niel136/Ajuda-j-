import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zgjxhaatmumjiviyuzoj.supabase.co';
// A anon key deve ser colada aqui ou obtida via env var.
const supabaseAnonKey = 'SUA_ANON_KEY_AQUI'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);