'use client';

import { useState, useRef, useEffect } from 'react';
import {
  chatNodes,
  getChatNode,
  ROOT_NODE_ID,
  MAIN_MENU_NODE_ID,
  WHATSAPP_NUMBER,
  ChatOption,
  buildCalendlyUrl,
} from '@/data/chatbot-config';
import { detectsBookingIntent, BOOKING_INTENT_NODE_ID } from '@/lib/chatbot-intent';
import { useLang } from '@/lib/i18n/LangContext';

interface DisplayMessage {
  role: 'bot' | 'user';
  text: string;
}

interface ApiMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface FormData {
  name: string;
  phone: string;
  painArea: string;
}

interface PendingBooking {
  label: string;
  slug: string;
}

const rootNode = chatNodes.find(n => n.id === ROOT_NODE_ID)!;

function interpolate(message: string, form: FormData): string {
  return message.replace('{name}', form.name || '');
}

export default function ChatBot() {
  const { lang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState<string>(ROOT_NODE_ID);
  const [freeChatMode, setFreeChatMode] = useState(false);
  const [freeChatHistory, setFreeChatHistory] = useState<ApiMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({ name: '', phone: '', painArea: '' });
  const [pendingBooking, setPendingBooking] = useState<PendingBooking | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('chatbot-auto-opened')) return;
    } catch {
      // sessionStorage unavailable - fall through and open once anyway
    }
    const timer = setTimeout(() => {
      setIsOpen(true);
      try {
        sessionStorage.setItem('chatbot-auto-opened', '1');
      } catch {
        // ignore
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'bot', text: rootNode.message }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  function goToMainMenu() {
    const node = getChatNode(MAIN_MENU_NODE_ID);
    if (!node) return;
    setCurrentNodeId(node.id);
    setFreeChatMode(false);
    setMessages(prev => [...prev, { role: 'bot', text: interpolate(node.message, form) }]);
  }

  function selectOption(option: ChatOption) {
    if (option.nextId === 'free-chat') {
      setMessages(prev => [
        ...prev,
        { role: 'user', text: option.label },
        { role: 'bot', text: 'בטח, מה תרצה לשאול?' },
      ]);
      setFreeChatMode(true);
      return;
    }

    if (option.booking) {
      setPendingBooking(option.booking);
    }

    if (option.nextId === 'CONFIRM_BOOK') {
      const booking = option.booking ?? pendingBooking;
      setMessages(prev => [...prev, { role: 'user', text: option.label }]);
      if (booking) {
        const base = buildCalendlyUrl(booking.slug, lang);
        const url = form.name ? `${base}&name=${encodeURIComponent(form.name)}` : base;
        window.Calendly?.initPopupWidget({ url });
        setMessages(prev => [
          ...prev,
          {
            role: 'bot',
            text: `מעולה${form.name ? ' ' + form.name : ''}! פתחתי לך את לוח השנה לבחירת תאריך ושעה ל${booking.label} 😊`,
          },
        ]);
      }
      goToMainMenu();
      return;
    }

    if (option.nextId === 'HANDOFF_WHATSAPP') {
      const booking = option.booking ?? pendingBooking;
      setMessages(prev => [...prev, { role: 'user', text: option.label }]);
      const lines = [
        `היי, אני ${form.name || 'לקוח'} ומגיע מהצ'אט באתר.`,
        booking ? `מעוניין ב${booking.label}.` : '',
        form.phone ? `הטלפון שלי: ${form.phone}.` : '',
        'אשמח לדבר איתך.',
      ].filter(Boolean);
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join(' '))}`;
      window.open(waUrl, '_blank');
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: 'מעביר אותך לוואטסאפ כדי לדבר ישירות עם ישראל 😊' },
      ]);
      goToMainMenu();
      return;
    }

    const node = getChatNode(option.nextId);
    if (!node) return;

    setMessages(prev => [
      ...prev,
      { role: 'user', text: option.label },
      { role: 'bot', text: interpolate(node.message, form) },
    ]);
    setCurrentNodeId(node.id);
  }

  function submitInputValue() {
    const text = inputText.trim();
    if (!text || loading) return;

    const node = currentNode;
    if (!node || node.type !== 'input') return;

    setInputText('');
    setForm(prev => ({ ...prev, [node.variable]: text }));

    const nextNode = getChatNode(node.nextId);
    setMessages(prev => [
      ...prev,
      { role: 'user', text },
      ...(nextNode
        ? [{ role: 'bot' as const, text: interpolate(nextNode.message, { ...form, [node.variable]: text }) }]
        : []),
    ]);
    if (nextNode) setCurrentNodeId(nextNode.id);
  }

  async function sendFreeText() {
    const text = inputText.trim();
    if (!text || loading) return;
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text }]);

    if (detectsBookingIntent(text)) {
      const node = getChatNode(BOOKING_INTENT_NODE_ID);
      if (node) {
        setMessages(prev => [...prev, { role: 'bot', text: interpolate(node.message, form) }]);
        setCurrentNodeId(node.id);
        setFreeChatMode(false);
        return;
      }
    }

    const history = [...freeChatHistory, { role: 'user' as const, content: text }];
    setFreeChatHistory(history);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      const reply = data.reply || 'מצטער, לא הצלחתי לענות כרגע. אפשר ליצור קשר ישירות בוואטסאפ.';
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
      setFreeChatHistory(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: 'מצטער, משהו השתבש. אפשר ליצור קשר ישירות בוואטסאפ.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const currentNode = getChatNode(currentNodeId);
  const showTreeOptions = !freeChatMode && currentNode?.type !== 'input' && currentNode;
  const showTreeInput = !freeChatMode && currentNode?.type === 'input';
  const showBackButton = !freeChatMode && currentNodeId !== ROOT_NODE_ID;

  return (
    <>
      <button
        onClick={() => setIsOpen(o => !o)}
        className="fixed bottom-6 start-6 z-50 flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors"
        aria-label="צ׳אט"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
            <path d="M12 2C6.48 2 2 5.94 2 10.8c0 2.76 1.44 5.22 3.7 6.83-.13 1.13-.6 2.5-1.63 3.87a.5.5 0 00.5.8c2.1-.42 3.83-1.3 5.02-2.06.77.15 1.58.24 2.41.24 5.52 0 10-3.94 10-8.8S17.52 2 12 2z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 start-6 z-50 w-[90vw] max-w-sm h-[70vh] max-h-[560px] bg-cream rounded-2xl shadow-2xl border border-primary/15 flex flex-col overflow-hidden">
          <div className="bg-primary text-white px-4 py-3 flex items-center justify-between shrink-0">
            <span className="font-bold">שחרור במגע - עוזר דיגיטלי</span>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-line leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary text-white rounded-bl-sm'
                      : 'bg-white text-[#2B2B2B] rounded-br-sm shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-[#2B2B2B] rounded-2xl rounded-br-sm shadow-sm px-3.5 py-2.5 text-sm">
                  כותב...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-primary/10 bg-cream shrink-0">
            {showTreeOptions && (
              <div className="px-3 py-3 flex flex-wrap gap-2">
                {currentNode!.options.map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => selectOption(opt)}
                    className="text-sm bg-white border border-primary/30 text-primary-dark rounded-full px-3.5 py-2 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {showTreeInput && (
              <div className="px-3 py-3 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submitInputValue()}
                  placeholder="כתוב כאן..."
                  className="flex-1 bg-white border border-primary/20 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary/50"
                />
                <button
                  onClick={submitInputValue}
                  className="bg-primary text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  שלח
                </button>
              </div>
            )}

            {freeChatMode && (
              <div className="px-3 py-3 flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendFreeText()}
                    placeholder="כתוב הודעה..."
                    disabled={loading}
                    className="flex-1 bg-white border border-primary/20 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary/50"
                  />
                  <button
                    onClick={sendFreeText}
                    disabled={loading}
                    className="bg-primary text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    שלח
                  </button>
                </div>
              </div>
            )}

            {showBackButton && (
              <div className="px-3 pb-3">
                <button
                  onClick={goToMainMenu}
                  className="text-xs text-primary hover:text-primary-dark transition-colors"
                >
                  חזרה לתפריט הראשי
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
