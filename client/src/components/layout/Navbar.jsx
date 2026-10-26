import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  PlusCircle,
  Compass,
  LayoutDashboard,
  FileText,
  Sliders,
  LogOut,
  User,
  Menu,
  X,
  Landmark,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isCitizen, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 900,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Brand Logo */}
        <Link to="/" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)',
            }}
          >
            <Landmark size={22} />
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-primary-deep)', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>
              CivicConnect
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)', fontWeight: 500 }}>
              Community Transparency
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          <NavLink
            to="/"
            style={({ isActive }) => ({
              fontFamily: 'var(--font-heading)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
              textDecoration: 'none',
              padding: '0.5rem 0.25rem',
              borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
            })}
          >
            Home
          </NavLink>

          <NavLink
            to="/explore"
            style={({ isActive }) => ({
              fontFamily: 'var(--font-heading)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
              textDecoration: 'none',
              padding: '0.5rem 0.25rem',
              borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            })}
          >
            <Compass size={16} />
            Explore Issues
          </NavLink>

          {isCitizen && (
            <>
              <NavLink
                to="/dashboard"
                style={({ isActive }) => ({
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  textDecoration: 'none',
                  padding: '0.5rem 0.25rem',
                  borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                })}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </NavLink>

              <NavLink
                to="/my-reports"
                style={({ isActive }) => ({
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  textDecoration: 'none',
                  padding: '0.5rem 0.25rem',
                  borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                })}
              >
                <FileText size={16} />
                My Reports
              </NavLink>
            </>
          )}

          {isAdmin && (
            <>
              <NavLink
                to="/admin"
                end
                style={({ isActive }) => ({
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  textDecoration: 'none',
                  padding: '0.5rem 0.25rem',
                  borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                })}
              >
                <LayoutDashboard size={16} />
                Admin Dashboard
              </NavLink>

              <NavLink
                to="/admin/issues"
                style={({ isActive }) => ({
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  textDecoration: 'none',
                  padding: '0.5rem 0.25rem',
                  borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                })}
              >
                <Sliders size={16} />
                Manage Issues
              </NavLink>
            </>
          )}
        </nav>

        {/* Action / Auth Buttons */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.85rem' }} className="desktop-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/report" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <PlusCircle size={15} />
                Report Issue
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.35rem 0.75rem', backgroundColor: '#f1f5f9', borderRadius: '30px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-text-main)', lineHeight: 1.1 }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 600, color: isAdmin ? '#dc2626' : 'var(--color-primary)', textTransform: 'capitalize' }}>
                    {user?.role === 'admin' ? 'Municipal Admin' : 'Citizen'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-subtle)',
                    marginLeft: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            color: 'var(--color-text-main)',
            display: 'flex',
            alignItems: 'center',
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid var(--color-border)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <Link to="/" onClick={closeMenu} style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--color-text-main)' }}>
            Home
          </Link>
          <Link to="/explore" onClick={closeMenu} style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--color-text-main)' }}>
            Explore Community Issues
          </Link>

          {isCitizen && (
            <>
              <Link to="/dashboard" onClick={closeMenu} style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--color-text-main)' }}>
                Citizen Dashboard
              </Link>
              <Link to="/my-reports" onClick={closeMenu} style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--color-text-main)' }}>
                My Submitted Reports
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/admin" onClick={closeMenu} style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                Municipal Admin Dashboard
              </Link>
              <Link to="/admin/issues" onClick={closeMenu} style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                Issue Management & Triage
              </Link>
            </>
          )}

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {isAuthenticated ? (
              <>
                <Link to="/report" onClick={closeMenu} className="btn btn-primary" style={{ width: '100%' }}>
                  <PlusCircle size={16} /> Report an Issue
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.name} ({user?.role})</span>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link to="/login" onClick={closeMenu} className="btn btn-secondary" style={{ flex: 1 }}>
                  Login
                </Link>
                <Link to="/register" onClick={closeMenu} className="btn btn-primary" style={{ flex: 1 }}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Embedded CSS for responsive navbar queries */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};
