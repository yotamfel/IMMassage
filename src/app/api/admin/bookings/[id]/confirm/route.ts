import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = req.cookies.get('admin_session')?.value;
  if (session !== process.env.ADMIN_SESSION_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', id)
    .select('*, slots(*)')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
