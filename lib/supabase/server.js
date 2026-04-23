import { createClient } from '@supabase/supabase-js';

function readServerEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} no configurada`);
  }
  return value;
}

export function createSupabaseServiceRoleClient() {
  return createClient(
    readServerEnv('NEXT_PUBLIC_SUPABASE_URL'),
    readServerEnv('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
