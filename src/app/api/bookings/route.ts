import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

function formatDateHe(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('he-IL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export async function POST(req: NextRequest) {
  const { slot_id, client_name, client_phone, selected_location, treatment_name, duration_minutes } = await req.json();
  if (!slot_id || !client_name || !client_phone) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const { data: slot, error: slotError } = await supabase
    .from('slots').select('*').eq('id', slot_id).eq('is_booked', false).single();
  if (slotError || !slot) {
    return NextResponse.json({ error: 'Slot not available' }, { status: 409 });
  }

  await supabase.from('slots').update({ is_booked: true }).eq('id', slot_id);

  const locationToSave = selected_location || slot.location;
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({ slot_id, client_name, client_phone, status: 'pending', selected_location: locationToSave, treatment_name, duration_minutes })
    .select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'matusov19961@gmail.com',
        subject: `בקשת תור חדשה - ${client_name}`,
        html: `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:500px">
          <h2 style="color:#2F6B6B">📅 בקשת תור חדשה!</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;font-weight:bold">שם:</td><td style="padding:8px">${client_name}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">טלפון:</td><td style="padding:8px" dir="ltr">${client_phone}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">תאריך:</td><td style="padding:8px">${formatDateHe(slot.date)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">שעה:</td><td style="padding:8px">${slot.time.slice(0, 5)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">מיקום:</td><td style="padding:8px">${locationToSave}</td></tr>
            ${treatment_name ? `<tr><td style="padding:8px;font-weight:bold">טיפול:</td><td style="padding:8px">${treatment_name} · ${duration_minutes} דקות</td></tr>` : ''}
          </table>
          <br>
          <a href="https://shahrur-bamaga.vercel.app/admin" style="background:#2F6B6B;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block">כנס לניהול תורים →</a>
        </div>`,
      });
    } catch (e) {
      console.error('Email notification failed:', e);
    }
  }

  return NextResponse.json({ booking, slot });
}
