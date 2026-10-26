import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, Shield, PhoneCall, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        paddingTop: '3.5rem',
        paddingBottom: '2.5rem',
        marginTop: 'auto',
        borderTop: '1px solid #1e293b',
      }}
    >
      <div className="container">
        <div className="grid grid-cols-4" style={{ marginBottom: '2.5rem', gap: '2rem' }}>
          {/* Col 1: Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Landmark size={20} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', color: '#ffffff' }}>
                CivicConnect
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Empowering citizens to report neighborhood issues, track municipal progress, and foster community transparency.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>
              <Shield size={14} /> Open Municipal Transparency Initiative
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.9375rem', marginBottom: '1rem', fontWeight: 700 }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
              </li>
              <li>
                <Link to="/explore" style={{ color: '#94a3b8', textDecoration: 'none' }}>Explore Community Issues</Link>
              </li>
              <li>
                <Link to="/report" style={{ color: '#94a3b8', textDecoration: 'none' }}>Report a Civic Issue</Link>
              </li>
              <li>
                <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Citizen & Admin Login</Link>
              </li>
              <li>
                <Link to="/register" style={{ color: '#94a3b8', textDecoration: 'none' }}>Register New Account</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.9375rem', marginBottom: '1rem', fontWeight: 700 }}>
              Civic Categories
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li>Garbage & Solid Waste</li>
              <li>Potholes & Road Damage</li>
              <li>Streetlights & Illumination</li>
              <li>Water Leakage & Mains Supply</li>
              <li>Drainage & Storm Sewers</li>
              <li>Public Infrastructure</li>
            </ul>
          </div>

          {/* Col 4: Emergency Contacts */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.9375rem', marginBottom: '1rem', fontWeight: 700 }}>
              Municipal Support
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.8rem' }}>
              For life-threatening civic emergencies, please dial your local emergency control room.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontSize: '0.875rem', fontWeight: 600 }}>
              <PhoneCall size={16} /> Helpline: 1800-CIVIC-CONNECT
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
              Office Hours: Mon–Sat 8:00 AM – 7:00 PM
            </div>
          </div>
        </div>

        {/* Bottom border & copyright */}
        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.8125rem',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} CivicConnect Platform. All rights reserved. Built for community empowerment.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#cbd5e1' }}>
            Full-Stack Project: ReactJS &bull; Express.js &bull; MongoDB &bull; Node.js
          </div>
        </div>
      </div>
    </footer>
  );
};
