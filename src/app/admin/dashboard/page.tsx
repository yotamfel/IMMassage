'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Types
type Slot = { id: string; date: string; time: string; location: string; duration_minutes: number; is_booked: boolean };
type Booking = { id: string; client_name: string; client_phone: string; status: string; review_sent: boolean; created_at: string; slots: Slot; selected_location?: string; treatment_name?: string; duration_minutes?: number };

const LOCATIONS = ['בן בבא 1, ירושלים', 'חיים ברודי 15, ירושלים', 'ביקור בבית הלקוח'];

function displayLocation(locationStr: string): string {
  try {
    const locs = JSON.parse(locationStr);
    return Array.isArray(locs) ? locs.join(' / ') : locationStr;
  } catch { return locationStr; }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatPhone(phone: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('972')) return cleaned;
  if (cleaned.startsWith('0')) return '972' + cleaned.slice(1);
  return '972' + cleaned;
}

function questionnaireLink(b: Booking): string {
  const formUrl = process.env.NEXT_PUBLIC_MEDICAL_FORM_URL || '';
  const msg = `שלום ${b.client_name}! תודה על פנייתך 🙏\nכדי שנוכל לאשר את התור, אנא מלא שאלון רפואי קצר:\n${formUrl}\nלאחר מילוי השאלון נחזור אליך לאישור הסופי.`;
  return `https://wa.me/${formatPhone(b.client_phone)}?text=${encodeURIComponent(msg)}`;
}

function reviewLink(b: Booking): string {
  const msg = `היי! שמחתי לטפל בך.\nאם תרצה, אשמח שתשאיר לי ביקורת קצרה - זה עוזר לי מאוד.\nאפשר דרך הקישור הזה (לוקח פחות מדקה):\nhttps://shahrur-bamaga.vercel.app/#review\n\nחשוב מאוד, יכול להיות שביום אחרי הטיפול תהיה הרגשה של שרירים תפוסים וכאבים באזורים עליהם עבדתי. הכאב יחלוף תוך כמה ימים, מומלץ לא לעשות כושר עד 24 שעות לאחר הטיפול.`;
  return `https://wa.me/${formatPhone(b.client_phone)}?text=${encodeURIComponent(msg)}`;
}

function isAppointmentOver(b: Booking): boolean {
  const duration = b.duration_minutes || b.slots.duration_minutes || 60;
  const end = new Date(`${b.slots.date}T${b.slots.time}`);
  end.setMinutes(end.getMinutes() + duration + 30);
  return new Date() >= end;
}

function finalConfirmationLink(b: Booking): string {
  const location = b.selected_location || b.slots?.location || '';
  const duration = b.duration_minutes || b.slots?.duration_minutes || 60;
  const treatment = b.treatment_name ? `\n💆 ${b.treatment_name}` : '';
  const msg = `שלום ${b.client_name}! התור שלך אושר סופית ✅\n📅 ${formatDate(b.slots.date)} בשעה ${b.slots.time.slice(0,5)}\n📍 ${location}${treatment}\n⏱️ ${duration} דקות\nמצפה לראותך!\n\nשים לב ❤️, ניתן לבטל תור עד 24 שעות לפני. תור שיבוטל בסמוך יחויב מחיר מלא.`;
  return `https://wa.me/${formatPhone(b.client_phone)}?text=${encodeURIComponent(msg)}`;
}

function rejectionLink(b: Booking): string {
  const msg = `שלום ${b.client_name}, מצטערים – הזמן הזה כבר לא פנוי.\nלקביעת תור חדש: https://shichrur-bemaga.vercel.app/#booking`;
  return `https://wa.me/${formatPhone(b.client_phone)}?text=${encodeURIComponent(msg)}`;
}


