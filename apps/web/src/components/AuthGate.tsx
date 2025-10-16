import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthGate({ children }:{children:React.ReactNode}) {
  const [ready,setReady] = useState(false);
  const [session,setSession] = useState<any>(null);
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{ setSession(data.session); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e,s)=>setSession(s));
    return () => sub.subscription.unsubscribe();
  },[]);
  if (!ready) return null;
  if (!session) { window.location.href = '/investment/login'; return null; }
  return <>{children}</>;
}
