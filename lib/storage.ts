import { supabase } from './supabase';

/**
 * Upload a local file URI to a Supabase Storage bucket.
 * Returns the public URL of the uploaded file.
 * If the URI is already a remote URL, returns it unchanged.
 */
export async function uploadImage(
  bucket: 'car-photos' | 'avatars',
  path: string,
  localUri: string
): Promise<string> {
  if (localUri.startsWith('http')) return localUri;

  const ext = localUri.split('.').pop() || 'jpg';
  const fullPath = `${path}.${ext}`;

  const response = await fetch(localUri);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fullPath, blob, { upsert: true, contentType: `image/${ext}` });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(fullPath);
  return data.publicUrl;
}
