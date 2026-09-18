import "server-only";
import { createClient } from "@/lib/supabase/server";

const TRACKS_BUCKET = "tracks";

/**
 * Uploads a submitted beat to Supabase Storage and returns its public URL.
 *
 * Requires a public bucket named "tracks" in the Supabase project, with a
 * storage policy allowing authenticated users to INSERT (SELECT should be
 * public so the audio is playable). This isn't created automatically —
 * one-time manual setup in the Supabase dashboard, same as the Auth
 * Redirect URLs requirement from step 2.
 */
export async function uploadTrackAudio(userId: string, file: File): Promise<string> {
  const supabase = await createClient();
  const ext = file.name.split(".").pop() || "mp3";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(TRACKS_BUCKET).upload(path, file, {
    contentType: file.type || "audio/mpeg",
    upsert: false,
  });
  if (error) {
    throw new Error(`Audio upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(TRACKS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
