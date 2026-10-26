import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { SeverityBadge } from '../components/common/SeverityBadge';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import {
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Clock,
  Wrench,
  AlertTriangle,
  Users,
  Building2,
  TrendingUp,
  ArrowRight,
  Landmark,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [dashRes, analyticsRes] = await Promise.all([
          dashboardAPI.getAdminStats(),
          dashboardAPI.getAdminAnalytics(),
        ]);

        if (dashRes.data.success) {
          setData(dashRes.data.data);
        }
        if (analyticsRes.data.success) {
          setAnalytics(analyticsRes.data.data);
        }
      } catch (error) {
        console.error('Failed to load admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const overview = data?.overview || {
    totalReports: 0,
    activeIssues: 0,
    reportedCount: 0,
    acknowledgedCount: 0,
    inProgressCount: 0,
    resolvedCount: 0,
    rejectedCount: 0,
    criticalCount: 0,
    totalCitizens: 0,
    totalDepartments: 0,
    resolutionRate: 0,
  };

  const statusColors = {
    Reported: '#64748b',
    Acknowledged: '#0284c7',
    'In Progress': '#d97706',
    Resolved: '#16a34a',
    Rejected: '#dc2626',
  };

  const categoryBarData =
    analytics?.categoryBreakdown ||
    data?.categoryStats?.map((c) => ({ category: c.name, total: c.count, resolved: 0, pending: c.count })) ||
    [];

  const statusPieData =
    analytics?.statusDistribution?.map((s) => ({
      ...s,
      color: statusColors[s.name] || '#94a3b8',
    })) ||
    data?.statusStats?.map((s) => ({
      name: s.name,
      value: s.count,
      color: statusColors[s.name] || '#94a3b8',
    })) ||
    [];

  const neighborhoodData =
    analytics?.neighborhoodBreakdown?.slice(0, 6) ||
    data?.neighborhoodStats?.slice(0, 6)?.map((n) => ({ neighborhood: n.name, total: n.count })) ||
    [];

  const recentIssues = data?.recentIssues || [];

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: '#064e3b',
          borderRadius: 'var(--radius-xl)',
          padding: '2.25rem 2.5rem',
          color: '#ffffff',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#a7f3d0', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <ShieldAlert size={16} /> Municipal Operations Center
          </div>
          <h1 style={{ color: '#ffffff', fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>
            Municipal Administration Dashboard
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginTop: '0.25rem', maxWidth: '650px' }}>
            Real-time civic operations triage, inter-departmental performance metrics, and neighborhood maintenance analytics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem' }}>
          <Link
            to="/admin/issues"
            className="btn btn-primary btn-lg"
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Sliders size={18} /> Manage & Triage Issues
          </Link>
        </div>
      </div>

      {/* Overview KPI Cards */}
      <div className="grid grid-cols-4" style={{ gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #0f172a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Civic Reports</span>
            <Building2 size={20} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.4rem', color: '#0f172a' }}>
            {overview.totalReports}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Across all municipal wards</span>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #dc2626' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Critical / Urgent Alerts</span>
            <AlertTriangle size={20} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.4rem', color: '#dc2626' }}>
            {overview.criticalCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#b91c1c' }}>Requires immediate safety response</span>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #d97706' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d97706' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active In-Triage / Progress</span>
            <Wrench size={20} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.4rem', color: '#d97706' }}>
            {overview.activeIssues}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#b45309' }}>Assigned to municipal teams</span>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #16a34a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Resolution Rate</span>
            <TrendingUp size={20} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.4rem', color: '#16a34a' }}>
            {overview.resolutionRate}%
          </div>
          <span style={{ fontSize: '0.75rem', color: '#15803d' }}>
            {overview.resolvedCount} issues successfully addressed
          </span>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '2rem' }}>
        {/* Chart 1: Issues by Category */}
        <div
          className="card"
          style={{
            padding: '1.75rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Civic Issues by Departmental Category</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
              Live distribution of reports logged across core municipal sectors
            </p>
          </div>

          <div style={{ width: '100%', height: '320px' }}>
            {categoryBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryBarData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 40 }}
                >
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="total" fill="#059669" radius={[4, 4, 0, 0]} name="Total Reports" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ textAlign: 'center', paddingTop: '100px', color: '#94a3b8' }}>No data available</p>
            )}
          </div>
        </div>

        {/* Chart 2: Issues by Status */}
        <div
          className="card"
          style={{
            padding: '1.75rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Report Status Breakdown</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
              Proportion of issues across the resolution lifecycle
            </p>
          </div>

          <div style={{ width: '100%', height: '320px' }}>
            {statusPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ textAlign: 'center', paddingTop: '100px', color: '#94a3b8' }}>No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Neighborhood Distribution & Recent Triage List */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem' }}>
        {/* Neighborhood Distribution Bar */}
        <div
          className="card"
          style={{
            padding: '1.75rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Neighborhood Density</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
              Reports volume across active municipal sectors
            </p>
          </div>

          <div style={{ width: '100%', height: '280px' }}>
            {neighborhoodData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={neighborhoodData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                  <YAxis type="category" dataKey="neighborhood" tick={{ fontSize: 11, fill: '#475569' }} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="total" fill="#0284c7" radius={[0, 4, 4, 0]} name="Reports" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ textAlign: 'center', paddingTop: '100px', color: '#94a3b8' }}>No data available</p>
            )}
          </div>
        </div>

        {/* Priority Triage Queue */}
        <div
          className="card"
          style={{
            padding: '1.75rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Reports for Triage</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
                Latest complaints requiring administrative review and assignment
              </p>
            </div>
            <Link to="/admin/issues" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Full Issue Manager <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {recentIssues.slice(0, 5).map((issue) => (
              <div
                key={issue._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#f8fafc',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', maxWidth: '70%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', fontWeight: 700, color: '#64748b' }}>
                      {issue.referenceId}
                    </span>
                    <StatusBadge status={issue.status} />
                    <SeverityBadge severity={issue.severity} />
                  </div>
                  <strong style={{ fontSize: '0.875rem', color: 'var(--color-text-main)' }}>
                    {issue.title}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                    📍 {issue.neighborhood} &bull; Dept: {issue.assignedDepartment?.name || 'Unassigned'}
                  </span>
                </div>

                <Link
                  to={`/issues/${issue._id}`}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.35rem 0.65rem' }}
                >
                  Inspect
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
