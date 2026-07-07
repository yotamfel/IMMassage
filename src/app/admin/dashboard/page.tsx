'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type Slot = { id: string; date: string; time: string; location: string; duration_minutes: number; is_booked: boolean };
type Booking = { id: string; client_name: string; client_phone: string; status: string; review_sent: boolean; questionnaire_sent: boolean; final_confirmation_sent: boolean; created_at: string; slots: Slot; selected_location?: string; treatment_name?: string; duration_minutes?: number };

const ALL_LOCATIONS = ['בן בבא 1, ירושלים', 'חיים ברודי 15, ירושלים', 'ביקור בבית הלקוח'];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8–20

function displayLocation(s: string): string {
  try { const p = JSON.parse(s); return Array.isArray(p) ? p.join(' / ') : s; } catch { return s; }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatPhone(phone: string): string {
  const c = phone.replace(/[^0-9]/g, '');
  if (c.startsWith('972')) return c;
  if (c.startsWith('0')) return '972' + c.slice(1);
  return '972' + c;
}

function questionnaireLink(b: Booking): string {
  const url = process.env.NEXT_PUBLIC_MEDICAL_FORM_URL || '';
  const msg = `שלום ${b.client_name}! תודה על פנייתך 🙏\nכדי שנוכל לאשר את התור, אנא מלא שאלון רפואי קצר:\n${url}\nלאחר מילוי השאלון נחזור אליך לאישור הסופי.`;
  return `https://wa.me/${formatPhone(b.client_phone)}?text=${encodeURIComponent(msg)}`;
}

function finalConfirmationLink(b: Booking): string {
  const location = b.selected_location || displayLocation(b.slots?.location || '');
  const duration = b.duration_minutes || b.slots?.duration_minutes || 60;
  const treatment = b.treatment_name ? `\n💆 ${b.treatment_name}` : '';
  const msg = `שלום ${b.client_name}! התור שלך אושר סופית ✅\n📅 ${formatDate(b.slots.date)} בשעה ${b.slots.time.slice(0,5)}\n📍 ${location}${treatment}\n⏱️ ${duration} דקות\nמצפה לראותך!\n\nשים ❤️, ניתן לבטל תור עד 24 שעות לפני. תור שיבוטל בסמוך יחויב מחיר מלא.`;
  return `https://wa.me/${formatPhone(b.client_phone)}?text=${encodeURIComponent(msg)}`;
}

function rejectionLink(b: Booking): string {
  const msg = `שלום ${b.client_name}, מצטערים - הזמן הזה כבר לא פנוי.\nלקביעת תור חדש: https://shahrur-bamaga.vercel.app/#booking`;
  return `https://wa.me/${formatPhone(b.client_phone)}?text=${encodeURIComponent(msg)}`;
}

function reviewLink(b: Booking): string {
  const msg = `היי! שמחתי לטפל בך.\nאם תרצה, אשמח שתשאיר לי ביקורת קצרה - זה עוזר לי מאוד.\nאפשר דרך הקישור הזה (לוקח פחות מדקה):\nhttps://shahrur-bamaga.vercel.app/#review\n\nחשוב מאוד, יכול להיות שביום אחרי הטיפול תהיה הרגשה של שרירים תפוסים וכאבים באזורים עליהם עבדתי. הכאב יחלוף תוך כמה ימים, מומלץ לא לעשות כושר עד 24 שעות לאחר הטיפול.`;
  return `https://wa.me/${formatPhone(b.client_phone)}?text=${encodeURIComponent(msg)}`;
}

function isAppointmentStarted(b: Booking): boolean {
  return new Date() >= new Date(`${b.slots.date}T${b.slots.time}`);
}

function todayStr() { return new Date().toISOString().split('T')[0]; }

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<'bookings' | 'reviews' | 'calendar'>('bookings');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCalId, setExpandedCalId] = useState<string | null>(null);

  // Calendar navigation
  const [calWeekStart, setCalWeekStart] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [calSelectedDay, setCalSelectedDay] = useState<string>(todayStr());

  const fetchData = useCallback(async () => {
    const [slotsRes, bookingsRes] = await Promise.all([
      fetch('/api/admin/slots'),
      fetch('/api/admin/bookings'),
    ]);
    if (slotsRes.status === 401 || bookingsRes.status === 401) { router.push('/admin'); return; }
    setSlots(await slotsRes.json());
    setBookings(await bookingsRes.json());
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const logout = async () => { await fetch('/api/admin/auth', { method: 'DELETE' }); router.push('/admin'); };

  // Slot management
  const addSlotFromCalendar = async (date: string, hour: number) => {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    await fetch('/api/slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, time, location: JSON.stringify(ALL_LOCATIONS), duration_minutes: 60 }),
    });
    fetchData();
  };

  const removeCalendarSlot = async (id: string) => {
    if (!window.confirm('להסיר את השעה הזו מהאתר?')) return;
    await fetch(`/api/slots/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const releaseSlot = async (id: string) => {
    await fetch(`/api/slots/${id}`, { method: 'PATCH' });
    fetchData();
  };

  // Booking management
  const confirmBooking = async (id: string) => { await fetch(`/api/admin/bookings/${id}/confirm`, { method: 'POST' }); fetchData(); };
  const rejectBooking = async (id: string) => { await fetch(`/api/admin/bookings/${id}/reject`, { method: 'POST' }); fetchData(); };
  const markReviewSent = async (id: string) => { await fetch(`/api/admin/bookings/${id}/review-sent`, { method: 'POST' }); fetchData(); };
  const markQuestionnaireSent = async (id: string) => { await fetch(`/api/admin/bookings/${id}/questionnaire-sent`, { method: 'POST' }); fetchData(); };
  const markFinalSent = async (id: string) => { await fetch(`/api/admin/bookings/${id}/final-sent`, { method: 'POST' }); fetchData(); };
  const deleteBooking = async (id: string, name: string) => {
    if (!window.confirm(`למחוק את הבקשה של ${name}?`)) return;
    await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const pending = bookings.filter(b => b.status === 'pending');
  const confirmed = bookings.filter(b => b.status === 'confirmed');
  const reviewDue = confirmed.filter(b => !b.review_sent && b.slots && isAppointmentStarted(b));

  const tabClass = (t: string) =>
    `px-4 py-2 text-sm font-medium rounded-full transition-colors ${tab === t ? 'bg-[#2F6B6B] text-white' : 'text-[#2F6B6B] hover:bg-[#2F6B6B]/10'}`;

  if (loading) return <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center" dir="rtl"><p className="text-[#2F6B6B]">טוען...</p></div>;

  // ── Calendar helpers ──
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(calWeekStart);
    d.setDate(calWeekStart.getDate() + i);
    return d;
  });

  const navWeek = (dir: -1 | 1) => {
    setCalWeekStart(d => { const n = new Date(d); n.setDate(d.getDate() + dir * 7); return n; });
    setCalSelectedDay(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + dir * 7);
      return d.toISOString().split('T')[0];
    });
  };

  const fmtWeekRange = () => {
    const s = calWeekStart.toLocaleDateString('he-IL', { day: 'numeric', month: 'long' });
    const e = weekDays[6].toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
    return `${s} - ${e}`;
  };

  const daySlots = slots.filter(s => s.date === calSelectedDay);
  const bookingBySlotId: Record<string, Booking> = Object.fromEntries(
    bookings.filter(b => b.slots?.id).map(b => [b.slots.id, b])
  );
  const nowHour = new Date().getHours();
  const isSelectedToday = calSelectedDay === todayStr();

  return (
    <div className="min-h-screen bg-[#f5f0eb]" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm px-5 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#2F6B6B]">ניהול תורים</h1>
        <button onClick={logout} className="text-sm text-gray-500 hover:text-red-500 transition-colors">יציאה</button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-2 shadow-sm">
          <button className={tabClass('calendar')} onClick={() => setTab('calendar')}>יומן</button>
          <button className={tabClass('bookings')} onClick={() => setTab('bookings')}>
            בקשות תור {pending.length > 0 && <span className="mr-1 bg-red-500 text-white text-xs rounded-full px-1.5">{pending.length}</span>}
          </button>
          <button className={tabClass('reviews')} onClick={() => setTab('reviews')}>
            ביקורות {reviewDue.length > 0 && <span className="mr-1 bg-amber-500 text-white text-xs rounded-full px-1.5">{reviewDue.length}</span>}
          </button>
        </div>

        {/* ── BOOKINGS TAB ── */}
        {tab === 'bookings' && (
          <div className="space-y-4">
            {pending.length === 0 && <div className="bg-white rounded-2xl p-6 text-center text-gray-400 shadow-sm">אין בקשות ממתינות</div>}
            {pending.map(b => (
              <div key={b.id} className="bg-white rounded-2xl p-5 shadow-sm border-r-4 border-amber-400">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-[#2F6B6B] text-lg">{b.client_name}</p>
                    <p className="text-gray-500 text-sm" dir="ltr">{b.client_phone}</p>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">ממתין</span>
                </div>
                {b.slots && (
                  <div className="bg-[#f5f0eb] rounded-xl p-3 mb-4 text-sm space-y-1">
                    <p>📅 {formatDate(b.slots.date)} בשעה {b.slots.time.slice(0,5)}</p>
                    <p>📍 {b.selected_location || displayLocation(b.slots.location)}</p>
                    {b.treatment_name && <p>💆 {b.treatment_name} · {b.duration_minutes} דקות</p>}
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => confirmBooking(b.id)} className="flex-1 bg-[#2F6B6B] text-white py-2 rounded-xl text-sm font-semibold hover:bg-[#1F4A4A] transition-colors">✓ אשר</button>
                  <button onClick={() => rejectBooking(b.id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">✗ דחה</button>
                </div>
              </div>
            ))}

            {confirmed.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2 px-1">בתהליך</h3>
                {confirmed.map(b => (
                  <div key={b.id} className="bg-white rounded-2xl p-4 shadow-sm border-r-4 border-green-400 mb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-[#2F6B6B]">{b.client_name}</p>
                        {b.slots && <p className="text-xs text-gray-500">📅 {formatDate(b.slots.date)} {b.slots.time.slice(0,5)} · 📍 {b.selected_location || displayLocation(b.slots.location)}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${b.final_confirmation_sent ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {b.final_confirmation_sent ? 'אושר' : 'בתהליך'}
                        </span>
                        <button onClick={() => deleteBooking(b.id, b.client_name)} title="מחק בקשה"
                          className="text-gray-300 hover:text-red-400 transition-colors p-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${b.questionnaire_sent ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                        {b.questionnaire_sent ? '✓ שאלון נשלח' : '○ שאלון'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${b.final_confirmation_sent ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        {b.final_confirmation_sent ? '✓ אישור נשלח' : '○ אישור סופי'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <a href={questionnaireLink(b)} target="_blank" rel="noopener noreferrer"
                        onClick={() => markQuestionnaireSent(b.id)}
                        className="flex items-center justify-center gap-2 bg-[#2F6B6B] text-white py-2.5 rounded-xl text-sm font-semibold w-full">
                        📋 שלח שאלון רפואי ללקוח
                      </a>
                      <a href={finalConfirmationLink(b)} target="_blank" rel="noopener noreferrer"
                        onClick={() => markFinalSent(b.id)}
                        className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-xl text-sm font-semibold w-full">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        שלח אישור סופי ללקוח
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {bookings.filter(b => b.status === 'rejected').map(b => {
              const isRecent = Date.now() - new Date(b.created_at).getTime() < 24 * 60 * 60 * 1000;
              if (!isRecent) return null;
              return (
                <div key={b.id} className="bg-white rounded-2xl p-4 shadow-sm border-r-4 border-red-400 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-[#2F6B6B]">{b.client_name}</p>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">נדחה</span>
                  </div>
                  <a href={rejectionLink(b)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-semibold w-full">
                    שלח הודעת דחייה ללקוח
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {/* ── REVIEWS TAB ── */}
        {tab === 'reviews' && (
          <div className="space-y-3">
            {reviewDue.length === 0 && (
              <div className="bg-white rounded-2xl p-6 text-center text-gray-400 shadow-sm">אין טיפולים שהסתיימו כרגע</div>
            )}
            {reviewDue.map(b => (
              <div key={b.id} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="mb-3">
                  <p className="font-bold text-[#2F6B6B]">{b.client_name}</p>
                  {b.slots && (
                    <p className="text-sm text-gray-500">📅 {formatDate(b.slots.date)} {b.slots.time.slice(0,5)} · 📍 {b.selected_location || displayLocation(b.slots.location)}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <a href={reviewLink(b)} target="_blank" rel="noopener noreferrer"
                    onClick={() => markReviewSent(b.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-xl text-sm font-semibold">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    שלח בקשת ביקורת
                  </a>
                  <button onClick={() => markReviewSent(b.id)}
                    className="px-4 bg-gray-100 text-gray-500 rounded-xl text-sm hover:bg-gray-200 transition-colors font-medium">
                    מחק
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── CALENDAR TAB ── */}
        {tab === 'calendar' && (
          <div className="space-y-3">

            {/* Header card: week nav + day chips */}
            <div className="rounded-2xl overflow-hidden shadow-md" style={{ background: 'linear-gradient(145deg,#2F6B6B 0%,#1d4545 100%)' }}>
              {/* Week navigation */}
              <div className="flex items-center justify-between px-4 pt-4 pb-3">
                <button onClick={() => navWeek(-1)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 text-white text-lg transition-colors">›</button>
                <p className="text-white font-bold text-sm tracking-wide">{fmtWeekRange()}</p>
                <button onClick={() => navWeek(1)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 text-white text-lg transition-colors">‹</button>
              </div>

              {/* Day chips */}
              <div className="flex gap-1.5 px-3 pb-4 overflow-x-auto">
                {weekDays.map(day => {
                  const ds = day.toISOString().split('T')[0];
                  const isSel = calSelectedDay === ds;
                  const isT = ds === todayStr();
                  const dayHasAppt = slots.some(s => s.date === ds && s.is_booked);
                  const dayHasOpen = slots.some(s => s.date === ds && !s.is_booked);
                  return (
                    <button key={ds} onClick={() => setCalSelectedDay(ds)}
                      className={`flex-shrink-0 flex flex-col items-center px-3 py-2.5 rounded-xl min-w-[50px] transition-all duration-150 ${
                        isSel ? 'bg-white shadow-lg scale-105' : 'bg-white/12 hover:bg-white/22'
                      }`}>
                      <span className={`text-xs font-medium ${isSel ? 'text-[#2F6B6B]/70' : 'text-white/70'}`}>
                        {day.toLocaleDateString('he-IL', { weekday: 'short' })}
                      </span>
                      <span className={`text-xl font-bold leading-tight ${isSel ? 'text-[#2F6B6B]' : isT ? 'text-amber-300' : 'text-white'}`}>
                        {day.getDate()}
                      </span>
                      <div className="flex gap-0.5 mt-1 h-1.5">
                        {dayHasAppt && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 opacity-90" />}
                        {dayHasOpen && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-90" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hourly grid */}
            <div className="space-y-1.5">
              {HOURS.map(hour => {
                const timeStr = `${hour.toString().padStart(2, '0')}:00`;
                const slot = daySlots.find(s => s.time.startsWith(timeStr.slice(0, 5)));
                const booking = slot ? bookingBySlotId[slot.id] : undefined;
                const isPast = isSelectedToday && hour < nowHour;

                // Empty — no slot
                if (!slot) {
                  return (
                    <div key={hour} className={`flex items-center gap-3 px-2 py-1.5 rounded-xl transition-colors ${isPast ? 'opacity-25 pointer-events-none' : 'group hover:bg-white/60'}`}>
                      <span className="text-xs text-gray-900 font-medium w-11 text-left flex-shrink-0 tabular-nums">{timeStr}</span>
                      <div className="flex-1 h-px bg-gray-200/60 group-hover:bg-[#2F6B6B]/20 transition-colors" />
                      {!isPast && (
                        <button onClick={() => addSlotFromCalendar(calSelectedDay, hour)}
                          className="opacity-0 group-hover:opacity-100 text-xs text-[#2F6B6B] bg-[#2F6B6B]/8 hover:bg-[#2F6B6B]/15 px-3 py-1 rounded-lg border border-dashed border-[#2F6B6B]/30 transition-all flex-shrink-0">
                          + פתח
                        </button>
                      )}
                    </div>
                  );
                }

                // Available (open, not booked)
                if (!slot.is_booked) {
                  return (
                    <div key={hour} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[#2F6B6B]/20 ${isPast ? 'opacity-40' : 'bg-gradient-to-l from-[#2F6B6B]/5 to-[#2F6B6B]/10'}`}>
                      <span className="text-xs font-bold text-gray-900 w-11 flex-shrink-0 tabular-nums">{timeStr}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-[#2F6B6B] font-medium flex-1">פנוי לקביעה</span>
                      <button onClick={() => removeCalendarSlot(slot.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors flex-shrink-0 text-lg leading-none">×</button>
                    </div>
                  );
                }

                // No booking record (stale)
                if (!booking) {
                  return (
                    <div key={hour} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-100/80 border border-gray-200 opacity-60">
                      <span className="text-xs text-gray-900 font-medium w-11 flex-shrink-0 tabular-nums">{timeStr}</span>
                      <span className="text-xs text-gray-400 flex-1">תפוס</span>
                      <button onClick={() => releaseSlot(slot.id)} className="text-xs text-gray-400 hover:text-amber-600 bg-white px-2 py-1 rounded-lg transition-colors border border-gray-200">שחרר</button>
                    </div>
                  );
                }

                // Pending booking
                if (booking.status === 'pending') {
                  return (
                    <div key={hour} className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white shadow-sm border-r-[3px] border-amber-400">
                      <span className="text-xs font-bold text-gray-900 w-11 flex-shrink-0 tabular-nums">{timeStr}</span>
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-amber-700">
                        {booking.client_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 leading-tight">{booking.client_name}</p>
                        <p className="text-xs text-amber-500 font-medium">ממתין לאישור</p>
                      </div>
                      <button onClick={() => releaseSlot(slot.id)}
                        className="text-xs text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg transition-colors flex-shrink-0 font-medium border border-amber-200">
                        שחרר
                      </button>
                    </div>
                  );
                }

                // Confirmed booking
                const isFinal = booking.final_confirmation_sent;
                const isExp = expandedCalId === booking.id;
                return (
                  <div key={hour}
                    onClick={() => setExpandedCalId(isExp ? null : booking.id)}
                    className={`flex items-start gap-3 px-3 py-3 rounded-xl shadow-sm cursor-pointer transition-all duration-150 border-r-[3px] ${
                      isFinal
                        ? 'bg-white border-[#2F6B6B] hover:shadow-md'
                        : 'bg-white border-blue-400 hover:shadow-md'
                    }`}>
                    <span className={`text-xs font-bold w-11 flex-shrink-0 tabular-nums pt-0.5 text-gray-900`}>{timeStr}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${isFinal ? 'bg-[#2F6B6B]/12 text-[#2F6B6B]' : 'bg-blue-100 text-blue-700'}`}>
                      {booking.client_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold leading-tight ${isFinal ? 'text-gray-800' : 'text-gray-800'}`}>{booking.client_name}</p>
                        {isFinal && <span className="text-[10px] bg-[#2F6B6B]/10 text-[#2F6B6B] px-1.5 py-0.5 rounded-full font-medium">✓ אושר</span>}
                      </div>
                      {!isExp && (
                        <p className={`text-xs mt-0.5 ${isFinal ? 'text-[#2F6B6B]/70' : 'text-blue-500'}`}>
                          {isFinal
                            ? (booking.treatment_name || 'אישור סופי נשלח')
                            : booking.questionnaire_sent
                              ? 'ממתין לאישור סופי'
                              : 'ממתין לשאלון רפואי'}
                        </p>
                      )}
                      {isExp && (
                        <div className="mt-1.5 space-y-1">
                          {booking.treatment_name && (
                            <p className="text-xs text-gray-600">💆 {booking.treatment_name} · {booking.duration_minutes} דק&apos;</p>
                          )}
                          <p className="text-xs text-gray-500">📍 {booking.selected_location || displayLocation(slot.location)}</p>
                          <p className="text-xs text-gray-400" dir="ltr">{booking.client_phone}</p>
                        </div>
                      )}
                    </div>
                    <span className={`text-xs flex-shrink-0 mt-1 ${isFinal ? 'text-[#2F6B6B]/40' : 'text-blue-300'}`}>{isExp ? '▲' : '▼'}</span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 px-2 pt-1 pb-2">
              <span className="flex items-center gap-1.5 text-xs text-gray-400"><span className="w-2 h-2 rounded-full bg-emerald-400" />פנוי לקביעה</span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400"><span className="w-2 h-2 rounded-full bg-amber-400" />ממתין לאישור</span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400"><span className="w-2 h-2 rounded-full bg-blue-400" />בתהליך</span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400"><span className="w-2 h-2 rounded-full bg-[#2F6B6B]" />אושר סופית</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
