// Chat bot configuration for "שחרור במגע".
// This is the one place to edit when treatments, prices, or answers change.
//
// The conversation has two entry paths that both end up at select-treatment:
//   1. The guided flow (root -> reason -> ...) - matches the business owner's
//      own script: ask name, ask what brought them in, recommend a treatment,
//      offer duration/price, take a phone number, then confirm - book /
//      talk to a person / try a different treatment.
//   2. general-menu - a flat menu (prices, hours, cancellation policy, FAQ,
//      free-form AI chat) reachable via "יש לי שאלה אחרת" or the persistent
//      "חזרה לתפריט הראשי" button.
//
// A `booking` option carries the specific Calendly event slug for that
// treatment + duration; ChatBot.tsx stores it and opens it (via
// buildCalendlyUrl, which adds the current UI language) once name + phone
// are collected.

export interface ChatOption {
  label: string;
  nextId: string;
  booking?: { label: string; slug: string };
}

export type ChatNode =
  | { id: string; type: 'menu' | 'info'; message: string; options: ChatOption[] }
  | { id: string; type: 'input'; message: string; variable: 'name' | 'phone' | 'painArea'; nextId: string };

export const CALENDLY_BASE = 'https://calendly.com/matusov19961';

// Shared Calendly embed color params, matching the site's booking widget.
const CAL_PARAMS = 'background_color=ede3d5&text_color=000000&primary_color=2f6b6b';

function calendlyUrl(slug: string) {
  return `${CALENDLY_BASE}/${slug}?${CAL_PARAMS}`;
}

// Builds a Calendly URL - for a specific event slug, or (when omitted) the
// top-level scheduling page listing all event types - in the requested UI
// language. Calendly's own chrome (buttons, "Select a Date & Time", etc.)
// switches with `locale`; the event name/location text is whatever the
// business owner set up in their Calendly account and can't be translated
// from here.
export function buildCalendlyUrl(slug: string | undefined, lang: 'he' | 'en' = 'he') {
  const url = slug ? calendlyUrl(slug) : `${CALENDLY_BASE}?${CAL_PARAMS}`;
  return lang === 'en' ? `${url}&locale=en` : url;
}

