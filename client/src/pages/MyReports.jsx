import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { issuesAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { CategoryBadge } from '../components/common/CategoryBadge';
import {
  FileText,
  Search,
  PlusCircle,
  Eye,
  Edit2,
  Trash2,
  AlertCircle,
  X,
  Check,
} from 'lucide-react';

export const MyReports = () => {
  const { showToast } = useToast();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Edit Modal State
  const [editingIssue, setEditingIssue] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchMyReports = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res = await issuesAPI.getMyIssues(params);
      if (res.data.success) {
        setIssues(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load my reports:', error);
      showToast('Failed to load your submitted reports.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMyReports();
  };

  // Withdraw / Delete Report
  const handleDelete = async (issueId, status) => {
    if (status !== 'Reported') {
      showToast(`Cannot withdraw report once it is '${status}'. Only unacknowledged reports can be withdrawn.`, 'error');
      return;
    }

    if (!window.confirm('Are you sure you want to withdraw this civic report? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await issuesAPI.delete(issueId);
      if (res.data.success) {
        setIssues((prev) => prev.filter((i) => i._id !== issueId));
        showToast('Civic issue report successfully withdrawn.', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to withdraw report.', 'error');
    }
  };

  // Open Edit Modal
  const openEditModal = (issue) => {
    if (issue.status !== 'Reported') {
      showToast(`Cannot edit report in '${issue.status}' status. Only reports under initial review can be modified.`, 'info');
      return;
    }

    setEditingIssue(issue);
    setEditFormData({
      title: issue.title,
      description: issue.description,
      category: issue.category,
      location: issue.location,
    });
  };

  // Save Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingIssue) return;

    setIsUpdating(true);
    try {
      const res = await issuesAPI.update(editingIssue._id, editFormData);
      if (res.data.success) {
        setIssues((prev) =>
          prev.map((i) => (i._id === editingIssue._id ? res.data.data : i))
        );
        showToast('Report updated successfully.', 'success');
        setEditingIssue(null);
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update report.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <FileText size={15} /> Citizen Activity
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: '0.25rem' }}>
            My Submitted Civic Reports
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Manage the civic issues you have reported. You may edit or withdraw unacknowledged reports.
          </p>
        </div>

        <Link to="/report" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <PlusCircle size={16} /> Report Another Issue
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
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1', minWidth: '260px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search within my reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary">
            <Search size={16} />
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Filter by Status:
          </span>
          <select
            className="form-control"
            style={{ width: 'auto', fontSize: '0.875rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Reported">Reported</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Reports Table / List */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-subtle)' }}>
          Loading your submitted reports...
        </p>
      ) : issues.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
          }}
        >
          <AlertCircle size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No Reports Found</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '360px', margin: '0.5rem auto 1.5rem auto' }}>
            {statusFilter !== 'All'
              ? `You don't have any reports currently matching status '${statusFilter}'.`
              : "You haven't submitted any civic issue reports yet."}
          </p>
          <Link to="/report" className="btn btn-primary btn-sm">
            Report a Civic Issue Now
          </Link>
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
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569' }}>Department</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569' }}>Reported On</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => {
                const canEditOrWithdraw = issue.status === 'Reported';
                const formattedDate = new Date(issue.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
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
                        📍 {issue.neighborhood} &bull; {issue.location}
                      </div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <CategoryBadge category={issue.category} />
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <StatusBadge status={issue.status} />
                    </td>

                    <td style={{ padding: '1rem', color: '#475569' }}>
                      {issue.assignedDepartment?.name || 'Triage Queue'}
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--color-text-subtle)' }}>
                      {formattedDate}
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <Link
                          to={`/issues/${issue._id}`}
                          title="View Details"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.55rem' }}
                        >
                          <Eye size={14} />
                        </Link>

                        {canEditOrWithdraw ? (
                          <>
                            <button
                              onClick={() => openEditModal(issue)}
                              title="Edit Issue (Permitted before acknowledgement)"
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.35rem 0.55rem', color: '#0284c7' }}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(issue._id, issue.status)}
                              title="Withdraw Report"
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.35rem 0.55rem', color: '#dc2626' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        ) : (
                          <span
                            title="Modifications locked once acknowledged by municipal authority"
                            style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', paddingLeft: '0.25rem' }}
                          >
                            Locked
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal Dialog */}
      {editingIssue && (
        <div className="modal-overlay" onClick={() => setEditingIssue(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Edit Civic Issue Report</h3>
              <button
                onClick={() => setEditingIssue(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label className="form-label">Issue Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Description</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Street Address / Landmark</label>
                <input
                  type="text"
                  className="form-control"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingIssue(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn btn-primary"
                >
                  {isUpdating ? 'Saving...' : 'Save Modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
