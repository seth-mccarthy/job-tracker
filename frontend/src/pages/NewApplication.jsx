import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { create } from '../api/applications';
import Navbar from '../components/Navbar';

const statuses = ['APPLIED', 'PHONE_SCREEN', 'INTERVIEW', 'OFFER', 'REJECTED'];

export default function NewApplication() {
  const { register, handleSubmit } = useForm();
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
      await create(data);
      navigate('/');
    } catch {
      setError('Failed to create application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: '#1e1e1e',
    border: '1px solid #2a2a2a',
    fontFamily: 'DM Sans, sans-serif',
    color: '#fff',
    width: '100%',
  };

  const handleFocus = e => {
    e.target.style.borderColor = '#6EC6E6';
    e.target.style.boxShadow = '0 0 15px rgba(110,198,230,0.08)';
  };

  const handleBlur = e => {
    e.target.style.borderColor = '#2a2a2a';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="min-h-screen" style={{ background: '#0f0f0f' }}>
      <Navbar />

      <div className="ml-56 min-h-screen">
        <div
          className="max-w-2xl mx-auto px-8 py-10"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          {/* Header */}
          <div className="mb-10">
            <button
              onClick={() => navigate('/')}
              className="text-xs mb-6 flex items-center gap-2 transition-all duration-200"
              style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}
              onMouseEnter={e => e.currentTarget.style.color = '#6EC6E6'}
              onMouseLeave={e => e.currentTarget.style.color = '#555'}
            >
              ← Back to Dashboard
            </button>
            <p className="text-xs tracking-widest uppercase mb-1"
              style={{ color: '#444', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.2em' }}>
              new application
            </p>
            <h2 className="text-3xl font-bold"
              style={{ fontFamily: 'Syne, sans-serif', color: '#fff' }}>
              Track a Job
            </h2>
          </div>

          {/* Form card */}
          <div
            className="rounded-2xl p-8 relative"
            style={{
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              boxShadow: '0 0 40px rgba(0,0,0,0.3)',
            }}
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-8 right-8 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(110,198,230,0.4), transparent)' }}
            />

            {error && (
              <div className="mb-6 text-xs px-4 py-3 rounded-lg flex items-center gap-2"
                style={{
                  background: 'rgba(248,113,113,0.08)',
                  color: '#f87171',
                  border: '1px solid rgba(248,113,113,0.15)',
                }}>
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* Company + Role */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-2"
                    style={{ color: '#444', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em' }}>
                    COMPANY *
                  </label>
                  <input
                    {...register('company', { required: true })}
                    type="text"
                    placeholder="e.g. Google"
                    className="px-4 py-3 rounded-lg text-sm outline-none transition-all duration-300"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-2"
                    style={{ color: '#444', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em' }}>
                    ROLE *
                  </label>
                  <input
                    {...register('role', { required: true })}
                    type="text"
                    placeholder="e.g. Software Engineer"
                    className="px-4 py-3 rounded-lg text-sm outline-none transition-all duration-300"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs mb-2"
                  style={{ color: '#444', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em' }}>
                  STATUS
                </label>
                <select
                  {...register('status')}
                  className="px-4 py-3 rounded-lg text-sm outline-none transition-all duration-300"
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  {statuses.map(s => (
                    <option key={s} value={s} style={{ background: '#1e1e1e' }}>
                      {s.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job URL */}
              <div>
                <label className="block text-xs mb-2"
                  style={{ color: '#444', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em' }}>
                  JOB URL
                </label>
                <input
                  {...register('jobUrl')}
                  type="url"
                  placeholder="https://careers.company.com/job"
                  className="px-4 py-3 rounded-lg text-sm outline-none transition-all duration-300"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Resume Version */}
              <div>
                <label className="block text-xs mb-2"
                  style={{ color: '#444', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em' }}>
                  RESUME VERSION
                </label>
                <input
                  {...register('resumeVersion')}
                  type="text"
                  placeholder="e.g. v1, v2-software, general"
                  className="px-4 py-3 rounded-lg text-sm outline-none transition-all duration-300"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs mb-2"
                  style={{ color: '#444', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em' }}>
                  NOTES
                </label>
                <textarea
                  {...register('notes')}
                  rows={4}
                  placeholder="Any notes about this application..."
                  className="px-4 py-3 rounded-lg text-sm outline-none transition-all duration-300 resize-none"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-3 rounded-lg text-sm transition-all duration-200"
                  style={{
                    background: 'transparent',
                    border: '1px solid #2a2a2a',
                    color: '#555',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                  onMouseEnter={e => {
                    e.target.style.borderColor = '#444';
                    e.target.style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    e.target.style.borderColor = '#2a2a2a';
                    e.target.style.color = '#555';
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-300"
                  style={{
                    background: '#6EC6E6',
                    color: '#0f0f0f',
                    fontFamily: 'DM Sans, sans-serif',
                    boxShadow: loading ? 'none' : '0 0 20px rgba(110,198,230,0.25)',
                    opacity: loading ? 0.7 : 1,
                  }}
                  onMouseEnter={e => {
                    if (!loading) {
                      e.target.style.background = '#7dd4f0';
                      e.target.style.boxShadow = '0 0 30px rgba(110,198,230,0.45)';
                      e.target.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = '#6EC6E6';
                    e.target.style.boxShadow = '0 0 20px rgba(110,198,230,0.25)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full"
                        style={{ animation: 'spin 0.7s linear infinite' }} />
                      Saving...
                    </span>
                  ) : 'Save Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: #444; }
        select option { background: #1e1e1e; color: #fff; }
      `}</style>
    </div>
  );
}