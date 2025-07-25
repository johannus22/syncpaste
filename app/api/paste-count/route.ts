import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('paste_metrics') // Your table for storing total pastes
    .select('total_pastes')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Error fetching paste count:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ totalPastes: data.total_pastes });
}
