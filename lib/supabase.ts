
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zgjxhaatmumjiviyuzoj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnanhoYWF0bXVtaml2aXl1em9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMzI0MjUsImV4cCI6MjA4NTgwODQyNX0.JObt7uDpL1MwbZPBuuwq-IFrky3rvaiq86ebTDGFNdA'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a file to a specific bucket and returns the public URL.
 */
export const uploadFile = async (bucket: string, path: string, file: File | Blob) => {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type || 'image/png'
  });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return publicUrl;
};
