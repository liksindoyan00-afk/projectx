import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { login } from '../actions';
import { ActionForm, SubmitButton } from '../ui';

export default async function Login({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getSession()) redirect('/admin');
  const { next = '' } = await searchParams;
  return (
    <main className="login">
      <ActionForm action={login}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/bridgepath-logo.svg" alt="BridgePath" style={{ height: 56, width: 'auto', alignSelf: 'flex-start' }} />
        <h1>Admin sign in</h1>
        <input type="hidden" name="next" value={next} />
        <label className="f">
          <span>Email</span>
          <input className="in" type="email" name="email" autoComplete="username" required autoFocus />
        </label>
        <label className="f">
          <span>Password</span>
          <input className="in" type="password" name="password" autoComplete="current-password" required />
        </label>
        <SubmitButton pendingText="Signing in…">Sign in</SubmitButton>
      </ActionForm>
    </main>
  );
}
