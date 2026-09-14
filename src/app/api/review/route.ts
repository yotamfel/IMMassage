import { NextRequest, NextResponse, after } from 'next/server';

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

    // Google Apps Script webhooks routinely take several seconds to respond
    // (cold start on Google's side). The client only needs to know the
    // submission is valid to show the thank-you/Google-review screen, so
    // the actual write to the sheet happens after the response is sent
    // instead of making the visitor wait for it.
    after(async () => {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stars, text: text || '', name: name || '' }),
        });
        if (!response.ok) {
          console.error(`Review webhook returned ${response.status}`);
        }
      } catch (err) {
        console.error('Review webhook failed:', err);
      }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Review error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
