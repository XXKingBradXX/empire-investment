import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type DashboardData = {
  watchlistCount: number;
  alertsCount: number;
  todayDigest: boolean;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setMessage(null);
      try {
        const { data: userResult, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!userResult.user) return;
        setUser(userResult.user);

        const { data: dash, error } = await supabase.rpc('get_dashboard', {
          u: userResult.user.id,
        });
        if (error) throw error;
        setData(dash as DashboardData);
      } catch (err: any) {
        setMessage({ type: 'error', text: err?.message ?? 'Failed to load dashboard.' });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const refreshNow = async () => {
    if (!user) return;
    setMessage(null);
    try {
      const response = await fetch(import.meta.env.VITE_N8N_REFRESH_WEBHOOK_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id,
        },
        body: JSON.stringify({ user_id: user.id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Refresh failed');
      }

      const { data: dash, error } = await supabase.rpc('get_dashboard', { u: user.id });
      if (error) throw error;
      setData(dash as DashboardData);
      setMessage({ type: 'success', text: 'Refresh requested successfully.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message ?? 'Unable to refresh dashboard.' });
    }
  };

  return (
    <main className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Today’s Digest</h1>
        <button
          onClick={refreshNow}
          disabled={!user}
          className="px-3 py-2 rounded bg-white/10 hover:bg-white/15 disabled:opacity-50 border border-neutral-700"
        >
          Refresh
        </button>
      </header>
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
      <section className="card">
        {loading ? (
          'Loading…'
        ) : data ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Metric label="Watchlist" value={data.watchlistCount} />
            <Metric label="Alerts" value={data.alertsCount} />
            <Metric label="Digest Ready" value={data.todayDigest ? 'Yes' : 'No'} />
          </div>
        ) : (
          <div className="text-sm text-neutral-400">No data available.</div>
        )}
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-neutral-400 text-sm">{label}</div>
      <div className="text-xl font-semibold">{String(value)}</div>
    </div>
  );
}
