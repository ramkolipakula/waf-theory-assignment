import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { SeverityBadge } from '../components/common/SeverityBadge';
import {
  PlusCircle,
  Clock,
  Wrench,
  CheckCircle2,
  FileText,
  ThumbsUp,
  MapPin,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardAPI.getCitizenStats();
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load citizen dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = data?.stats || {
    totalSubmitted: 0,
    underReview: 0,
    inProgress: 0,
    resolved: 0,
  };

  const recentReports = data?.recentReports || [];
  const supportedIssues = data?.supportedIssues || [];

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* 1. Welcome Banner */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem 2.5rem',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <MapPin size={15} /> Citizen Community Portal
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--color-text-main)', marginTop: '0.25rem' }}>
            Welcome back, {user?.name || 'Citizen'}!
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Registered Ward: <strong>{user?.neighborhood || 'Downtown Core'}</strong> &bull; Tracking your community maintenance reports
          </p>
        </div>

        <Link to="/report" className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PlusCircle size={18} />
          Report New Issue
        </Link>
      </div>

      {/* 2. Metric Cards */}
      <div className="grid grid-cols-4" style={{ gap: '1.25rem' }}>
        {/* Total Submitted */}
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #0f172a' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Reports Filed</span>
            <FileText size={20} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem', color: '#0f172a' }}>
            {stats.totalSubmitted}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Submitted by you</span>
        </div>

        {/* Under Review */}
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #64748b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Under Review</span>
            <Clock size={20} color="#64748b" />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem', color: '#475569' }}>
            {stats.underReview}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Awaiting initial triage</span>
        </div>

        {/* In Progress */}
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #d97706' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#d97706' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Action In Progress</span>
            <Wrench size={20} color="#d97706" />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem', color: '#d97706' }}>
            {stats.inProgress}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#b45309' }}>Assigned to field crews</span>
        </div>

        {/* Resolved */}
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #16a34a' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#16a34a' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Successfully Resolved</span>
            <CheckCircle2 size={20} color="#16a34a" />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem', color: '#16a34a' }}>
            {stats.resolved}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#15803d' }}>Work completed & verified</span>
        </div>
      </div>

      {/* 3. Main Dashboard Body: Left Column Recent Reports, Right Column Community Support */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '2rem' }}>
        {/* Left: My Recent Reports */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>My Recent Reports</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
                Track latest progress and updates on reports you've submitted
              </p>
            </div>
            <Link to="/my-reports" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              All My Reports <ChevronRight size={14} />
            </Link>
          </div>

          {loading ? (
            <p style={{ color: 'var(--color-text-subtle)', fontSize: '0.875rem' }}>Loading reports...</p>
          ) : recentReports.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                backgroundColor: '#f8fafc',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--color-border)',
              }}
            >
              <AlertCircle size={32} color="#94a3b8" style={{ margin: '0 auto 0.75rem auto' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                No Reports Submitted Yet
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', maxWidth: '340px', margin: '0.35rem auto 1.25rem auto' }}>
                Noticed a streetlight out, damaged road, or garbage pile? Report it to notify municipal authorities.
              </p>
              <Link to="/report" className="btn btn-primary btn-sm">
                <PlusCircle size={15} /> Submit Your First Report
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentReports.map((issue) => (
                <div
                  key={issue._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: '#ffffff',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxWidth: '75%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', fontWeight: 700, color: '#64748b' }}>
                        {issue.referenceId}
                      </span>
                      <StatusBadge status={issue.status} />
                    </div>
                    <Link
                      to={`/issues/${issue._id}`}
                      style={{
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: 'var(--color-text-main)',
                        textDecoration: 'none',
                      }}
                    >
                      {issue.title}
                    </Link>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-subtle)' }}>
                      📍 {issue.neighborhood} &bull; Dept: {issue.assignedDepartment?.name || 'Pending assignment'}
                    </span>
                  </div>

                  <Link
                    to={`/issues/${issue._id}`}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.4rem 0.65rem' }}
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Issues Supported by Me */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <ThumbsUp size={18} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Issues You Support</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
            Community issues you have endorsed for expedited municipal resolution:
          </p>

          {supportedIssues.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '2.5rem 1rem',
                backgroundColor: '#f8fafc',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--color-border)',
                marginTop: 'auto',
                marginBottom: 'auto',
              }}
            >
              <ThumbsUp size={28} color="#94a3b8" style={{ margin: '0 auto 0.5rem auto' }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                You haven't supported any community reports yet.
              </p>
              <Link to="/explore" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '0.5rem', display: 'inline-block' }}>
                Browse Community Issues &rarr;
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {supportedIssues.map((item) => (
                <Link
                  key={item._id}
                  to={`/issues/${item._id}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    padding: '0.85rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    textDecoration: 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                      {item.category}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>
                  <strong style={{ fontSize: '0.875rem', color: 'var(--color-text-main)' }}>
                    {item.title}
                  </strong>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: '0.25rem' }}>
                    <span>📍 {item.neighborhood}</span>
                    <span>👍 {item.supportCount} supporters</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
