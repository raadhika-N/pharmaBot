import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Auth = () => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        toast.success('Welcome back!');
      } else {
        if (!form.name.trim()) {
          toast.error('Name is required');
          return;
        }
        await register(form.name, form.email, form.password);
        toast.success('Account created!');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-dark-900 flex items-center justify-center px-6"
      style={{ minHeight: '100vh' }}
    >
      <div style={{ width: '100%', maxWidth: '380px' }}>
        {/* Logo */}
        <div className="text-center" style={{ marginBottom: '28px' }}>
          <div
            className="rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mx-auto"
            style={{ width: '48px', height: '48px', marginBottom: '14px' }}
          >
            <Activity className="text-white" style={{ width: '24px', height: '24px' }} />
          </div>
          <h1 className="text-white font-bold" style={{ fontSize: '20px', marginBottom: '4px' }}>
            PharmaBot
          </h1>
          <p className="text-slate-400" style={{ fontSize: '13px' }}>
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Card */}
        <div
          className="bg-dark-800 border border-dark-600 rounded-xl"
          style={{ padding: '28px' }}
        >
          {/* Toggle */}
          <div
            className="flex bg-dark-700 rounded-lg"
            style={{ padding: '4px', marginBottom: '24px' }}
          >
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 font-medium rounded-md transition-all capitalize ${
                  mode === m
                    ? 'bg-brand-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                style={{ padding: '8px', fontSize: '13px' }}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mode === 'register' && (
              <div>
                <label
                  className="block text-slate-300 font-medium"
                  style={{ fontSize: '13px', marginBottom: '6px' }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Dr. Sarah Johnson"
                  className="w-full bg-dark-700 border border-dark-500 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                  style={{ padding: '10px 14px', fontSize: '14px' }}
                  required
                />
              </div>
            )}

            <div>
              <label
                className="block text-slate-300 font-medium"
                style={{ fontSize: '13px', marginBottom: '6px' }}
              >
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="doctor@hospital.com"
                className="w-full bg-dark-700 border border-dark-500 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                style={{ padding: '10px 14px', fontSize: '14px' }}
                required
              />
            </div>

            <div>
              <label
                className="block text-slate-300 font-medium"
                style={{ fontSize: '13px', marginBottom: '6px' }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-dark-700 border border-dark-500 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                  style={{ padding: '10px 40px 10px 14px', fontSize: '14px' }}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-white transition-colors"
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                >
                  {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-500 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ padding: '11px', fontSize: '14px', marginTop: '4px' }}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500" style={{ fontSize: '12px', marginTop: '20px' }}>
          For educational purposes only. Not medical advice.
        </p>
      </div>
    </div>
  );
};

export default Auth;