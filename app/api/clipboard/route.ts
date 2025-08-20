import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { pusherServer } from '@/lib/pusher-server';

const serverSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  /*  TODO: Di pa gumagana 'tong code block na toooo
  const autoDelete = new Date(Date.now() - 30 * 60 * 1000).toISOString();

  await supabase
    .from('clipboards')
    .delete()
    .lt('created_at', autoDelete);
  */ 
  const { data, error } = await supabase
    .from('clipboards')
    .select('content')
    .eq('session_code', code)
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  

  return NextResponse.json({ content: data?.content || '' });
}

export async function POST(req: NextRequest) {
  const { sessionCode, text } = await req.json();

  if (!sessionCode || typeof text !== 'string') {
    return NextResponse.json({ error: 'Missing sessionCode or text' }, { status: 400 });
  }

  const { error } = await supabase
    .from('clipboards')
    .upsert(
      { session_code: sessionCode, content: text },
      { onConflict: 'session_code' }
    );

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Increment paste counter
  await supabase.rpc('increment_paste_counter');

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  const { error: deleteError } = await serverSupabase
    .from('clipboards')
    .delete()
    .eq('session_code', code);

  if (deleteError) {
    console.error('Supabase delete error:', deleteError);
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  try {
    await pusherServer.trigger(`session-${code}`, 'clipboard-update', { text: '' });
  } catch (pusherError) {
    console.error('Pusher notify error (delete):', pusherError);
  }

  return NextResponse.json({ success: true });
}