export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<'slots' | 'bookings' | 'reviews' | 'calendar'>('bookings');
  const [calWeekStart, setCalWeekStart] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay()); // back to Sunday
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Add slot form
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLocations, setNewLocations] = useState<string[]>([]);
  const [addingSlot, setAddingSlot] = useState(false);

  const toggleLocation = (loc: string) =>
    setNewLocations(prev => prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]);

  const fetchData = useCallback(async () => {
    const [slotsRes, bookingsRes] = await Promise.all([
      fetch('/api/admin/slots'),
      fetch('/api/admin/bookings'),
    ]);
    if (slotsRes.status === 401 || bookingsRes.status === 401) {
      router.push('/admin');
      return;
    }
    setSlots(await slotsRes.json());
    setBookings(await bookingsRes.json());
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const logout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin');
  };

  const addSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newLocations.length === 0) return;
    setAddingSlot(true);
    await fetch('/api/slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: newDate, time: newTime, location: JSON.stringify(newLocations), duration_minutes: 60 }),
    });
    setNewDate(''); setNewTime(''); setNewLocations([]);
    setAddingSlot(false);
    fetchData();
  };

  const releaseSlot = async (id: string) => {
    await fetch(`/api/slots/${id}`, { method: 'PATCH' });
    fetchData();
  };

  const deleteSlot = async (id: string) => {
    await fetch(`/api/slots/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const confirmBooking = async (id: string) => {
    await fetch(`/api/admin/bookings/${id}/confirm`, { method: 'POST' });
    fetchData();
  };

  const rejectBooking = async (id: string) => {
    await fetch(`/api/admin/bookings/${id}/reject`, { method: 'POST' });
    fetchData();
  };

  const markReviewSent = async (id: string) => {
    await fetch(`/api/admin/bookings/${id}/review-sent`, { method: 'POST' });
    fetchData();
  };

  const deleteBooking = async (id: string) => {
    await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const pending = bookings.filter(b => b.status === 'pending');
  const confirmed = bookings.filter(b => b.status === 'confirmed');
  const reviewDue = confirmed.filter(b => !b.review_sent && b.slots && isAppointmentOver(b));

  const tabClass = (t: string) =>
    `px-4 py-2 text-sm font-medium rounded-full transition-colors ${tab === t ? 'bg-[#2F6B6B] text-white' : 'text-[#2F6B6B] hover:bg-[#2F6B6B]/10'}`;

  if (loading) return <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center" dir="rtl"><p className="text-[#2F6B6B]">טוען...</p></div>;

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
          <button className={tabClass('bookings')} onClick={() => setTab('bookings')}>
            בקשות תור {pending.length > 0 && <span className="mr-1 bg-red-500 text-white text-xs rounded-full px-1.5">{pending.length}</span>}
          </button>
          <button className={tabClass('slots')} onClick={() => setTab('slots')}>שעות זמינות</button>
          <button className={tabClass('reviews')} onClick={() => setTab('reviews')}>
            ביקורות {reviewDue.length > 0 && <span className="mr-1 bg-amber-500 text-white text-xs rounded-full px-1.5">{reviewDue.length}</span>}
          </button>
          <button className={tabClass('calendar')} onClick={() => setTab('calendar')}>יומן</button>
        </div>

        {/* BOOKINGS TAB */}
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

            {/* Confirmed bookings */}
            {confirmed.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2 px-1">אושרו</h3>
                {confirmed.map(b => (
                  <div key={b.id} className="bg-white rounded-2xl p-4 shadow-sm border-r-4 border-green-400 mb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-[#2F6B6B]">{b.client_name}</p>
                        {b.slots && <p className="text-xs text-gray-500">📅 {formatDate(b.slots.date)} {b.slots.time.slice(0,5)} · 📍 {b.selected_location || displayLocation(b.slots.location)}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">אושר</span>
                        <button onClick={() => deleteBooking(b.id)} title="מחק בקשה"
                          className="text-gray-300 hover:text-red-400 transition-colors p-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <a href={questionnaireLink(b)} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-[#2F6B6B] text-white py-2.5 rounded-xl text-sm font-semibold w-full">
                        📋 שלח שאלון רפואי ללקוח
                      </a>
                      <a href={finalConfirmationLink(b)} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-xl text-sm font-semibold w-full">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        שלח אישור סופי ללקוח
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recently rejected - show rejection WhatsApp */}
            {bookings.filter(b => b.status === 'rejected').map(b => {
              const isRecent = new Date().getTime() - new Date(b.created_at).getTime() < 24 * 60 * 60 * 1000;
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

        {/* SLOTS TAB */}
        {tab === 'slots' && (
          <div className="space-y-4">
            {/* Add slot form */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-[#2F6B6B] mb-4">הוסף שעה חדשה</h3>
              <form onSubmit={addSlot} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">תאריך</label>
                    <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6B6B]/30" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">שעה</label>
                    <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} required
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6B6B]/30" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">מיקום (ניתן לסמן יותר מאחד)</label>
                  <div className="space-y-2">
                    {LOCATIONS.map(loc => (
                      <label key={loc} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors text-sm ${newLocations.includes(loc) ? 'border-[#2F6B6B] bg-[#2F6B6B]/5' : 'border-gray-200'}`}>
                        <input type="checkbox" checked={newLocations.includes(loc)} onChange={() => toggleLocation(loc)} className="w-4 h-4 accent-[#2F6B6B]" />
                        {loc}
                      </label>
                    ))}
                  </div>
                </div>
                <button type="submit" disabled={addingSlot}
                  className="w-full bg-[#2F6B6B] text-white py-3 rounded-xl font-semibold hover:bg-[#1F4A4A] transition-colors disabled:opacity-50">
                  {addingSlot ? 'מוסיף...' : '+ הוסף שעה'}
                </button>
              </form>
            </div>

            {/* Slots list */}
            <div className="space-y-2">
              {slots.length === 0 && <div className="bg-white rounded-2xl p-6 text-center text-gray-400 shadow-sm">אין שעות זמינות</div>}
              {slots.map(s => (
                <div key={s.id} className={`bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between ${s.is_booked ? 'opacity-60' : ''}`}>
                  <div>
                    <p className="font-semibold text-[#2F6B6B] text-sm">{formatDate(s.date)} · {s.time.slice(0,5)}</p>
                    <p className="text-gray-500 text-xs">📍 {displayLocation(s.location)} · {s.duration_minutes} דק&apos;</p>
                    {s.is_booked && <span className="text-xs text-amber-600 font-medium">תפוס</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {s.is_booked && (
                      <button onClick={() => releaseSlot(s.id)} className="text-xs text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors font-medium">
                        שחרר
                      </button>
                    )}
                    {!s.is_booked && (
                      <button onClick={() => deleteSlot(s.id)} className="text-red-400 hover:text-red-600 transition-colors p-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CALENDAR TAB */}
        {tab === 'calendar' && (() => {
          const weekDays = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(calWeekStart);
            d.setDate(calWeekStart.getDate() + i);
            return d;
          });
          const weekEnd = weekDays[6];
          const todayStr = new Date().toISOString().split('T')[0];

          const byDate: Record<string, Booking[]> = {};
          confirmed.forEach(b => {
            if (b.slots?.date) {
              byDate[b.slots.date] = byDate[b.slots.date] || [];
              byDate[b.slots.date].push(b);
            }
          });

          const fmtRange = () => {
            const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
            const s = calWeekStart.toLocaleDateString('he-IL', opts);
            const e = weekEnd.toLocaleDateString('he-IL', { ...opts, year: 'numeric' });
            return `${s} - ${e}`;
          };

          return (
            <div className="space-y-3">
              {/* Week nav */}
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between">
                <button onClick={() => setCalWeekStart(d => { const p = new Date(d); p.setDate(d.getDate() - 7); return p; })}
                  className="text-[#2F6B6B] hover:text-[#1F4A4A] p-1 rounded-lg hover:bg-[#2F6B6B]/10 transition-colors text-lg">→</button>
                <p className="text-sm font-semibold text-[#2F6B6B] text-center">{fmtRange()}</p>
                <button onClick={() => setCalWeekStart(d => { const n = new Date(d); n.setDate(d.getDate() + 7); return n; })}
                  className="text-[#2F6B6B] hover:text-[#1F4A4A] p-1 rounded-lg hover:bg-[#2F6B6B]/10 transition-colors text-lg">←</button>
              </div>

              {/* Days */}
              {weekDays.map(day => {
                const dateStr = day.toISOString().split('T')[0];
                const dayBookings = (byDate[dateStr] || []).sort((a, b) => a.slots.time.localeCompare(b.slots.time));
                const isToday = dateStr === todayStr;
                const weekdayName = day.toLocaleDateString('he-IL', { weekday: 'long' });
                const dayNum = day.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });

                return (
                  <div key={dateStr} className={`bg-white rounded-2xl overflow-hidden shadow-sm ${dayBookings.length === 0 ? 'opacity-50' : ''}`}>
                    <div className={`px-4 py-2.5 flex items-center gap-2 ${isToday ? 'bg-[#2F6B6B] text-white' : 'border-b border-gray-100'}`}>
                      <span className={`font-semibold text-sm ${isToday ? 'text-white' : 'text-[#2F6B6B]'}`}>{weekdayName}</span>
                      <span className={`text-xs ${isToday ? 'text-white/80' : 'text-gray-400'}`}>{dayNum}</span>
                      {isToday && <span className="mr-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">היום</span>}
                    </div>
                    {dayBookings.length === 0 ? (
                      <p className="text-gray-300 text-xs px-4 py-2">אין תורים</p>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {dayBookings.map(b => (
                          <div key={b.id} className="px-4 py-3 flex items-start gap-3">
                            <span className="text-[#2F6B6B] font-bold text-sm min-w-[40px]">{b.slots.time.slice(0, 5)}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-800 text-sm">{b.client_name}</p>
                              {b.treatment_name && (
                                <p className="text-xs text-gray-500">{b.treatment_name} · {b.duration_minutes} דק&apos;</p>
                              )}
                              {(b.selected_location || b.slots?.location) && (
                                <p className="text-xs text-gray-400 truncate">📍 {b.selected_location || displayLocation(b.slots.location)}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* REVIEWS TAB */}
        {tab === 'reviews' && (
          <div className="space-y-3">
            {reviewDue.length === 0 && (
              <div className="bg-white rounded-2xl p-6 text-center text-gray-400 shadow-sm">
                אין טיפולים שהסתיימו כרגע
              </div>
            )}
            {reviewDue.map(b => (
              <div key={b.id} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="mb-3">
                  <p className="font-bold text-[#2F6B6B]">{b.client_name}</p>
                  {b.slots && (
                    <p className="text-sm text-gray-500">
                      📅 {formatDate(b.slots.date)} {b.slots.time.slice(0,5)} · 📍 {b.selected_location || displayLocation(b.slots.location)}
                    </p>
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

      </div>
    </div>
  );
}
