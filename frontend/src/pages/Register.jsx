import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { register as registerUser } from '../api/auth';
import useAuthStore from '../store/authStore';

export default function Register() {
  const { register, handleSubmit } = useForm();
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const res = await registerUser(data);
      setAuth(res.data.token, { name: res.data.name, email: res.data.email });
      navigate('/');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative"
      style={{ background: '#191919' }}>

      {/* Animated background grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(110,198,230,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(110,198,230,0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Animated orbs */}
      <div className="absolute pointer-events-none"
        style={{
          top: '10%', right: '10%',
          width: '350px', height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(110,198,230,0.08) 0%, transparent 70%)',
          animation: 'float 9s ease-in-out infinite',
        }}
      />
      <div className="absolute pointer-events-none"
        style={{
          bottom: '10%', left: '10%',
          width: '400px', height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(110,198,230,0.05) 0%, transparent 70%)',
          animation: 'float 11s ease-in-out infinite reverse',
        }}
      />
      <div className="absolute pointer-events-none"
        style={{
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px', height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(110,198,230,0.03) 0%, transparent 60%)',
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="absolute pointer-events-none rounded-full"
          style={{
            width: '2px', height: '2px',
            background: '#6EC6E6',
            opacity: 0.4,
            left: `${10 + i * 16}%`,
            top: `${15 + (i % 3) * 30}%`,
            animation: `particle ${4 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.6}s`,
          }}
        />
      ))}

      {/* Main card */}
      <div
        className="w-full max-w-sm relative"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block relative mb-4">
            <h1
              className="text-4xl font-bold tracking-widest"
              style={{
                fontFamily: 'Syne, sans-serif',
                color: '#6EC6E6',
                textShadow: '0 0 30px rgba(110,198,230,0.4), 0 0 60px rgba(110,198,230,0.2)',
              }}
            >
              TRACKR
            </h1>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-px w-12"
              style={{ background: 'linear-gradient(90deg, transparent, #6EC6E6, transparent)' }}
            />
          </div>
          <p className="text-xs mt-4 tracking-widest uppercase"
            style={{ color: '#444', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.2em' }}>
            create your account
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl p-8 relative"
          style={{
            background: 'linear-gradient(145deg, #1e1e1e, #191919)',
            border: '1px solid #2a2a2a',
            boxShadow: '0 0 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)',
          }}
        >
          {/* Top blue accent line */}
          <div className="absolute top-0 left-8 right-8 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(110,198,230,0.4), transparent)' }}
          />

          {error && (
            <div
              className="mb-5 text-xs px-4 py-3 rounded-lg flex items-center gap-2"
              style={{
                background: 'rgba(248,113,113,0.08)',
                color: '#f87171',
                border: '1px solid rgba(248,113,113,0.15)',
              }}
            >
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs mb-2"
                style={{ color: '#444', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em' }}>
                NAME
              </label>
              <input
                {...register('name')}
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none transition-all duration-300"
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', fontFamily: 'DM Sans, sans-serif' }}
                onFocus={e => {
                  e.target.style.borderColor = '#6EC6E6';
                  e.target.style.boxShadow = '0 0 15px rgba(110,198,230,0.1)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#2a2a2a';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label className="block text-xs mb-2"
                style={{ color: '#444', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em' }}>
                EMAIL
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none transition-all duration-300"
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', fontFamily: 'DM Sans, sans-serif' }}
                onFocus={e => {
                  e.target.style.borderColor = '#6EC6E6';
                  e.target.style.boxShadow = '0 0 15px rgba(110,198,230,0.1)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#2a2a2a';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label className="block text-xs mb-2"
                style={{ color: '#444', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em' }}>
                PASSWORD
              </label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none transition-all duration-300"
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', fontFamily: 'DM Sans, sans-serif' }}
                onFocus={e => {
                  e.target.style.borderColor = '#6EC6E6';
                  e.target.style.boxShadow = '0 0 15px rgba(110,198,230,0.1)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#2a2a2a';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-semibold transition-all duration-300 mt-2"
              style={{
                background: loading ? '#4a9ab5' : '#6EC6E6',
                color: '#191919',
                fontFamily: 'DM Sans, sans-serif',
                boxShadow: loading ? 'none' : '0 0 20px rgba(110,198,230,0.3)',
                letterSpacing: '0.05em',
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.target.style.background = '#7dd4f0';
                  e.target.style.boxShadow = '0 0 30px rgba(110,198,230,0.5)';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={e => {
                e.target.style.background = '#6EC6E6';
                e.target.style.boxShadow = '0 0 20px rgba(110,198,230,0.3)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full"
                    style={{ animation: 'spin 0.7s linear infinite' }} />
                  Creating account...
                </span>
              ) : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6"
          style={{ color: '#333', fontFamily: 'DM Sans, sans-serif' }}>
          Already have an account?{' '}
          <Link to="/login"
            style={{ color: '#6EC6E6' }}
            onMouseEnter={e => e.target.style.textShadow = '0 0 10px rgba(110,198,230,0.5)'}
            onMouseLeave={e => e.target.style.textShadow = 'none'}
          >
            Sign in
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes particle {
          0%, 100% { transform: translateY(0px); opacity: 0.4; }
          50% { transform: translateY(-30px); opacity: 0.1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: #333;
        }
      `}</style>
    </div>
  );
}