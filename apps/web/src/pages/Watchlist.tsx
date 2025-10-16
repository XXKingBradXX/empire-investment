import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Watchlist() {
  const [items,setItems] = useState<any[]>([]);
  const [symbol,setSymbol] = useState('');

  async function load() {
    const { data } = await supabase.from('user_watchlist').select('id,symbol,created_at').order('created_at',{ascending:false});
    setItems(data || []);
  }
  useEffect(()=>{ load(); },[]);

  async function add() {
    const s = symbol.trim().toUpperCase(); if (!s) return;
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from('user_watchlist').insert({ user_id: u.user?.id, symbol: s });
    if (!error) { setSymbol(''); load(); }
  }
  async function remove(id: string) {
    await supabase.from('user_watchlist').delete().eq('id', id);
    load();
  }

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Your Watchlist</h1>
      <div className="card flex gap-2">
        <input className="border border-neutral-700 bg-neutral-900 p-2 rounded grow"
               placeholder="e.g., MSFT"
               value={symbol} onChange={e=>setSymbol(e.target.value)} />
        <button className="px-3 py-2 rounded bg-white/10 border border-neutral-700" onClick={add}>Add</button>
      </div>
      <div className="card">
        {!items.length ? <div>No symbols yet.</div> : (
          <ul className="divide-y divide-neutral-800">
            {items.map(i=>(
              <li key={i.id} className="py-2 flex items-center justify-between">
                <span className="font-mono">{i.symbol}</span>
                <button className="text-red-300" onClick={()=>remove(i.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
