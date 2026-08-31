import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { businessInfo } from '@/data/chatbot-config';

const SYSTEM_PROMPT = `אתה נציג שירות דיגיטלי של "שחרור במגע", עסק עיסויים מקצועיים לגברים בירושלים. ענה ישירות על השאלה שנשאלה, בלי מבוא או ברכה, על סמך המידע העסקי שלהלן בלבד.

חוק מרכזי: אסור לך בשום מקרה להמציא, לנחש או להסיק תשובה שלא כתובה במפורש במידע העסקי - גם אם היא נשמעת סבירה. זה כולל מחירים, משכי טיפול, שיטות עבודה, מדיניות, או כל פרט אחר.
- אם התשובה לשאלה (או משהו קרוב מספיק אליה) כתובה במידע העסקי - ענה עליה בקצרה ובדיוק, גם אם הניסוח של המשתמש שונה מהניסוח במידע.
- אם השאלה קשורה לעסק אך התשובה המדויקת לא מופיעה במידע שסופק - אל תנחש ואל תמציא. תגיד בקצרה שאין לך את המידע המדויק לזה, והפנה ליצירת קשר ישירה עם ישראל בוואטסאפ/טלפון 050-8838374 כדי לקבל תשובה מדויקת.
- אם נשאלת על נושא שאינו קשור בכלל לעסק (למשל מזג אוויר, חדשות, נושאים כלליים), הסבר בקצרה שאתה יכול לעזור רק בנושאים הקשורים לשחרור במגע.

אם המשתמש רוצה לקבוע תור, כוון אותו לבחור את הטיפול הרצוי מהתפריט, או הפנה אותו ליצירת קשר ישירה עם ישראל בוואטסאפ/טלפון 050-8838374 - אין מערכת הזמנות עצמאית באתר.
ענה בעברית, בקצרה ובידידותיות, כמו הודעת צ'אט טבעית.

מידע עסקי:
${businessInfo}`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY env var not set');
      return NextResponse.json({ error: 'Not configured' }, { status: 500 });
    }

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: 'user' | 'assistant'; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const textBlock = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === 'text'
    );

    return NextResponse.json({ reply: textBlock?.text ?? '' });
  } catch (err) {
    console.error('Chat error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
