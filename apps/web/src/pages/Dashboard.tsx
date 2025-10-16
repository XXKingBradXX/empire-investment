import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [data,setData] = useState<any>(null);

  useEffect(() => { (async () => {
    const { data: u } = await supabase.auth.getUser();
    const { data: dash } = await supabase.rpc('get_dashboard', { u: u.user?.id });
    setData(dash);
  })(); }, []);

  async function refreshNow() {
    const { data: u } = await supabase.auth.getUser();
    await fetch(import.meta.env.VITE_N8N_REFRESH_WEBHOOK_URL!, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ user_id: u.user?.id })
    });
    const { data: dash } = await supabase.rpc('get_dashboard', { u: (await supabase.auth.getUser()).data.user?.id });
    setData(dash);
  }

  return (
    <main className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Today’s Digest</h1>
        <button onClick={refreshNow} className="px-3 py-2 rounded bg-white/10 border border-neutral-700">Refresh</button>
      </header>
      <section className="card">
        {!data ? 'Loading…' : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Metric label="Watchlist" value={data.watchlistCount}/>
            <Metric label="Alerts" value={data.alertsCount}/>
            <Metric label="Digest Ready" value={data.todayDigest ? 'Yes' : 'No'}/>
          </div>
        )}
      </section>
    </main>
  );
}
function Metric({label,value}:{label:string,value:any}) {
  return <div><div className="text-neutral-400 text-sm">{label}</div><div className="text-xl font-semibold">{String(value)}</div></div>;
}
