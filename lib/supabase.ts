
import { createClient } from '@supabase/supabase-js';

// Utilitário para obter variáveis de ambiente de forma segura
const getEnv = (key: string): string => {
  // Tenta process.env (Vercel/Node) ou window.process (Shim)
  const env = (typeof process !== 'undefined' && process.env) || (window as any).process?.env || {};
  return env[key] || '';
};

const supabaseUrl = 'https://zgjxhaatmumjiviyuzoj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnanhoYWF0bXVtaml2aXl1em9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMzI0MjUsImV4cCI6MjA4NTgwODQyNX0.JObt7uDpL1MwbZPBuuwq-IFrky3rvaiq86ebTDGFNdA';

// Cliente instanciado com proteção
const createSafeClient = () => {
  try {
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('undefined')) {
      throw new Error('Supabase keys missing');
    }
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn('Supabase: Inicializando em modo offline/mock devido a chaves ausentes.');
    // Retorna um objeto mock para não quebrar chamadas de métodos básicos antes do login
    return {
      auth: { 
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ error: new Error('Modo Offline') }),
        signUp: async () => ({ error: new Error('Modo Offline') }),
        signOut: async () => ({})
      },
      from: () => ({
        select: () => ({ eq: () => ({ order: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) }),
        upsert: () => Promise.resolve({ error: new Error('Modo Offline') }),
        update: () => Promise.resolve({ error: new Error('Modo Offline') }),
        insert: () => Promise.resolve({ error: new Error('Modo Offline') })
      }),
      storage: { from: () => ({ upload: () => Promise.reject('Modo Offline'), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) }
    } as any;
  }
};

export const supabase = createSafeClient();

export const uploadFile = async (bucket: string, path: string, file: File | Blob) => {
  if (!supabase.storage) return '';
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
    return '';
  }
};
