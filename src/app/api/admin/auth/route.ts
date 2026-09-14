import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'סיסמה שגויה' }, { status: 401 });
  }
  const res = NextResponse.json({ success: true });
  res.cookies.set('admin_session', process.env.ADMIN_SESSION_TOKEN!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete('admin_session');
  return res;
}
