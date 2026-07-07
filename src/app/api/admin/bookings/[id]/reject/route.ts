import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = req.cookies.get('admin_session')?.value;
  if (session !== process.env.ADMIN_SESSION_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  // Get booking to free up the slot
  const { data: booking } = await supabase.from('bookings').select('slot_id').eq('id', id).single();
  if (booking?.slot_id) {
    await supabase.from('slots').update({ is_booked: false }).eq('id', booking.slot_id);
  }
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'rejected' })
    .eq('id', id)
    .select('*, slots(*)')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
