import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Public: get all available upcoming slots
export async function GET() {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('slots')
    .select('*')
    .eq('is_booked', false)
    .gte('date', today)
    .order('date')
    .order('time');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// Admin: add new slot
export async function POST(req: NextRequest) {
  const session = req.cookies.get('admin_session')?.value;
  if (session !== process.env.ADMIN_SESSION_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const { date, time, location, duration_minutes } = body;
  if (!date || !time || !location || !duration_minutes) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const { data, error } = await supabase
    .from('slots')
    .insert({ date, time, location, duration_minutes })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
