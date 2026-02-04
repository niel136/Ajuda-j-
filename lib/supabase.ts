import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zgjxhaatmumjiviyuzoj.supabase.co';
// Chave anônima atualizada conforme fornecido pelo usuário
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnanhoYWF0bXVtaml2aXl1em9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMzI0MjUsImV4cCI6MjA4NTgwODQyNX0.JObt7uDpL1MwbZPBuuwq-IFrky3rvaiq86ebTDGFNdA'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);