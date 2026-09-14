const ISRAEL_PHONE = '972508838374';

function formatPhone(phone: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('972')) return cleaned;
  if (cleaned.startsWith('0')) return '972' + cleaned.slice(1);
  return '972' + cleaned;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' });
}

// Client → Israel: booking request
export function bookingRequestLink(slot: { date: string; time: string; location: string; duration_minutes: number }, clientName: string): string {
  const msg = `היי ישראל, אשמח לקבוע תור.\n${formatDate(slot.date)} בשעה ${slot.time.slice(0,5)}\n${slot.location}\n${slot.duration_minutes} דקות\nשמי ${clientName}`;
  return `https://wa.me/${ISRAEL_PHONE}?text=${encodeURIComponent(msg)}`;
}

// Israel → client: confirmation
export function confirmationLink(clientPhone: string, clientName: string, slot: { date: string; time: string; location: string; duration_minutes: number }): string {
  const formUrl = process.env.NEXT_PUBLIC_MEDICAL_FORM_URL || '';
  const msg = `שלום ${clientName}! התור שלך אושר.\n${formatDate(slot.date)} בשעה ${slot.time.slice(0,5)}\n${slot.location}\n${slot.duration_minutes} דקות\nאנא מלא שאלון רפואי לפני הטיפול:\n${formUrl}`;
  return `https://wa.me/${formatPhone(clientPhone)}?text=${encodeURIComponent(msg)}`;
}

// Israel → client: rejection
export function rejectionLink(clientPhone: string, clientName: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shichrur-bemaga.vercel.app';
  const msg = `שלום ${clientName}, מצטערים – הזמן הזה כבר לא פנוי.\nלקביעת תור חדש: ${siteUrl}/#booking`;
  return `https://wa.me/${formatPhone(clientPhone)}?text=${encodeURIComponent(msg)}`;
}

// Israel → client: review reminder
export function reviewReminderLink(clientPhone: string, clientName: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shichrur-bemaga.vercel.app';
  const msg = `היי ${clientName}, נשמח שתשאיר ביקורת קצרה על הטיפול:\n${siteUrl}/#review`;
  return `https://wa.me/${formatPhone(clientPhone)}?text=${encodeURIComponent(msg)}`;
}
