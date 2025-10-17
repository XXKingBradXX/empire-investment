import { FormEvent, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/investment` },
      });

      if (error) {
        throw error;
      }

      setStatus('success');
      setMessage(`Magic link sent to ${email}. Check your inbox to complete sign in.`);
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message ?? 'Failed to send magic link. Please try again.');
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Sign in to Empire Investment</h1>
        <p className="text-sm text-neutral-400">
          Enter your email to receive a one-time magic link.
        </p>
      </div>
      <form className="space-y-3" onSubmit={signIn}>
        <input
          className="border border-neutral-700 bg-neutral-900 w-full p-2 rounded"
          placeholder="you@email.com"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-4 py-2 rounded bg-white/10 hover:bg-white/15 disabled:opacity-60 border border-neutral-700"
        >
          {status === 'loading' ? 'Sending…' : 'Send magic link'}
        </button>
      </form>
      {message && (
        <div
          className={
            status === 'success'
              ? 'text-sm text-emerald-300'
              : 'text-sm text-red-300'
          }
        >
          {message}
        </div>
      )}
    </main>
  );
}
