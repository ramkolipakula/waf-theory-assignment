import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div
      className="container"
      style={{
        padding: '5rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: '#f1f5f9',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <Compass size={36} />
      </div>

      <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: 1 }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.5rem 0 1rem 0' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '420px', lineHeight: 1.6, marginBottom: '2rem' }}>
        The civic page or report you are looking for does not exist or may have been moved to an updated URL.
      </p>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Home size={16} /> Return to Homepage
        </Link>
        <Link to="/explore" className="btn btn-secondary">
          Explore Issues
        </Link>
      </div>
    </div>
  );
};
