import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

// Slot dates/times are entered by the admin in Israel local time, but this
// route runs on the server (UTC) - so `new Date(\`${date}T${time}\`)` would
// silently misinterpret them by the current Israel/UTC offset (+2 or +3
// depending on DST). This resolves the wall-clock time to the correct UTC
// instant regardless of DST.
function getTimeZoneOffsetMinutes(timeZone: string, date: Date): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const parts: Record<string, string> = {};
  for (const p of dtf.formatToParts(date)) parts[p.type] = p.value;
  const asUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return (asUTC - date.getTime()) / 60000;
}

function israelWallTimeToUTC(dateStr: string, timeStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [hh, mm] = timeStr.split(':').map(Number);
  const naiveUTC = new Date(Date.UTC(y, m - 1, d, hh, mm));
  const offsetMin = getTimeZoneOffsetMinutes('Asia/Jerusalem', naiveUTC);
  return new Date(naiveUTC.getTime() - offsetMin * 60000);
}

function formatDateHe(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' });
}

// Triggered every ~15 minutes by an external scheduler (Vercel Hobby's
// native cron only supports once-a-day). Sends a reminder email to anyone
// with a confirmed booking, an email on file, and an appointment starting
// within the next hour that hasn't been reminded yet.
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*, slots(*)')
    .eq('status', 'confirmed')
    .eq('reminder_sent', false)
    .not('client_email', 'is', null);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const now = Date.now();
  const due = (bookings || []).filter(b => {
    if (!b.slots) return false;
    const apptTime = israelWallTimeToUTC(b.slots.date, b.slots.time.slice(0, 5)).getTime();
    const minutesUntil = (apptTime - now) / 60000;
    return minutesUntil > 0 && minutesUntil <= 60;
  });

  if (due.length === 0 || !process.env.RESEND_API_KEY) {
    return NextResponse.json({ sent: 0, due: due.length });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  let sent = 0;
  for (const b of due) {
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: b.client_email,
        subject: `תזכורת: התור שלך היום בשעה ${b.slots.time.slice(0, 5)}`,
        html: `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:500px">
          <p>שלום ${b.client_name},</p>
          <p>תזכורת - התור שלך אצל שחרור במגע מתקרב:</p>
          <p><strong>${formatDateHe(b.slots.date)} בשעה ${b.slots.time.slice(0, 5)}</strong></p>
          <p>מיקום: ${b.selected_location || ''}</p>
          ${b.treatment_name ? `<p>טיפול: ${b.treatment_name}</p>` : ''}
          <p>מצפים לראותך!</p>
        </div>`,
      });
      await supabase.from('bookings').update({ reminder_sent: true }).eq('id', b.id);
      sent++;
    } catch (e) {
      console.error('Reminder email failed for booking', b.id, e);
    }
  }

  return NextResponse.json({ sent, due: due.length });
}
