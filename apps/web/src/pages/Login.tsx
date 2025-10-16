import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  async function signIn(){
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + '/investment' }
    });
    alert('Magic link sent to ' + email);
  }
  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Sign in to Empire Investment</h1>
      <input className="border border-neutral-700 bg-neutral-900 w-full p-2 mb-3 rounded"
             placeholder="you@email.com"
             value={email} onChange={e=>setEmail(e.target.value)} />
      <button className="px-4 py-2 rounded bg-white/10 hover:bg-white/15 border border-neutral-700"
              onClick={signIn}>Send magic link</button>
    </main>
  );
}
