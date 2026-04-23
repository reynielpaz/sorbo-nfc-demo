import { createClient } from '@supabase/supabase-js';

let browserClient = null;

function readPublicEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} no configurada`);
  }
  return value;
}

export function createSupabaseBrowserClient() {
  if (browserClient) {
    return browserClient;
  }

  browserClient = createClient(
    readPublicEnv('NEXT_PUBLIC_SUPABASE_URL'),
    readPublicEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    },
  );

  return browserClient;
}
