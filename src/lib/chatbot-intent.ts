// Detects when free-typed text should route back into the decision tree
// instead of going to the AI (e.g. the user typed "אני רוצה לקבוע תור"
// while chatting freely).

const BOOKING_KEYWORDS = [
  'לקבוע',
  'קביעת תור',
  'קביעה',
  'תור',
  'פנוי',
  'פנויה',
  'זמין',
  'זמינות',
  'להזמין',
  'הזמנה',
  'לתאם',
];

export function detectsBookingIntent(text: string): boolean {
  const normalized = text.trim();
  if (!normalized) return false;
  return BOOKING_KEYWORDS.some(keyword => normalized.includes(keyword));
}

// Node the user should land on when booking intent is detected mid-chat.
export const BOOKING_INTENT_NODE_ID = 'book-select-service';
