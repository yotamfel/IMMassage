// Chat bot configuration for "שחרור במגע".
// This is the one place to edit when treatments, prices, or answers change.
//
// Note: every node in the tree can be reached from a persistent "חזרה לתפריט
// הראשי" button rendered by the UI itself (ChatBot.tsx) - so node options
// below only need to list forward moves and one-step-back moves, not a
// route back to root.

export interface ChatOption {
  label: string;
  nextId: string;
}

export type ChatNode =
  | { id: string; type: 'menu' | 'info'; message: string; options: ChatOption[] }
  | { id: string; type: 'booking'; message: string; calendlyUrl: string; options: ChatOption[] };

export const CALENDLY_BASE = 'https://calendly.com/matusov19961';

// Shared Calendly embed color params, matching the site's booking widget.
const CAL_PARAMS = 'background_color=ede3d5&text_color=000000&primary_color=2f6b6b';

function calendlyUrl(slug: string) {
  return `${CALENDLY_BASE}/${slug}?${CAL_PARAMS}`;
}

export const chatNodes: ChatNode[] = [
  {
    id: 'root',
    type: 'menu',
    message: 'היי! אני העוזר הדיגיטלי של שחרור במגע 😊 איך אפשר לעזור?',
    options: [
      { label: 'קביעת תור', nextId: 'book-select-service' },
      { label: 'שאלה על טיפול ספציפי', nextId: 'info-select-service' },
      { label: 'מחירים', nextId: 'prices' },
      { label: 'שעות פתיחה וזמינות', nextId: 'hours' },
      { label: 'מדיניות ביטולים', nextId: 'cancellation' },
      { label: 'שאלות נפוצות', nextId: 'faq-menu' },
      { label: 'משהו אחר', nextId: 'free-chat' },
    ],
  },

  // ---- Booking branch ----
  {
    id: 'book-select-service',
    type: 'menu',
    message: 'איזה טיפול תרצה לקבוע?',
    options: [
      { label: 'עיסוי שוודי', nextId: 'book-swedish-duration' },
      { label: 'עיסוי רפואי', nextId: 'book-medical-duration' },
      { label: 'אבנים חמות', nextId: 'book-hot-stones' },
      { label: 'כוסות רוח', nextId: 'book-cupping' },
      { label: 'עיסוי צוואר ופנים', nextId: 'book-face-neck' },
    ],
  },
  {
    id: 'book-swedish-duration',
    type: 'menu',
    message: 'כמה זמן תרצה לעיסוי השוודי?',
    options: [
      { label: '45 דקות', nextId: 'book-swedish-45' },
      { label: '60 דקות', nextId: 'book-swedish-60' },
      { label: 'חזרה', nextId: 'book-select-service' },
    ],
  },
  {
    id: 'book-medical-duration',
    type: 'menu',
    message: 'כמה זמן תרצה לעיסוי הרפואי?',
    options: [
      { label: '45 דקות', nextId: 'book-medical-45' },
      { label: '60 דקות', nextId: 'book-medical-60' },
      { label: 'חזרה', nextId: 'book-select-service' },
    ],
  },

  {
    id: 'book-swedish-45',
    type: 'booking',
    message: 'מעולה! עיסוי שוודי, 45 דקות. לוחצים למטה כדי לבחור תאריך ושעה פנויים:',
    calendlyUrl: calendlyUrl('new-meeting'),
    options: [],
  },
  {
    id: 'book-swedish-60',
    type: 'booking',
    message: 'מעולה! עיסוי שוודי, 60 דקות. לוחצים למטה כדי לבחור תאריך ושעה פנויים:',
    calendlyUrl: calendlyUrl('30min'),
    options: [],
  },
  {
    id: 'book-medical-45',
    type: 'booking',
    message: 'מעולה! עיסוי רפואי, 45 דקות. לוחצים למטה כדי לבחור תאריך ושעה פנויים:',
    calendlyUrl: calendlyUrl('meet-with-me'),
    options: [],
  },
  {
    id: 'book-medical-60',
    type: 'booking',
    message: 'מעולה! עיסוי רפואי, 60 דקות. לוחצים למטה כדי לבחור תאריך ושעה פנויים:',
    calendlyUrl: calendlyUrl('60'),
    options: [],
  },
  {
    id: 'book-hot-stones',
    type: 'booking',
    message: 'מעולה! עיסוי אבנים חמות, 50 דקות. לוחצים למטה כדי לבחור תאריך ושעה פנויים:',
    calendlyUrl: calendlyUrl('meet-with-me-1'),
    options: [],
  },
  {
    id: 'book-cupping',
    type: 'booking',
    message: 'מעולה! כוסות רוח, 50 דקות. לוחצים למטה כדי לבחור תאריך ושעה פנויים:',
    calendlyUrl: calendlyUrl('meet-with-me-2'),
    options: [],
  },
  {
    id: 'book-face-neck',
    type: 'booking',
    message: 'מעולה! עיסוי צוואר ופנים, 30 דקות. לוחצים למטה כדי לבחור תאריך ושעה פנויים:',
    calendlyUrl: calendlyUrl('meet-with-me-3'),
    options: [],
  },

  // ---- Info about a specific treatment branch ----
  {
    id: 'info-select-service',
    type: 'menu',
    message: 'על איזה טיפול תרצה לשמוע?',
    options: [
      { label: 'עיסוי שוודי', nextId: 'info-swedish' },
      { label: 'עיסוי רפואי', nextId: 'info-medical' },
      { label: 'אבנים חמות', nextId: 'info-hot-stones' },
      { label: 'כוסות רוח', nextId: 'info-cupping' },
      { label: 'עיסוי צוואר ופנים', nextId: 'info-face-neck' },
    ],
  },
  {
    id: 'info-swedish',
    type: 'info',
    message:
      'עיסוי שוודי משולב - שילוב טכניקות עיסוי שוודי עם עבודה על נקודות שרירים עמוקים, להשגת איזון והרגעה מלאה של הגוף. יש באורך 45 או 60 דקות.',
    options: [{ label: 'קבוע תור לטיפול הזה', nextId: 'book-swedish-duration' }],
  },
  {
    id: 'info-medical',
    type: 'info',
    message:
      'עיסוי רפואי - טיפול ממוקד לבעיות שרירים, כאבים כרוניים, מתח ופציעות, מותאם אישית לצורך שלך. יש באורך 45 או 60 דקות.',
    options: [{ label: 'קבוע תור לטיפול הזה', nextId: 'book-medical-duration' }],
  },
  {
    id: 'info-hot-stones',
    type: 'info',
    message:
      'אבנים חמות - עיסוי עם אבני בזלת חמות לשחרור שרירים עמוקים, שיפור זרימת הדם והרגעה מוחלטת. 50 דקות.',
    options: [{ label: 'קבוע תור לטיפול הזה', nextId: 'book-hot-stones' }],
  },
  {
    id: 'info-cupping',
    type: 'info',
    message:
      'כוסות רוח - טיפול מסורתי לשחרור חסימות, שיפור זרימת הדם, הקלה על כאבים והפחתת דלקות. 50 דקות.',
    options: [{ label: 'קבוע תור לטיפול הזה', nextId: 'book-cupping' }],
  },
  {
    id: 'info-face-neck',
    type: 'info',
    message:
      'עיסוי צוואר ופנים - עיסוי עדין וממוקד לאזורי הפנים, הצוואר והקרקפת - לשחרור מתח שרירי, הפחתת כאבי ראש ושיפור זרימת הדם לעור. 30 דקות.',
    options: [{ label: 'קבוע תור לטיפול הזה', nextId: 'book-face-neck' }],
  },

  // ---- Prices / hours / cancellation ----
  {
    id: 'prices',
    type: 'info',
    message:
      'המחירון שלנו:\n\n' +
      'עיסוי שוודי - 45 דק׳ ב-250 ₪ / 60 דק׳ ב-300 ₪\n' +
      'עיסוי רפואי - 45 דק׳ ב-250 ₪ / 60 דק׳ ב-300 ₪\n' +
      'כוסות רוח - 50 דק׳ ב-300 ₪\n' +
      'אבנים חמות - 50 דק׳ ב-300 ₪\n' +
      'עיסוי פנים וצוואר - 30 דק׳ ב-200 ₪\n\n' +
      'הטיפול לגברים בלבד. יש גם חבילות משתלמות - אפשר לשאול עליהן ביצירת קשר.',
    options: [{ label: 'קביעת תור', nextId: 'book-select-service' }],
  },
  {
    id: 'hours',
    type: 'info',
    message:
      'אין שעות קבועות מראש - הזמינות מוצגת בזמן אמת בלוח השנה של קלנדלי. כשתבחרו טיפול ותלחצו לקביעת תור, תוכלו לראות ישר את כל התאריכים והשעות הפנויות.',
    options: [{ label: 'קביעת תור', nextId: 'book-select-service' }],
  },
  {
    id: 'cancellation',
    type: 'info',
    message:
      'אפשר לבטל או לשנות תור בחינם עד 12 שעות לפני מועד הטיפול. ביטול בפחות מ-12 שעות מראש מחייב תשלום מלא על הטיפול.',
    options: [{ label: 'קביעת תור', nextId: 'book-select-service' }],
  },

  // ---- FAQ branch ----
  {
    id: 'faq-menu',
    type: 'menu',
    message: 'איזו שאלה מעניינת אותך?',
    options: [
      { label: 'האם צריך להתקלח לפני הטיפול?', nextId: 'faq-shower' },
      { label: 'האם אפשר לבחור עוצמת מגע?', nextId: 'faq-intensity' },
      { label: 'האם הטיפולים לגברים בלבד?', nextId: 'faq-gender' },
      { label: 'האם אפשר טיפול עד הבית?', nextId: 'faq-home' },
    ],
  },
  {
    id: 'faq-shower',
    type: 'info',
    message:
      'אין חובה מיוחדת להתקלח לפני הטיפול, אך מקלחת יכולה לעזור להגיע רעננים ולהרגיש נוח יותר. מומלץ גם להימנע מארוחה כבדה ממש לפני הטיפול.',
    options: [{ label: 'שאלה נוספת', nextId: 'faq-menu' }],
  },
  {
    id: 'faq-intensity',
    type: 'info',
    message:
      'בהחלט - חשוב לומר למטפל איזו עוצמה נוחה לך, ואפשר גם לבקש לשנות את העוצמה במהלך הטיפול עצמו.',
    options: [{ label: 'שאלה נוספת', nextId: 'faq-menu' }],
  },
  {
    id: 'faq-gender',
    type: 'info',
    message: 'כן, הטיפולים בשחרור במגע מיועדים לגברים בלבד.',
    options: [{ label: 'שאלה נוספת', nextId: 'faq-menu' }],
  },
  {
    id: 'faq-home',
    type: 'info',
    message:
      'כן, ניתן להזמין גם טיפול עד הבית בירושלים - בהתאם לאזור השירות והזמינות. מומלץ ליצור קשר מראש כדי לוודא שהכתובת שלכם נמצאת באזור השירות.',
    options: [{ label: 'שאלה נוספת', nextId: 'faq-menu' }],
  },
];

