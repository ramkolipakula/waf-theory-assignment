import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserPlus, Landmark, ShieldCheck } from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    neighborhood: 'Downtown Core',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const neighborhoods = [
    'Downtown Core',
    'Greenwood Park',
    'Metro Heights',
    'Lakeside District',
    'Riverside District',
    'Westend Suburbs',
    'Northgate Sector',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        neighborhood: formData.neighborhood,
        phone: formData.phone,
      });

      if (res.success) {
        showToast('Registration successful! Welcome to CivicConnect.', 'success');
        navigate('/dashboard');
      } else {
        setErrorMessage(res.message || 'Registration failed.');
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Failed to create citizen account. Please check your details.'
      );
    } finally {
      setLoading(false);
    }
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
          maxWidth: '520px',
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
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Create Citizen Account</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-subtle)', marginTop: '0.25rem' }}>
            Empower your community with civic issue reporting and tracking
          </p>
        </div>

        {/* Security badge: Citizen only */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            fontWeight: 500,
            marginBottom: '1.25rem',
          }}
        >
          <ShieldCheck size={16} color="#059669" />
          <span>
            Citizen registration portal. Administrative privileges are provisioned through secure municipal channels.
          </span>
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
            <label className="form-label" htmlFor="name">
              Full Name <span className="required">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="e.g. Maya Lin"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address <span className="required">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="e.g. maya@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password <span className="required">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirm Password <span className="required">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-control"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="neighborhood">
                Your Neighborhood <span className="required">*</span>
              </label>
              <select
                id="neighborhood"
                name="neighborhood"
                className="form-control"
                value={formData.neighborhood}
                onChange={handleChange}
                required
              >
                {neighborhoods.map((nh) => (
                  <option key={nh} value={nh}>
                    {nh}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="form-control"
                placeholder="Optional contact"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
          >
            <UserPlus size={18} />
            {loading ? 'Creating Account...' : 'Complete Citizen Registration'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
