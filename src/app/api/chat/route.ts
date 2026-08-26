import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { businessInfo } from '@/data/chatbot-config';

const SYSTEM_PROMPT = `אתה נציג שירות דיגיטלי של "שחרור במגע", עסק עיסויים מקצועיים לגברים בירושלים. ענה ישירות על השאלה שנשאלה, בלי מבוא או ברכה, על סמך המידע העסקי שלהלן. אל תמציא מידע, מחירים, זמנים או פרטים שלא סופקו בו.
אם נשאלת על נושא שאינו קשור בכלל לעסק (למשל מזג אוויר, חדשות, נושאים כלליים), הסבר בקצרה שאתה יכול לעזור רק בנושאים הקשורים לשחרור במגע.
אם המשתמש רוצה לקבוע תור, כוון אותו לבחור את הטיפול הרצוי מהתפריט (אל תשלח קישור קלנדלי בעצמך).
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
