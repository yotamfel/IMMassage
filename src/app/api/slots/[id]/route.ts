import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function auth(req: NextRequest) {
  return req.cookies.get('admin_session')?.value === process.env.ADMIN_SESSION_TOKEN;
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const { error } = await supabase.from('slots').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// Release a booked slot — cancels any pending booking and makes the slot available again
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await supabase.from('bookings').update({ status: 'rejected' }).eq('slot_id', id).in('status', ['pending', 'confirmed']);
  const { error } = await supabase.from('slots').update({ is_booked: false }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
