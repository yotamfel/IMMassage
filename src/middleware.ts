import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('admin_session')?.value;
  const valid = process.env.ADMIN_SESSION_TOKEN;
  if (!session || session !== valid) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard']
};
