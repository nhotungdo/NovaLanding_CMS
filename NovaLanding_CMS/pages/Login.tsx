
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 relative overflow-hidden font-sans text-white">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse delay-1000"></div>

      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 mb-6 shadow-lg shadow-purple-500/30">
            <Icons.Wand2 size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Welcome Back
          </h2>
          <p className="text-slate-300 mt-2 text-sm">Sign in to continue building your empire.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-white transition-colors">
                <Icons.Mail size={18} />
              </div>
              <input 
                type="email" 
                required
                className="w-full bg-slate-800/50 border border-slate-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-11 p-3.5 transition-all placeholder-slate-500" 
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
             <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Password</label>
             <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-white transition-colors">
                <Icons.Lock size={18} />
              </div>
              <input 
                type="password" 
                required
                className="w-full bg-slate-800/50 border border-slate-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-11 p-3.5 transition-all placeholder-slate-500" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
              <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-offset-0 focus:ring-2 focus:ring-blue-500" />
              Remember me
            </label>
            <a href="#" className="hover:text-blue-400 transition-colors">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-400">
          Don't have an account? <a href="#" className="text-white font-semibold hover:text-blue-400 transition-colors">Create one</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