export function getChatNode(id: string): ChatNode | undefined {
  return chatNodes.find(n => n.id === id);
}

export const ROOT_NODE_ID = 'root';

// ---------------------------------------------------------------------------
// Business info fed to the AI for free-form chat (system prompt injection).
// This is the single source of truth the AI is allowed to draw on.
// ---------------------------------------------------------------------------
export const businessInfo = `
עסק: שחרור במגע - עיסוי מקצועי לגברים בירושלים.
מטפל: ישראל מתוסוב, מטפל מוסמך בעיסוי שוודי ואינטגרטיבי, בוגר מכללת רידמן.
טלפון / וואטסאפ: 050-8838374
מיקומים: בן בבא 1, ירושלים | חיים ברודי 15, ירושלים | ניתן להזמין גם טיפול עד הבית (בהתאם לאזור השירות)

הטיפולים המוצעים (כולם מיועדים לגברים בלבד):

1. עיסוי שוודי משולב - שילוב טכניקות עיסוי שוודי עם עבודה על נקודות שרירים עמוקים, להשגת איזון והרגעה מלאה של הגוף.
   משכים ומחירים: 45 דקות - 250 ₪ | 60 דקות - 300 ₪
   קישורי הזמנה בקלנדלי: 45 דקות → ${calendlyUrl('new-meeting')} | 60 דקות → ${calendlyUrl('30min')}

2. עיסוי רפואי - טיפול ממוקד לבעיות שרירים, כאבים כרוניים, מתח ופציעות, מותאם אישית לצורך.
   משכים ומחירים: 45 דקות - 250 ₪ | 60 דקות - 300 ₪
   קישורי הזמנה בקלנדלי: 45 דקות → ${calendlyUrl('meet-with-me')} | 60 דקות → ${calendlyUrl('60')}

3. אבנים חמות - עיסוי עם אבני בזלת חמות לשחרור שרירים עמוקים, שיפור זרימת הדם והרגעה מוחלטת.
   משך ומחיר: 50 דקות - 300 ₪
   קישור הזמנה בקלנדלי: ${calendlyUrl('meet-with-me-1')}

4. כוסות רוח - טיפול מסורתי לשחרור חסימות, שיפור זרימת הדם, הקלה על כאבים והפחתת דלקות. עלולות להשאיר סימנים זמניים על העור.
   משך ומחיר: 50 דקות - 300 ₪
   קישור הזמנה בקלנדלי: ${calendlyUrl('meet-with-me-2')}

5. עיסוי צוואר ופנים - עיסוי עדין וממוקד לאזורי הפנים, הצוואר והקרקפת - לשחרור מתח שרירי, הפחתת כאבי ראש ושיפור זרימת הדם לעור.
   משך ומחיר: 30 דקות - 200 ₪
   קישור הזמנה בקלנדלי: ${calendlyUrl('meet-with-me-3')}

שעות פתיחה: אין שעות קבועות - הזמינות מוצגת בזמן אמת בלוח השנה של קלנדלי.
מדיניות ביטולים: ביטול או שינוי תור בחינם עד 12 שעות לפני מועד הטיפול. ביטול בפחות מ-12 שעות מראש מחייב תשלום מלא על הטיפול.
הערות נוספות: יש חבילות משתלמות - הפרטים ניתנים ביצירת קשר ישירה עם המטפל. ניתן לבחור את עוצמת המגע ולבקש לשנות אותה במהלך הטיפול. אין חובה להתקלח לפני הטיפול אך זה מומלץ, וכדאי להימנע מארוחה כבדה ממש לפני.
`.trim();
