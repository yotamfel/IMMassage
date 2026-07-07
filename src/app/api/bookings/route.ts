import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { slot_id, client_name, client_phone } = await req.json();
  if (!slot_id || !client_name || !client_phone) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Check slot still available
  const { data: slot, error: slotError } = await supabase
    .from('slots')
    .select('*')
    .eq('id', slot_id)
    .eq('is_booked', false)
    .single();

  if (slotError || !slot) {
    return NextResponse.json({ error: 'Slot not available' }, { status: 409 });
  }

  // Mark slot as booked
  await supabase.from('slots').update({ is_booked: true }).eq('id', slot_id);

  // Create booking
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({ slot_id, client_name, client_phone, status: 'pending' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ booking, slot });
}
