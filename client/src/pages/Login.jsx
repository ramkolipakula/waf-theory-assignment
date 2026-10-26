import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogIn, Landmark, Shield, User, ArrowRight } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setErrorMessage(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for testing/evaluating
  const fillCredentials = (role) => {
    if (role === 'citizen') {
      setEmail('aarav.sharma@example.com');
      setPassword('Citizen@123456');
    } else {
      setEmail('admin@civicconnect.org');
      setPassword('Admin@Civic2025!');
    }
    setErrorMessage('');
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        minHeight: 'calc(100vh - 140px)',
        backgroundColor: '#f8fafc',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '2.25rem',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-primary-subtle)',
              color: 'var(--color-primary-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem auto',
            }}
          >
            <Landmark size={26} />
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Sign in to CivicConnect</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-subtle)', marginTop: '0.25rem' }}>
            Access your civic dashboard and track community reports
          </p>
        </div>

        {errorMessage && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              fontWeight: 500,
            }}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address <span className="required">*</span>
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="e.g. name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
          >
            <LogIn size={18} />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Quick Fill */}
        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--color-text-subtle)',
              letterSpacing: '0.05em',
              marginBottom: '0.65rem',
              textAlign: 'center',
            }}
          >
            Quick-Fill Evaluation Accounts
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={() => fillCredentials('citizen')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <User size={14} color="var(--color-primary)" />
              Demo Citizen
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Shield size={14} color="#dc2626" />
              Demo Admin
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
            Register as Citizen
          </Link>
        </div>
      </div>
    </div>
  );
};
