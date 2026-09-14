import { NextRequest, NextResponse } from 'next/server';

// Vercel auto-assigns every deployment a *.vercel.app subdomain (and this
// project has picked up a couple over time - shahrur-bamaga.vercel.app,
// shichrur-bemaga.vercel.app) that serve the exact same content as the real
// domain with no redirect of their own. Google had indexed one of those
// before the custom domain went live and was ranking it above the real
// site. A 308 to the canonical host fixes that at the source, same as the
// apex-to-www redirect Vercel already does for the custom domain itself.
const CANONICAL_HOST = 'www.israel-massge.co.il';

export function proxy(request: NextRequest) {
  const host = request.headers.get('host');
  if (host && host !== CANONICAL_HOST) {
    const url = new URL(request.url);
    url.protocol = 'https';
    url.host = CANONICAL_HOST;
    url.port = '';
    return NextResponse.redirect(url, 308);
  }

  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    const session = request.cookies.get('admin_session')?.value;
    const valid = process.env.ADMIN_SESSION_TOKEN;
    if (!session || session !== valid) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|icon.png|robots.txt|sitemap.xml).*)'],
};
