'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import type { FormState } from './actions';

export function SubmitButton({ children, className = 'b b-primary', pendingText }: { children: React.ReactNode; className?: string; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? pendingText ?? 'Saving…' : children}
    </button>
  );
}

/** Form bound to a server action returning FormState; shows success / error messages. */
export function ActionForm({
  action,
  children,
  className,
  resetOnSuccess,
}: {
  action: (s: FormState, fd: FormData) => Promise<FormState>;
  children: React.ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);
  return (
    <form ref={ref} action={formAction} className={className}>
      {children}
      {state?.error && (
        <div className="msg err" role="alert">
          {state.error}
        </div>
      )}
      {state?.ok && state.message && (
        <div className="msg ok" role="status">
          {state.message}
        </div>
      )}
    </form>
  );
}

/** <select> that submits its parent form on change (status changes). */
export function AutoSubmitSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} onChange={(e) => e.currentTarget.form?.requestSubmit()} />;
}

/** Button that asks for confirmation inline (no browser dialogs). */
export function ConfirmButton({ label, confirmLabel = 'Click again to confirm', className = 'b b-danger b-sm' }: { label: string; confirmLabel?: string; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={ref}
      type="submit"
      className={className}
      onClick={(e) => {
        const b = e.currentTarget;
        if (b.dataset.armed !== '1') {
          e.preventDefault();
          b.dataset.armed = '1';
          b.textContent = confirmLabel;
          setTimeout(() => {
            if (b.isConnected) {
              b.dataset.armed = '';
              b.textContent = label;
            }
          }, 4000);
        }
      }}
    >
      {label}
    </button>
  );
}
