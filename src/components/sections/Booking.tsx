'use client';
import { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n/LangContext';

type Slot = { id: string; date: string; time: string; location: string; duration_minutes: number };
type Treatment = { id: string; he: string; en: string; durations: number[] };

const TREATMENTS: Treatment[] = [
  { id: 'swedish',    he: 'עיסוי שוודי',       en: 'Swedish Massage',    durations: [45, 60] },
  { id: 'medical',    he: 'עיסוי רפואי',        en: 'Medical Massage',    durations: [45, 60] },
  { id: 'cupping',    he: 'כוסות רוח',          en: 'Cupping Therapy',    durations: [50] },
  { id: 'hot-stones', he: 'אבנים חמות',         en: 'Hot Stone Massage',  durations: [50] },
  { id: 'face-neck',  he: 'עיסוי פנים וצוואר', en: 'Face & Neck Massage', durations: [30] },
];

const ISRAEL_PHONE = '972508838374';

function parseLocations(locationStr: string): string[] {
  try {
    const parsed = JSON.parse(locationStr);
    return Array.isArray(parsed) ? parsed : [locationStr];
  } catch { return [locationStr]; }
}

function formatPhone(phone: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('972')) return cleaned;
  if (cleaned.startsWith('0')) return '972' + cleaned.slice(1);
  return '972' + cleaned;
}

