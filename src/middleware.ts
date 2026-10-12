import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

/**
 * URL scheme: Armenian at the root (/, /services…), Russian at /ru/…, English at /en/….
 * Internally every public page lives under app/[lang]/, so root paths are rewritten to /hy/….
 * No redirects by IP or Accept-Language (per the handoff).
 */
const SESSION_COOKIE = 'bp_admin';

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // ---- Admin protection ----
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next();
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const secret = process.env.AUTH_SECRET;
    if (token && secret) {
      try {
        await jwtVerify(token, new TextEncoder().encode(secret));
        return NextResponse.next();
      } catch {
        /* fall through */
      }
    }
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = pathname !== '/admin' ? `?next=${encodeURIComponent(pathname + search)}` : '';
    return NextResponse.redirect(url);
  }

  // ---- Public i18n routing ----
  const first = pathname.split('/')[1];

  // /hy/... is not a public URL: canonical Armenian URLs have no prefix.
  if (first === 'hy') {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/^\/hy(?=\/|$)/, '') || '/';
    return NextResponse.redirect(url, 308);
  }

  const headers = new Headers(req.headers);
  if (first === 'ru' || first === 'en') {
    headers.set('x-bp-lang', first);
    return NextResponse.next({ request: { headers } });
  }

  headers.set('x-bp-lang', 'hy');
  const url = req.nextUrl.clone();
  url.pathname = `/hy${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  // Skip Next internals, API routes and files with an extension (logo, icons, robots, sitemap).
  matcher: ['/((?!_next/|api/|.*\\.[a-zA-Z0-9]+$).*)'],
};
