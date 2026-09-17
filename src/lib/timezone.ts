// Server-side code (Vercel functions) runs in UTC regardless of where the
// business is. Slot dates/times are entered and interpreted as Israel local
// wall-clock time (the admin's browser is Israel-based), so any server-side
// "now" comparison against them must go through Asia/Jerusalem - not
// new Date()/toISOString(), which silently drifts by the current UTC
// offset (+2 or +3 depending on DST).
const TIME_ZONE = 'Asia/Jerusalem';

// Current Israel-local date/time, as the same "YYYY-MM-DD" / "HH:MM:SS"
// strings slots are stored with - so callers can keep doing plain string
// comparisons against stored slot.date / slot.time.
export function getIsraelNowParts(): { date: string; time: string } {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const parts: Record<string, string> = {};
  for (const p of dtf.formatToParts(new Date())) parts[p.type] = p.value;
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}:${parts.second}`,
  };
}

function getTimeZoneOffsetMinutes(date: Date): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const parts: Record<string, string> = {};
  for (const p of dtf.formatToParts(date)) parts[p.type] = p.value;
  const asUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return (asUTC - date.getTime()) / 60000;
}

// Resolves a slot's Israel-local wall-clock date+time to the correct UTC
// instant, across DST.
export function israelWallTimeToUTC(dateStr: string, timeStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [hh, mm] = timeStr.split(':').map(Number);
  const naiveUTC = new Date(Date.UTC(y, m - 1, d, hh, mm));
  const offsetMin = getTimeZoneOffsetMinutes(naiveUTC);
  return new Date(naiveUTC.getTime() - offsetMin * 60000);
}
