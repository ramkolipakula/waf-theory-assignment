import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, departmentsAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { CategoryBadge } from '../components/common/CategoryBadge';
import {
  Sliders,
  Search,
  CheckCircle,
  Building2,
  Eye,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const AdminIssues = () => {
  const { showToast } = useToast();

  const [issues, setIssues] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [severity, setSeverity] = useState('All');
  const [page, setPage] = useState(1);

  // Status Update Modal State
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [newStatus, setNewStatus] = useState('Acknowledged');
  const [statusNotes, setStatusNotes] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Department Reassignment State
  const [deptModalIssue, setDeptModalIssue] = useState(null);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [deptNotes, setDeptNotes] = useState('');
  const [updatingDept, setUpdatingDept] = useState(false);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        sort: 'newest',
      };
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (status !== 'All') params.status = status;
      if (severity !== 'All') params.severity = severity;

      const [issuesRes, deptRes] = await Promise.all([
        adminAPI.getIssues(params),
        departmentsAPI.getAll(),
      ]);

      if (issuesRes.data.success) {
        setIssues(issuesRes.data.data);
        setTotal(issuesRes.data.total);
        setTotalPages(issuesRes.data.totalPages);
      }
      if (deptRes.data.success) {
        setDepartments(deptRes.data.data);
      }
    } catch (error) {
      console.error('Failed to load admin issues:', error);
      showToast('Failed to load civic issues.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [category, status, severity, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchIssues();
  };

  // Open Status Modal
  const openStatusModal = (issue) => {
    setSelectedIssue(issue);
    setNewStatus(issue.status);
    setStatusNotes('');
    setResolutionNotes(issue.resolutionNotes || '');
  };

  // Submit Status Change
  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIssue) return;

    setUpdatingStatus(true);
    try {
      const res = await adminAPI.updateStatus(selectedIssue._id, {
        status: newStatus,
        notes: statusNotes.trim() || `Status updated to ${newStatus} by Municipal Admin`,
        resolutionNotes: newStatus === 'Resolved' ? resolutionNotes.trim() : undefined,
      });

      if (res.data.success) {
        setIssues((prev) =>
          prev.map((i) => (i._id === selectedIssue._id ? res.data.data : i))
        );
        showToast(`Status updated to '${newStatus}' with audit note logged.`, 'success');
        setSelectedIssue(null);
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update status.', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Open Department Assignment Modal
  const openDeptModal = (issue) => {
    setDeptModalIssue(issue);
    setSelectedDeptId(issue.assignedDepartment?._id || '');
    setDeptNotes('');
  };

  // Submit Department Reassignment
  const handleDeptSubmit = async (e) => {
    e.preventDefault();
    if (!deptModalIssue) return;

    setUpdatingDept(true);
    try {
      const res = await adminAPI.updateDepartment(deptModalIssue._id, {
        departmentId: selectedDeptId || null,
        notes: deptNotes.trim() || 'Department reassignment performed by Municipal Admin.',
      });

      if (res.data.success) {
        setIssues((prev) =>
          prev.map((i) => (i._id === deptModalIssue._id ? res.data.data : i))
        );
        showToast('Department reassigned successfully.', 'success');
        setDeptModalIssue(null);
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to reassign department.', 'error');
    } finally {
      setUpdatingDept(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Sliders size={15} /> Administration Console
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: '0.25rem' }}>
            Civic Issue Triage & Management
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Update statuses, append milestone audit notes, and assign specialized municipal departments.
          </p>
        </div>

        <Link to="/admin" className="btn btn-secondary">
          Back to Admin Dashboard
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={18}
              color="var(--color-text-subtle)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Search by title, location, or reference ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
              Filter by Status
            </label>
            <select
              className="form-control"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
              Filter by Category
            </label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">All Categories</option>
              <option value="Garbage & Sanitation">Garbage & Sanitation</option>
              <option value="Road Damage & Potholes">Road Damage & Potholes</option>
              <option value="Streetlights">Streetlights</option>
              <option value="Water Leakage">Water Leakage</option>
              <option value="Drainage & Sewage">Drainage & Sewage</option>
              <option value="Public Infrastructure">Public Infrastructure</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
              Filter by Severity
            </label>
            <select
              className="form-control"
              value={severity}
              onChange={(e) => {
                setSeverity(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issues Table */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-subtle)' }}>
          Loading municipal issues...
        </p>
      ) : issues.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <p>No issues match your active administration filters.</p>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            overflowX: 'auto',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569' }}>Ref ID</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569' }}>Issue Title</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569' }}>Category</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569' }}>Severity</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569' }}>Assigned Dept</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569', textAlign: 'right' }}>Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr
                  key={issue._id}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 700, color: '#64748b' }}>
                    {issue.referenceId}
                  </td>

                  <td style={{ padding: '1rem', maxWidth: '280px' }}>
                    <Link
                      to={`/issues/${issue._id}`}
                      style={{ fontWeight: 700, color: 'var(--color-text-main)', textDecoration: 'none' }}
                    >
                      {issue.title}
                    </Link>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: '0.2rem' }}>
                      📍 {issue.neighborhood} &bull; Reporter: {issue.reporter?.name || 'Citizen'}
                    </div>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <CategoryBadge category={issue.category} />
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <SeverityBadge severity={issue.severity} />
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <StatusBadge status={issue.status} />
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <button
                      onClick={() => openDeptModal(issue)}
                      style={{
                        background: 'none',
                        border: '1px dashed var(--color-border)',
                        borderRadius: '4px',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        color: issue.assignedDepartment ? '#0f172a' : '#d97706',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <Building2 size={13} />
                      {issue.assignedDepartment?.name || 'Assign Department'}
                    </button>
                  </td>

                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      <Link
                        to={`/issues/${issue._id}`}
                        title="View Full Report"
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.35rem 0.55rem' }}
                      >
                        <Eye size={14} />
                      </Link>

                      <button
                        onClick={() => openStatusModal(issue)}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
                      >
                        Update Status
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="btn btn-secondary btn-sm"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="btn btn-secondary btn-sm"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* 1. Status Update Modal */}
      {selectedIssue && (
        <div className="modal-overlay" onClick={() => setSelectedIssue(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Update Issue Status</h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Reference ID: {selectedIssue.referenceId}
                </span>
              </div>
              <button
                onClick={() => setSelectedIssue(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleStatusSubmit}>
              <div className="form-group">
                <label className="form-label">New Status</label>
                <select
                  className="form-control"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  required
                >
                  <option value="Reported">Reported</option>
                  <option value="Acknowledged">Acknowledged</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Milestone Audit Notes (Appended to Status History)</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="e.g. Field inspection dispatched; repair crew scheduled for morning shift."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  required
                />
              </div>

              {newStatus === 'Resolved' && (
                <div className="form-group">
                  <label className="form-label" style={{ color: '#16a34a' }}>
                    Official Resolution Summary (Visible to Public)
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Describe how the problem was resolved (e.g. Ruptured pipe replaced, crosswalk repainted)."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    required
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedIssue(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="btn btn-primary"
                >
                  {updatingStatus ? 'Persisting...' : 'Save Status Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Department Assignment Modal */}
      {deptModalIssue && (
        <div className="modal-overlay" onClick={() => setDeptModalIssue(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Assign Department</h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {deptModalIssue.title}
                </span>
              </div>
              <button
                onClick={() => setDeptModalIssue(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleDeptSubmit}>
              <div className="form-group">
                <label className="form-label">Select Municipal Department</label>
                <select
                  className="form-control"
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  required
                >
                  <option value="">-- Unassigned --</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assignment Notes</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Reason for assignment or special field instructions..."
                  value={deptNotes}
                  onChange={(e) => setDeptNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setDeptModalIssue(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingDept}
                  className="btn btn-primary"
                >
                  {updatingDept ? 'Assigning...' : 'Confirm Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
