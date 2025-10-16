import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AuthGate from './components/AuthGate';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Watchlist from './pages/Watchlist';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/" element={<AuthGate><Shell/></AuthGate>}>
        <Route index element={<Dashboard/>} />
        <Route path="watchlist" element={<Watchlist/>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function Shell() {
  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-10 backdrop-blur border-b border-neutral-800 bg-neutral-950/60">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-6">
          <a href="/investment/" className="font-semibold">Empire Investment</a>
          <a href="/investment/watchlist" className="text-neutral-300 hover:text-white">Watchlist</a>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto p-4">
        <Outlet />
      </div>
    </div>
  );
}
