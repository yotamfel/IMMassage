'use client';
import { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n/LangContext';

type Slot = { id: string; date: string; time: string; location: string; duration_minutes: number };
type GroupedSlots = { [date: string]: Slot[] };

const ISRAEL_PHONE = '972508838374';

function formatDate(dateStr: string, lang: string) {
  return new Date(dateStr).toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-IL', {
    weekday: 'long', day: 'numeric', month: 'long'
  });
}

function formatPhone(phone: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('972')) return cleaned;
  if (cleaned.startsWith('0')) return '972' + cleaned.slice(1);
  return '972' + cleaned;
}

export default function Booking() {
  const { t, lang } = useLang();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'select' | 'details' | 'success'>('select');
  const [submitting, setSubmitting] = useState(false);
  const [waLink, setWaLink] = useState('');

  useEffect(() => {
    fetch('/api/slots')
      .then(r => r.json())
      .then(data => { setSlots(Array.isArray(data) ? data : []); setLoadingSlots(false); })
      .catch(() => setLoadingSlots(false));
  }, []);

  const grouped: GroupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {} as GroupedSlots);

  const handleSelectSlot = (slot: Slot) => {
    setSelectedSlot(slot);
    setStep('details');
    setTimeout(() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setSubmitting(true);
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot_id: selectedSlot.id, client_name: name, client_phone: formatPhone(phone) }),
    });
    if (res.ok) {
      const isHe = lang === 'he';
      const dateStr = formatDate(selectedSlot.date, lang);
      const msg = isHe
        ? `היי ישראל, אשמח לקבוע תור 🙏\n📅 ${dateStr} בשעה ${selectedSlot.time.slice(0,5)}\n📍 ${selectedSlot.location}\n⏱️ ${selectedSlot.duration_minutes} דקות\nשמי ${name}`
        : `Hi Israel, I'd like to book an appointment 🙏\n📅 ${dateStr} at ${selectedSlot.time.slice(0,5)}\n📍 ${selectedSlot.location}\n⏱️ ${selectedSlot.duration_minutes} min\nMy name is ${name}`;
      setWaLink(`https://wa.me/${ISRAEL_PHONE}?text=${encodeURIComponent(msg)}`);
      setStep('success');
      setSlots(prev => prev.filter(s => s.id !== selectedSlot.id));
    } else {
      const err = await res.json();
      if (err.error === 'Slot not available') {
        alert(lang === 'he' ? 'מצטערים, השעה הזו כבר לא פנויה' : 'Sorry, this slot is no longer available');
        setSlots(prev => prev.filter(s => s.id !== selectedSlot.id));
        setStep('select');
        setSelectedSlot(null);
      }
    }
    setSubmitting(false);
  };

  return (
    <section id="booking" className="bg-white py-20 px-5">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-2"
            style={{ fontFamily: 'var(--font-frank-ruhl), serif' }}>
            {t.booking.title}
          </h2>
          <p className="text-primary text-base">{t.booking.subtitle}</p>
        </div>

        {/* SUCCESS */}
        {step === 'success' && (
          <div className="bg-[#f0f9f6] rounded-2xl p-8 text-center border border-[#2F6B6B]/20">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-xl font-bold text-primary-dark mb-2">{t.booking.successTitle}</h3>
            <p className="text-gray-600 mb-6 text-sm">{t.booking.successText}</p>
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#1ebe5c] transition-colors shadow-md">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              {t.booking.sendWhatsApp}
            </a>
          </div>
        )}

        {/* SELECT SLOT */}
        {step !== 'success' && (
          <>
            {loadingSlots && <p className="text-center text-gray-400">{t.booking.loading}</p>}
            {!loadingSlots && slots.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">{t.booking.noSlots}</p>
                <a href={`https://wa.me/${ISRAEL_PHONE}?text=${encodeURIComponent(lang === 'he' ? 'היי, אשמח לקבוע תור לעיסוי' : "Hi, I'd like to book a massage")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full text-sm font-semibold">
                  {t.booking.contactWhatsApp}
                </a>
              </div>
            )}

            {!loadingSlots && Object.keys(grouped).length > 0 && (
              <div className="space-y-6">
                {Object.entries(grouped).map(([date, daySlots]) => (
                  <div key={date}>
                    <h3 className="text-sm font-semibold text-primary-dark mb-2 px-1">{formatDate(date, lang)}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {daySlots.map(slot => (
                        <button key={slot.id} onClick={() => handleSelectSlot(slot)}
                          className={`text-right px-4 py-3 rounded-xl border-2 transition-all ${selectedSlot?.id === slot.id ? 'border-primary bg-primary/5' : 'border-primary/20 bg-white hover:border-primary/60 hover:bg-primary/5'}`}>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-primary-dark text-lg">{slot.time.slice(0,5)}</span>
                            <span className="text-xs text-primary bg-primary/10 rounded-full px-2 py-0.5">{slot.duration_minutes} {t.booking.minuteShort}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">📍 {slot.location}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* DETAILS FORM */}
            {step === 'details' && selectedSlot && (
              <div id="booking-form" className="mt-6 bg-primary/5 rounded-2xl p-5 border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-primary-dark">{t.booking.yourDetails}</h3>
                  <button onClick={() => { setStep('select'); setSelectedSlot(null); }} className="text-sm text-gray-400 hover:text-gray-600">✕</button>
                </div>
                <div className="bg-white rounded-xl p-3 mb-4 text-sm">
                  <p className="font-semibold text-primary-dark">📅 {formatDate(selectedSlot.date, lang)} · {selectedSlot.time.slice(0,5)}</p>
                  <p className="text-gray-500 text-xs mt-0.5">📍 {selectedSlot.location} · {selectedSlot.duration_minutes} {t.booking.minuteShort}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required
                    placeholder={t.booking.namePlaceholder}
                    className="w-full border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required
                    placeholder={t.booking.phonePlaceholder} dir="ltr"
                    className="w-full border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <button type="submit" disabled={submitting}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
                    {submitting ? t.booking.submitting : t.booking.submit}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
