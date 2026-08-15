import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, Pizza } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate('/admin/dashboard');
    })();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message || 'Invalid credentials.');
      setLoading(false);
      return;
    }
    navigate('/admin/dashboard');
  };

  return (
    <div className="bg-[#1a1714] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center mx-auto mb-4">
            <Pizza className="w-9 h-9 text-[#1a1714]" />
          </div>
          <h1 className="text-2xl font-bold text-amber-50">Admin Panel</h1>
          <p className="text-amber-50/50 text-sm mt-1">Sign in to manage orders and menu</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#2a2520] rounded-3xl p-6 lg:p-8 border border-amber-900/20 space-y-4">
          <div>
            <label className="block text-amber-50/70 text-sm mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#1a1714] border border-amber-900/20 rounded-xl px-4 py-3 text-amber-50 placeholder-amber-50/30 text-sm focus:outline-none focus:border-amber-500/50"
              placeholder="admin@crunchypizza.pk"
            />
          </div>
          <div>
            <label className="block text-amber-50/70 text-sm mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#1a1714] border border-amber-900/20 rounded-xl px-4 py-3 text-amber-50 placeholder-amber-50/30 text-sm focus:outline-none focus:border-amber-500/50"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#1a1714] py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#1a1714] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={18} /> Sign In
              </>
            )}
          </button>
          <div className="flex items-center gap-2 text-amber-50/30 text-xs pt-2">
            <Lock size={12} />
            <span>Authorized personnel only</span>
          </div>
        </form>
      </div>
    </div>
  );
}
