import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { stars, text, name } = await req.json();

    if (!stars || stars < 1 || stars > 5) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
    }

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK;
    if (!webhookUrl) {
      console.error('GOOGLE_SHEETS_WEBHOOK env var not set');
      return NextResponse.json({ error: 'Not configured' }, { status: 500 });
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stars, text: text || '', name: name || '' }),
    });

    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Review error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
