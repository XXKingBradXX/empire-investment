import { FormEvent, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type WatchlistItem = {
  id: string;
  symbol: string;
  created_at: string;
};

export default function Watchlist() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    const loadUserAndItems = async () => {
      setLoading(true);
      setMessage(null);
      try {
        const { data: userResult, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (!userResult.user) return;
        setUser(userResult.user);
        await loadItems(userResult.user.id);
      } catch (err: any) {
        setMessage({ type: 'error', text: err?.message ?? 'Unable to load watchlist.' });
      } finally {
        setLoading(false);
      }
    };

    loadUserAndItems();
  }, []);

  const loadItems = async (userId: string) => {
    const { data, error } = await supabase
      .from<WatchlistItem>('empire.user_watchlist')
      .select('id, symbol, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    setItems(data ?? []);
  };

  const add = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    const trimmed = symbol.trim();
    if (!trimmed) return;
    const s = trimmed.toUpperCase();
    setMessage(null);
    try {
      const { error } = await supabase.from('empire.user_watchlist').insert({
        user_id: user.id,
        symbol: s,
        notes: null,
      });
      if (error) throw error;
      setSymbol('');
      await loadItems(user.id);
      setMessage({ type: 'success', text: `${s} added to your watchlist.` });
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message ?? 'Unable to add symbol.' });
    }
  };

  const remove = async (id: string) => {
    if (!user) return;
    setMessage(null);
    try {
      const { error } = await supabase
        .from('empire.user_watchlist')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      await loadItems(user.id);
      setMessage({ type: 'success', text: 'Symbol removed.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message ?? 'Unable to remove symbol.' });
    }
  };

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Your Watchlist</h1>
      <form className="card flex flex-col gap-3 sm:flex-row" onSubmit={add}>
        <input
          className="border border-neutral-700 bg-neutral-900 p-2 rounded grow"
          placeholder="e.g., MSFT"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <button
          type="submit"
          disabled={!user}
          className="px-3 py-2 rounded bg-white/10 hover:bg-white/15 disabled:opacity-50 border border-neutral-700"
        >
          Add
        </button>
      </form>
      {message && (
        <div
          className={
            message.type === 'success'
              ? 'text-sm text-emerald-300'
              : 'text-sm text-red-300'
          }
        >
          {message.text}
        </div>
      )}
      <div className="card">
        {loading ? (
          <div>Loading…</div>
        ) : !items.length ? (
          <div>No symbols yet.</div>
        ) : (
          <ul className="divide-y divide-neutral-800">
            {items.map((i) => (
              <li key={i.id} className="py-2 flex items-center justify-between">
                <span className="font-mono tracking-wide">{i.symbol}</span>
                <button
                  className="text-red-300 hover:text-red-200"
                  onClick={() => remove(i.id)}
                  type="button"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