export const chatNodes: ChatNode[] = [
  // ---- Guided flow (business owner's script) ----
  {
    id: 'root',
    type: 'input',
    message: 'היי! איזה כיף שהגעת אלי, אני שחרור במגע 😊\n\nמה השם שלך?',
    variable: 'name',
    nextId: 'reason',
  },
  {
    id: 'reason',
    type: 'menu',
    message: 'נעים להכיר, {name}! מה מביא אותך אלי היום?',
    options: [
      { label: 'מרגיש כאב באיזור מסוים', nextId: 'pain-detail' },
      { label: 'רוצה להוריד לחץ יום יומי', nextId: 'select-treatment' },
      { label: 'פינוק לעצמי או מתנה', nextId: 'select-treatment' },
      { label: 'יש לי שאלה אחרת', nextId: 'general-menu' },
    ],
  },
  {
    id: 'pain-detail',
    type: 'input',
    message: 'מבין. תרצה לפרט לי קצת יותר איפה כואב לך?',
    variable: 'painArea',
    nextId: 'select-treatment',
  },
  {
    id: 'select-treatment',
    type: 'menu',
    message: 'תרצה שנתאים לך טיפול מתאים? הנה האפשרויות שלנו:',
    options: [
      { label: 'עיסוי שוודי', nextId: 'info-swedish' },
      { label: 'עיסוי רפואי', nextId: 'info-medical' },
      { label: 'כוסות רוח', nextId: 'info-cupping' },
      { label: 'אבנים חמות', nextId: 'info-hot-stones' },
      { label: 'עיסוי צוואר ופנים', nextId: 'info-face-neck' },
      { label: 'חזרה לתפריט הראשי', nextId: 'general-menu' },
    ],
  },

  // ---- Treatment explanations -> duration/price -> phone ----
  {
    id: 'info-swedish',
    type: 'info',
    message:
      'עיסוי שוודי משולב - שילוב טכניקות עיסוי שוודי עם עבודה על נקודות שרירים עמוקים, להשגת איזון והרגעה מלאה של הגוף.\n\n' +
      'למי מתאים: מי שמחפש רוגע ושחרור כללי של כל הגוף, ולא בהכרח טיפול ממוקד באזור ספציפי. מתאים גם למגיעים לעיסוי בפעם הראשונה.',
    options: [
      { label: 'קבוע תור לטיפול הזה', nextId: 'duration-swedish' },
      { label: 'טיפול אחר', nextId: 'select-treatment' },
    ],
  },
  {
    id: 'duration-swedish',
    type: 'menu',
    message: 'מה זמן הטיפול שתרצה?',
    options: [
      {
        label: '45 דקות - 250 ₪',
        nextId: 'ask-phone',
        booking: { label: 'עיסוי שוודי, 45 דקות', slug: 'new-meeting' },
      },
      {
        label: '60 דקות - 300 ₪',
        nextId: 'ask-phone',
        booking: { label: 'עיסוי שוודי, 60 דקות', slug: '30min' },
      },
      { label: 'חזרה', nextId: 'select-treatment' },
    ],
  },
  {
    id: 'info-medical',
    type: 'info',
    message:
      'עיסוי רפואי - טיפול ממוקד לבעיות שרירים, כאבים כרוניים, מתח ופציעות, מותאם אישית לצורך שלך.\n\n' +
      'למי מתאים: מי שמחפש עבודה ממוקדת על אזור ספציפי - למשל כאב כרוני, פציעה, או עומס בשרירי הגב והכתפיים - ולא רק הרפיה כללית. מתאים למי שיושב שעות מול מחשב, עובד בעבודה פיזית או מתאמן באופן קבוע.',
    options: [
      { label: 'קבוע תור לטיפול הזה', nextId: 'duration-medical' },
      { label: 'טיפול אחר', nextId: 'select-treatment' },
    ],
  },
  {
    id: 'duration-medical',
    type: 'menu',
    message: 'מה זמן הטיפול שתרצה?',
    options: [
      {
        label: '45 דקות - 250 ₪',
        nextId: 'ask-phone',
        booking: { label: 'עיסוי רפואי, 45 דקות', slug: 'meet-with-me' },
      },
      {
        label: '60 דקות - 300 ₪',
        nextId: 'ask-phone',
        booking: { label: 'עיסוי רפואי, 60 דקות', slug: '60' },
      },
      { label: 'חזרה', nextId: 'select-treatment' },
    ],
  },
  {
    id: 'info-hot-stones',
    type: 'info',
    message:
      'אבנים חמות - עיסוי עם אבני בזלת חמות לשחרור שרירים עמוקים, שיפור זרימת הדם והרגעה מוחלטת. 50 דקות ב-300 ₪.\n\n' +
      'למי מתאים: מי שאוהב תחושת חום ורוצה משהו מעבר לעיסוי שוודי רגיל - החום עוזר לשחרר שרירים עמוקים יותר ומעניק תחושת הרגעה שונה ומיוחדת.',
    options: [
      {
        label: 'קבוע תור לטיפול הזה',
        nextId: 'ask-phone',
        booking: { label: 'אבנים חמות, 50 דקות', slug: 'meet-with-me-1' },
      },
      { label: 'טיפול אחר', nextId: 'select-treatment' },
    ],
  },
  {
    id: 'info-cupping',
    type: 'info',
    message:
      'כוסות רוח - טיפול מסורתי לשחרור חסימות, שיפור זרימת הדם, הקלה על כאבים והפחתת דלקות. 50 דקות ב-300 ₪.\n\n' +
      'למי מתאים: מי שמחפש טכניקה מסורתית ותחושה שונה לגמרי מעיסוי רגיל (יניקה ולא לחיצה), בעיקר לשחרור עומס באזור הגב והכתפיים. שימו לב שהטיפול עלול להשאיר סימנים זמניים על העור.',
    options: [
      {
        label: 'קבוע תור לטיפול הזה',
        nextId: 'ask-phone',
        booking: { label: 'כוסות רוח, 50 דקות', slug: 'meet-with-me-2' },
      },
      { label: 'טיפול אחר', nextId: 'select-treatment' },
    ],
  },
  {
    id: 'info-face-neck',
    type: 'info',
    message:
      'עיסוי צוואר ופנים - עיסוי עדין וממוקד לאזורי הפנים, הצוואר והקרקפת - לשחרור מתח שרירי, הפחתת כאבי ראש ושיפור זרימת הדם לעור. 30 דקות ב-200 ₪.\n\n' +
      'למי מתאים: מי שסובל מכאבי ראש מתח או מתח בצוואר, ומחפש טיפול קצר וממוקד לאזור הפנים והקרקפת - למשל כהפסקה קצרה באמצע יום עמוס, ולא כתחליף לעיסוי לכל הגוף.',
    options: [
      {
        label: 'קבוע תור לטיפול הזה',
        nextId: 'ask-phone',
        booking: { label: 'עיסוי צוואר ופנים, 30 דקות', slug: 'meet-with-me-3' },
      },
      { label: 'טיפול אחר', nextId: 'select-treatment' },
    ],
  },

  {
    id: 'ask-phone',
    type: 'input',
    message: 'מעולה! מה מספר הטלפון שלך?',
    variable: 'phone',
    nextId: 'confirm',
  },
  {
    id: 'confirm',
    type: 'menu',
    message: 'נשמע שזה בדיוק מה שחיפשת?',
    options: [
      { label: 'כן, אני רוצה להזמין', nextId: 'CONFIRM_BOOK' },
      { label: 'אני רוצה לדבר עם ישראל', nextId: 'HANDOFF_WHATSAPP' },
      { label: 'אני רוצה לבדוק טיפול אחר', nextId: 'select-treatment' },
    ],
  },

  // ---- General menu (secondary path) ----
  {
    id: 'general-menu',
    type: 'menu',
    message: 'איך אפשר לעזור?',
    options: [
      { label: 'קביעת תור', nextId: 'select-treatment' },
      { label: 'מחירים', nextId: 'prices' },
      { label: 'שעות פתיחה וזמינות', nextId: 'hours' },
      { label: 'מדיניות ביטולים', nextId: 'cancellation' },
      { label: 'שאלות נפוצות', nextId: 'faq-menu' },
      { label: 'משהו אחר', nextId: 'free-chat' },
    ],
  },
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
    options: [{ label: 'קביעת תור', nextId: 'select-treatment' }],
  },
  {
    id: 'hours',
    type: 'info',
    message:
      'אנחנו זמינים בימים א׳-ה׳ בין השעות 9:00-21:00. בימי שישי ושבת סגור. כשתבחרו טיפול ותלחצו לקביעת תור, תוכלו לראות במערכת ההזמנות את התאריכים והשעות הפנויות המדויקים.',
    options: [{ label: 'קביעת תור', nextId: 'select-treatment' }],
  },
  {
    id: 'cancellation',
    type: 'info',
    message:
      'אפשר לבטל או לשנות תור בחינם עד 12 שעות לפני מועד הטיפול. ביטול בפחות מ-12 שעות מראש מחייב תשלום מלא על הטיפול.',
    options: [{ label: 'קביעת תור', nextId: 'select-treatment' }],
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
export const MAIN_MENU_NODE_ID = 'general-menu';
export const WHATSAPP_NUMBER = '972508838374';

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
   קישורי הזמנה במערכת ההזמנות: 45 דקות → ${calendlyUrl('new-meeting')} | 60 דקות → ${calendlyUrl('30min')}

2. עיסוי רפואי - טיפול ממוקד לבעיות שרירים, כאבים כרוניים, מתח ופציעות, מותאם אישית לצורך.
   משכים ומחירים: 45 דקות - 250 ₪ | 60 דקות - 300 ₪
   קישורי הזמנה במערכת ההזמנות: 45 דקות → ${calendlyUrl('meet-with-me')} | 60 דקות → ${calendlyUrl('60')}

3. אבנים חמות - עיסוי עם אבני בזלת חמות לשחרור שרירים עמוקים, שיפור זרימת הדם והרגעה מוחלטת.
   משך ומחיר: 50 דקות - 300 ₪
   קישור הזמנה במערכת ההזמנות: ${calendlyUrl('meet-with-me-1')}

4. כוסות רוח - טיפול מסורתי לשחרור חסימות, שיפור זרימת הדם, הקלה על כאבים והפחתת דלקות. עלולות להשאיר סימנים זמניים על העור.
   משך ומחיר: 50 דקות - 300 ₪
   קישור הזמנה במערכת ההזמנות: ${calendlyUrl('meet-with-me-2')}

5. עיסוי צוואר ופנים - עיסוי עדין וממוקד לאזורי הפנים, הצוואר והקרקפת - לשחרור מתח שרירי, הפחתת כאבי ראש ושיפור זרימת הדם לעור.
   משך ומחיר: 30 דקות - 200 ₪
   קישור הזמנה במערכת ההזמנות: ${calendlyUrl('meet-with-me-3')}

שעות פתיחה: ימים א׳-ה׳ 9:00-21:00, בימי שישי ושבת סגור. אפשר לבדוק את התאריכים והשעות הפנויים המדויקים במערכת ההזמנות בעת קביעת תור.
מדיניות ביטולים: ביטול או שינוי תור בחינם עד 12 שעות לפני מועד הטיפול. ביטול בפחות מ-12 שעות מראש מחייב תשלום מלא על הטיפול.
הערות נוספות: יש חבילות משתלמות - הפרטים ניתנים ביצירת קשר ישירה עם המטפל. ניתן לבחור את עוצמת המגע ולבקש לשנות אותה במהלך הטיפול. אין חובה להתקלח לפני הטיפול אך זה מומלץ, וכדאי להימנע מארוחה כבדה ממש לפני.
סוג השמן: משתמשים בשמן שקדים או קרם עיסוי, ובמידת הצורך משולבים גם שמנים אתריים.
לבוש במהלך הטיפול: הטיפול אינו נעשה בעירום - המטופל נשאר עם בגדים תחתונים, ומכוסה לאורך כל הטיפול מלבד האיבר שבו מתבצעת העבודה באותו רגע.
`.trim();
