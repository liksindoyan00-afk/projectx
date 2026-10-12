import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify, SignJWT } from 'jose';

export const SESSION_COOKIE = 'bp_admin';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type Session = { uid: string; email: string; name: string };

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error('AUTH_SECRET must be set (at least 32 characters).');
  return new TextEncoder().encode(s);
}

export async function createSession(s: Session) {
  const token = await new SignJWT({ email: s.email, name: s.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(s.uid)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return { uid: String(payload.sub), email: String(payload.email), name: String(payload.name ?? '') };
  } catch {
    return null;
  }
}

/** Use at the top of every admin page and server action. */
export async function requireAdmin(): Promise<Session> {
  const s = await getSession();
  if (!s) redirect('/admin/login');
  return s;
}
