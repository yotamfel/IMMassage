'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push('/admin/dashboard');
    } else {
      setError('סיסמה שגויה');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center px-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-[#2F6B6B] mb-6 text-center">ניהול תורים</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="סיסמה"
            className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2F6B6B]/30 text-sm"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2F6B6B] text-white py-3 rounded-xl font-semibold hover:bg-[#1F4A4A] transition-colors disabled:opacity-50"
          >
            {loading ? 'נכנס...' : 'כניסה'}
          </button>
        </form>
      </div>
    </div>
  );
}
