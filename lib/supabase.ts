
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zgjxhaatmumjiviyuzoj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnanhoYWF0bXVtaml2aXl1em9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMzI0MjUsImV4cCI6MjA4NTgwODQyNX0.JObt7uDpL1MwbZPBuuwq-IFrky3rvaiq86ebTDGFNdA'; 

// Inicialização defensiva para evitar crash no import
let supabaseInstance: any;

try {
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('undefined')) {
    console.warn('Supabase: Chaves não configuradas corretamente. Rodando em modo limitado.');
    supabaseInstance = {
      auth: { getSession: async () => ({ data: { session: null }, error: null }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) },
      from: () => ({ select: () => ({ eq: () => ({ order: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) }), upsert: () => Promise.resolve({ error: null }), update: () => Promise.resolve({ error: null }), insert: () => Promise.resolve({ error: null }) }),
      channel: () => ({ on: () => ({ subscribe: () => ({}) }) }),
      removeChannel: () => {}
    };
  } else {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (e) {
  console.error('Falha crítica ao instanciar Supabase Client:', e);
}

export const supabase = supabaseInstance;

export const uploadFile = async (bucket: string, path: string, file: File | Blob) => {
  try {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true,
      contentType: file.type || 'image/png'
    });
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return publicUrl;
  } catch (e) {
    console.error('Erro no upload de arquivo:', e);
    throw e;
  }
};
