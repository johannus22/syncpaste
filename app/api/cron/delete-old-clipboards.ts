import { createClient } from '@supabase/supabase-js';

export const config = {
  schedule: '*/30 * * * *', // every 30 minutes sa cron basta 30 minutes yan HAHAHAHHAHA
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler() {
  const expiration = new Date(Date.now() - 30 * 60 * 1000).toISOString();

  const { error } = await supabase
    .from('clipboards')
    .delete()
    .lt('created_at', expiration);

  if (error) {
    console.error('Auto-delete error:', error.message);
    return new Response('Error deleting', { status: 500 });
  }

  console.log('deleted');
  return new Response('cleaneed');
}
