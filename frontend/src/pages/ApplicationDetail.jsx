import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getById, update, remove } from '../api/applications';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';

const statuses = ['APPLIED', 'PHONE_SCREEN', 'INTERVIEW', 'OFFER', 'REJECTED'];

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const res = await getById(id);
      setApplication(res.data);
      reset(res.data);
    } catch {
      setError('Application not found.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    setError('');
    try {
      const res = await update(id, data);
      setApplication(res.data);
      setEditing(false);
    } catch {
      setError('Failed to update. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await remove(id);
      navigate('/');
    } catch {
      setError('Failed to delete.');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
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
          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            className="text-xs mb-8 flex items-center gap-2 transition-all duration-200"
            style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}
            onMouseEnter={e => e.currentTarget.style.color = '#6EC6E6'}
            onMouseLeave={e => e.currentTarget.style.color = '#555'}
          >
            ← Back to Dashboard
          </button>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border border-current border-t-transparent rounded-full"
                style={{ color: '#6EC6E6', animation: 'spin 0.7s linear infinite' }} />
            </div>
          ) : error && !application ? (
            <div className="text-center py-20">
              <p style={{ color: '#f87171', fontFamily: 'DM Sans, sans-serif' }}>{error}</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(110,198,230,0.08)', border: '1px solid rgba(110,198,230,0.15)' }}>
                    <span className="text-xl font-bold"
                      style={{ color: '#6EC6E6', fontFamily: 'Syne, sans-serif' }}>
                      {application.company.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold"
                      style={{ fontFamily: 'Syne, sans-serif', color: '#fff' }}>
                      {application.company}
                    </h2>
                    <p className="text-sm mt-0.5" style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}>
                      {application.role}
                    </p>
                  </div>
                </div>
                <StatusBadge status={application.status} />
              </div>

              {/* Meta info */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { label: 'Applied', value: formatDate(application.appliedAt) },
                  { label: 'Last Updated', value: formatDate(application.updatedAt) },
                  { label: 'Resume Version', value: application.resumeVersion || '—' },
                  {
                    label: 'Job URL', value: application.jobUrl ? (
                      <a href={application.jobUrl} target="_blank" rel="noreferrer"
                        style={{ color: '#6EC6E6' }}
                        onMouseEnter={e => e.target.style.textShadow = '0 0 10px rgba(110,198,230,0.4)'}
                        onMouseLeave={e => e.target.style.textShadow = 'none'}
                      >
                        View posting ↗
                      </a>
                    ) : '—'
                  },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl px-5 py-4"
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                    <p className="text-xs mb-1"
                      style={{ color: '#444', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.1em' }}>
                      {item.label.toUpperCase()}
                    </p>
                    <p className="text-sm text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {!editing && (
                <div className="rounded-xl px-5 py-4 mb-8"
                  style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                  <p className="text-xs mb-2"
                    style={{ color: '#444', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.1em' }}>
                    NOTES
                  </p>
                  <p className="text-sm" style={{ color: application.notes ? '#aaa' : '#444', fontFamily: 'DM Sans, sans-serif' }}>
                    {application.notes || 'No notes added.'}
                  </p>
                </div>
              )}

              {/* Edit form */}
              {editing && (
                <div className="rounded-2xl p-6 mb-6 relative"
                  style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                  <div className="absolute top-0 left-8 right-8 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(110,198,230,0.4), transparent)' }}
                  />

                  {error && (
                    <div className="mb-4 text-xs px-4 py-3 rounded-lg flex items-center gap-2"
                      style={{ background: 'rgba(248,113,113,0.08)', color: '#f87171', border: '1px solid rgba(248,113,113,0.15)' }}>
                      <span>⚠</span> {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs mb-2"
                          style={{ color: '#444', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em' }}>
                          COMPANY
                        </label>
                        <input {...register('company')} className="px-4 py-3 rounded-lg text-sm outline-none transition-all duration-300"
                          style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                      </div>
                      <div>
                        <label className="block text-xs mb-2"
                          style={{ color: '#444', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em' }}>
                          ROLE
                        </label>
                        <input {...register('role')} className="px-4 py-3 rounded-lg text-sm outline-none transition-all duration-300"
                          style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs mb-2"
                        style={{ color: '#444', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em' }}>
                        STATUS
                      </label>
                      <select {...register('status')} className="px-4 py-3 rounded-lg text-sm outline-none transition-all duration-300"
                        style={{ ...inputStyle, cursor: 'pointer' }} onFocus={handleFocus} onBlur={handleBlur}>
                        {statuses.map(s => (
                          <option key={s} value={s} style={{ background: '#1e1e1e' }}>
                            {s.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs mb-2"
                        style={{ color: '#444', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em' }}>
                        JOB URL
                      </label>
                      <input {...register('jobUrl')} className="px-4 py-3 rounded-lg text-sm outline-none transition-all duration-300"
                        style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                    </div>

                    <div>
                      <label className="block text-xs mb-2"
                        style={{ color: '#444', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em' }}>
                        RESUME VERSION
                      </label>
                      <input {...register('resumeVersion')} className="px-4 py-3 rounded-lg text-sm outline-none transition-all duration-300"
                        style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                    </div>

                    <div>
                      <label className="block text-xs mb-2"
                        style={{ color: '#444', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em' }}>
                        NOTES
                      </label>
                      <textarea {...register('notes')} rows={4}
                        className="px-4 py-3 rounded-lg text-sm outline-none transition-all duration-300 resize-none"
                        style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setEditing(false)}
                        className="px-6 py-3 rounded-lg text-sm transition-all duration-200"
                        style={{ background: 'transparent', border: '1px solid #2a2a2a', color: '#555', fontFamily: 'DM Sans, sans-serif' }}
                        onMouseEnter={e => { e.target.style.borderColor = '#444'; e.target.style.color = '#fff'; }}
                        onMouseLeave={e => { e.target.style.borderColor = '#2a2a2a'; e.target.style.color = '#555'; }}
                      >
                        Cancel
                      </button>
                      <button type="submit" disabled={saving}
                        className="flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-300"
                        style={{
                          background: '#6EC6E6', color: '#0f0f0f',
                          fontFamily: 'DM Sans, sans-serif',
                          boxShadow: saving ? 'none' : '0 0 20px rgba(110,198,230,0.25)',
                          opacity: saving ? 0.7 : 1,
                        }}
                        onMouseEnter={e => { if (!saving) { e.target.style.background = '#7dd4f0'; e.target.style.transform = 'translateY(-1px)'; } }}
                        onMouseLeave={e => { e.target.style.background = '#6EC6E6'; e.target.style.transform = 'translateY(0)'; }}
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Action buttons */}
              {!editing && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditing(true)}
                    className="flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-300"
                    style={{
                      background: '#6EC6E6', color: '#0f0f0f',
                      fontFamily: 'DM Sans, sans-serif',
                      boxShadow: '0 0 20px rgba(110,198,230,0.25)',
                    }}
                    onMouseEnter={e => {
                      e.target.style.background = '#7dd4f0';
                      e.target.style.boxShadow = '0 0 30px rgba(110,198,230,0.45)';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.background = '#6EC6E6';
                      e.target.style.boxShadow = '0 0 20px rgba(110,198,230,0.25)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Edit Application
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-6 py-3 rounded-lg text-sm transition-all duration-200"
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(248,113,113,0.2)',
                      color: '#f87171',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
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