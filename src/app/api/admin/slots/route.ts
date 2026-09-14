import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const session = req.cookies.get('admin_session')?.value;
  if (session !== process.env.ADMIN_SESSION_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('slots')
    .select('*')
    .gte('date', today)
    .order('date')
    .order('time');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
