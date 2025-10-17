import { useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const url = new URL(window.location.href);
        const hasExchangeParams = ['code', 'token_hash', 'type'].some((key) =>
          url.searchParams.get(key)
        );

        if (hasExchangeParams) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
          window.history.replaceState({}, '', '/investment');
          if (error) {
            console.error('Auth exchange failed', error);
          }
        }

        const { data } = await supabase.auth.getSession();
        if (mounted) {
          setSession(data.session);
        }
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!ready) return null;
  if (!session) {
    window.location.replace('/investment/login');
    return null;
  }

  return <>{children}</>;
}