function formatDateLong(dateStr: string, lang: string) {
  return new Date(dateStr).toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-IL', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

function formatDateTab(dateStr: string, lang: string) {
  const d = new Date(dateStr);
  return {
    weekday: d.toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-IL', { weekday: 'short' }),
    day: d.getDate(),
    month: d.toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-IL', { month: 'short' }),
  };
}

export default function Booking() {
  const { t, lang } = useLang();
  const isHe = lang === 'he';
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'select' | 'details' | 'success'>('select');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/slots')
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        setSlots(arr);
        if (arr.length > 0) setSelectedDate(arr[0].date);
        setLoadingSlots(false);
      })
      .catch(() => setLoadingSlots(false));
  }, []);

  const dates = [...new Set(slots.map(s => s.date))].sort();
  const slotsForDate = slots.filter(s => s.date === selectedDate);

  const handleSelectSlot = (slot: Slot) => {
    setSelectedSlot(slot);
    const locs = parseLocations(slot.location);
    setSelectedLocation(locs.length === 1 ? locs[0] : '');
    setSelectedTreatment(null);
    setSelectedDuration(null);
    setStep('details');
    setTimeout(() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
  };

  const handleSelectTreatment = (t: Treatment) => {
    setSelectedTreatment(t);
    setSelectedDuration(t.durations.length === 1 ? t.durations[0] : null);
  };

  const canSubmit = !!selectedLocation && !!selectedTreatment && !!selectedDuration && name && phone;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !selectedTreatment || !selectedDuration) return;
    setSubmitting(true);

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slot_id: selectedSlot.id,
        client_name: name,
        client_phone: formatPhone(phone),
        selected_location: selectedLocation,
        treatment_name: isHe ? selectedTreatment.he : selectedTreatment.en,
        duration_minutes: selectedDuration,
      }),
    });

    if (res.ok) {
      setStep('success');
      setSlots(prev => prev.filter(s => s.id !== selectedSlot.id));
    } else {
      const err = await res.json().catch(() => ({}));
      if (err.error === 'Slot not available') {
        alert(isHe ? 'מצטערים, השעה הזו כבר לא פנויה' : 'Sorry, this slot is no longer available');
        setSlots(prev => prev.filter(s => s.id !== selectedSlot.id));
        setStep('select');
        setSelectedSlot(null);
      }
    }
    setSubmitting(false);
  };

  return (
    <section id="booking" className="bg-cream-dark py-20 px-5">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-2"
            style={{ fontFamily: 'var(--font-frank-ruhl), serif' }}>
            {t.booking.title}
          </h2>
          <p className="text-primary text-base">{t.booking.subtitle}</p>
        </div>

        {step === 'success' && (
          <div className="bg-[#f0f9f6] rounded-2xl p-8 text-center border border-[#2F6B6B]/20">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-xl font-bold text-primary-dark mb-2">{t.booking.successTitle}</h3>
            <p className="text-gray-600 text-sm">{t.booking.successText}</p>
          </div>
        )}

        {step !== 'success' && (
          <>
            {loadingSlots && <p className="text-center text-gray-400 py-8">{t.booking.loading}</p>}

            {!loadingSlots && slots.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">{t.booking.noSlots}</p>
                <a href={`https://wa.me/${ISRAEL_PHONE}?text=${encodeURIComponent(isHe ? 'היי, אשמח לקבוע תור לעיסוי' : "Hi, I'd like to book a massage")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full text-sm font-semibold">
                  {t.booking.contactWhatsApp}
                </a>
              </div>
            )}

            {!loadingSlots && slots.length > 0 && (
              <div className="bg-white border border-primary/15 rounded-2xl overflow-hidden shadow-sm">
                {/* Date tabs */}
                <div className="flex overflow-x-auto border-b border-primary/10 scrollbar-hide">
                  {dates.map(date => {
                    const { weekday, day, month } = formatDateTab(date, lang);
                    const isActive = selectedDate === date;
                    return (
                      <button key={date} onClick={() => { setSelectedDate(date); setSelectedSlot(null); setStep('select'); }}
                        className={`flex-shrink-0 flex flex-col items-center px-5 py-3 text-center transition-colors border-b-2 min-w-[80px] ${
                          isActive ? 'border-primary bg-primary/5 text-primary-dark' : 'border-transparent text-gray-500 hover:text-primary-dark'
                        }`}>
                        <span className="text-xs font-medium">{weekday}</span>
                        <span className={`text-xl font-bold leading-tight ${isActive ? 'text-primary' : ''}`}>{day}</span>
                        <span className="text-xs">{month}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Time chips */}
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {slotsForDate.map(slot => {
                      const isSelected = selectedSlot?.id === slot.id;
                      return (
                        <button key={slot.id} onClick={() => handleSelectSlot(slot)}
                          className={`flex flex-col items-start px-4 py-2.5 rounded-xl border-2 transition-all text-sm ${
                            isSelected ? 'border-primary bg-primary text-white' : 'border-primary/20 bg-white hover:border-primary/60 text-primary-dark'
                          }`}>
                          <span className="font-bold text-base">{slot.time.slice(0, 5)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Details form */}
                {step === 'details' && selectedSlot && (() => {
                  const locations = parseLocations(selectedSlot.location);
                  return (
                    <div id="booking-form" className="border-t border-primary/10 bg-primary/3 p-4 space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-primary-dark">
                          📅 {formatDateLong(selectedSlot.date, lang)}, {selectedSlot.time.slice(0, 5)}
                        </p>
                        <button onClick={() => { setStep('select'); setSelectedSlot(null); }}
                          className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
                      </div>

                      {/* Location selector */}
                      {locations.length > 1 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-2">{isHe ? 'בחר מיקום' : 'Choose location'}</p>
                          <div className="flex flex-col gap-1.5">
                            {locations.map(loc => (
                              <label key={loc} className={`flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl border-2 text-sm transition-colors ${
                                selectedLocation === loc ? 'border-primary bg-primary/5 font-medium' : 'border-gray-200 text-gray-600'
                              }`}>
                                <input type="radio" name="location" value={loc} checked={selectedLocation === loc} onChange={() => setSelectedLocation(loc)} className="sr-only" />
                                <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selectedLocation === loc ? 'border-primary' : 'border-gray-300'}`}>
                                  {selectedLocation === loc && <span className="w-2 h-2 rounded-full bg-primary block" />}
                                </span>
                                📍 {loc}
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                      {locations.length === 1 && <p className="text-xs text-gray-500">📍 {selectedLocation}</p>}

                      {/* Treatment selector */}
                      <div>
                        <p className="text-xs text-gray-500 mb-2">{isHe ? 'בחר טיפול' : 'Choose treatment'}</p>
                        <div className="flex flex-col gap-1.5">
                          {TREATMENTS.map(tr => (
                            <label key={tr.id} className={`flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl border-2 text-sm transition-colors ${
                              selectedTreatment?.id === tr.id ? 'border-primary bg-primary/5 font-medium' : 'border-gray-200 text-gray-600'
                            }`}>
                              <input type="radio" name="treatment" checked={selectedTreatment?.id === tr.id} onChange={() => handleSelectTreatment(tr)} className="sr-only" />
                              <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selectedTreatment?.id === tr.id ? 'border-primary' : 'border-gray-300'}`}>
                                {selectedTreatment?.id === tr.id && <span className="w-2 h-2 rounded-full bg-primary block" />}
                              </span>
                              {isHe ? tr.he : tr.en}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Duration selector */}
                      {selectedTreatment && selectedTreatment.durations.length > 1 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-2">{isHe ? 'בחר משך' : 'Choose duration'}</p>
                          <div className="flex gap-2">
                            {selectedTreatment.durations.map(d => (
                              <button key={d} type="button" onClick={() => setSelectedDuration(d)}
                                className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-colors ${
                                  selectedDuration === d ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-600 hover:border-primary/50'
                                }`}>
                                {d} {t.booking.minuteShort}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Name + Phone + Submit */}
                      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required
                          placeholder={t.booking.namePlaceholder}
                          className="flex-1 border border-primary/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white" />
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required
                          placeholder={t.booking.phonePlaceholder} dir="ltr"
                          className="flex-1 border border-primary/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white" />
                        <button type="submit" disabled={submitting || !canSubmit}
                          className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm whitespace-nowrap">
                          {submitting ? t.booking.submitting : t.booking.submit}
                        </button>
                      </form>
                    </div>
                  );
                })()}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
