'use client';

import { useState } from 'react';
import { useLang } from '@/lib/i18n/LangContext';

export default function ReviewForm() {
  const { t } = useLang();
  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const active = hovered || stars;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stars === 0) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stars, text: text.trim(), name: name.trim() }),
      });
      if (res.ok) {
        setStatus('success');
        setStars(0);
        setName('');
        setText('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="review" className="bg-cream-dark py-20 px-5">
      <div className="max-w-lg mx-auto">

        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-2">
            {t.review.title}
          </h2>
          <p className="text-primary text-base">{t.review.subtitle}</p>
        </div>

        {status === 'success' ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[1,2,3,4,5].map(s => (
                <svg key={s} viewBox="0 0 24 24" className="w-8 h-8 text-gold" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <p className="text-xl font-semibold text-primary-dark">
              {t.review.success}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 md:p-8">

            {/* Stars */}
            <div className="flex justify-center gap-2 mb-6" role="group" aria-label={t.review.starLabel}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setStars(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`${star}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className={`w-11 h-11 transition-colors duration-150 ${
                      star <= active ? 'text-gold' : 'text-gray-200'
                    }`}
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Name */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.review.namePlaceholder}
              className="w-full border border-primary/20 rounded-xl px-4 py-3 text-sm text-[#333] placeholder-[#bbb] focus:outline-none focus:ring-2 focus:ring-primary/30 bg-cream/40 mb-3"
            />

            {/* Textarea */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.review.placeholder}
              rows={4}
              className="w-full border border-primary/20 rounded-xl px-4 py-3 text-sm text-[#333] placeholder-[#bbb] resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 bg-cream/40 mb-4"
            />

            {status === 'error' && (
              <p className="text-red-500 text-sm mb-3 text-center">{t.review.error}</p>
            )}

            <button
              type="submit"
              disabled={stars === 0 || status === 'sending'}
              className="w-full bg-primary hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors duration-200 text-base"
            >
              {status === 'sending' ? t.review.sending : t.review.submit}
            </button>

            <p className="text-center text-xs text-[#bbb] mt-3">{t.review.anonymous}</p>
          </form>
        )}

      </div>
    </section>
  );
}
