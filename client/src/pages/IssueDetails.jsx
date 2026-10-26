import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { issuesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { StatusTimeline } from '../components/issues/StatusTimeline';
import { CommentsSection } from '../components/issues/CommentsSection';
import { IssueMap } from '../components/issues/IssueMap';
import {
  MapPin,
  Calendar,
  User,
  Building2,
  ThumbsUp,
  Share2,
  ArrowLeft,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const IssueDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supported, setSupported] = useState(false);
  const [supportCount, setSupportCount] = useState(0);
  const [isSupporting, setIsSupporting] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await issuesAPI.getById(id);
        if (res.data.success) {
          const data = res.data.data;
          setIssue(data);
          setSupported(data.userHasSupported || false);
          setSupportCount(data.supportCount || 0);
        }
      } catch (error) {
        console.error('Failed to load issue details:', error);
        showToast('Civic issue report not found.', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchIssue();
  }, [id]);

  const handleSupportClick = async () => {
    if (!isAuthenticated) {
      showToast('Please log in to support this community issue.', 'info');
      navigate('/login');
      return;
    }

    if (isSupporting) return;
    setIsSupporting(true);

    try {
      if (supported) {
        const res = await issuesAPI.removeSupport(issue._id);
        if (res.data.success) {
          setSupported(false);
          setSupportCount(res.data.supportCount);
          showToast('Support removed.', 'info');
        }
      } else {
        const res = await issuesAPI.support(issue._id);
        if (res.data.success) {
          setSupported(true);
          setSupportCount(res.data.supportCount);
          showToast('Thank you for supporting this issue!', 'success');
        }
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update support status', 'error');
    } finally {
      setIsSupporting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!', 'success');
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-subtle)' }}>Loading issue details...</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Report Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
          The requested civic issue report does not exist or has been removed.
        </p>
        <Link to="/explore" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
          Back to Explore Issues
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(issue.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const displayImage =
    issue.images && issue.images.length > 0
      ? issue.images[0]
      : 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Back button & reference header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          to="/explore"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} /> Back to Community Issues
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={handleCopyLink}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Share2 size={14} /> Share Report
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '2.5rem' }}>
        {/* Left Column: Media, Details, Status Timeline, Comments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Main Content Card */}
          <div
            className="card"
            style={{
              padding: '2rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Top Badges & Reference ID */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <StatusBadge status={issue.status} />
                <CategoryBadge category={issue.category} />
                <SeverityBadge severity={issue.severity} />
              </div>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  padding: '3px 10px',
                  borderRadius: '6px',
                }}
              >
                Ref ID: {issue.referenceId}
              </span>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem' }}>
              {issue.title}
            </h1>

            {/* Metadata strip */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.25rem',
                fontSize: '0.85rem',
                color: 'var(--color-text-subtle)',
                paddingBottom: '1.25rem',
                marginBottom: '1.5rem',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={15} color="var(--color-primary)" />
                <strong style={{ color: 'var(--color-text-main)' }}>{issue.neighborhood}</strong>
                <span>&bull; {issue.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={15} />
                <span>Filed {formattedDate}</span>
              </div>
            </div>

            {/* Main Photograph */}
            <div
              style={{
                width: '100%',
                maxHeight: '440px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                backgroundColor: '#f1f5f9',
                marginBottom: '1.5rem',
                border: '1px solid var(--color-border)',
              }}
            >
              <img
                src={displayImage}
                alt={issue.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Description */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Issue Description & Citizen Notes
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {issue.description}
            </p>

            {/* Resolution Notes (if resolved) */}
            {issue.resolutionNotes && (
              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '1.25rem',
                  backgroundColor: '#f0fdf4',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #bbf7d0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                  <CheckCircle size={16} /> Official Municipal Resolution Report
                </div>
                <p style={{ fontSize: '0.9rem', color: '#14532d', margin: 0 }}>
                  {issue.resolutionNotes}
                </p>
              </div>
            )}
          </div>

          {/* Status Timeline Milestone Tracker */}
          <div
            className="card"
            style={{
              padding: '2rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <StatusTimeline statusHistory={issue.statusHistory} currentStatus={issue.status} />
          </div>

          {/* Community Discussion */}
          <CommentsSection issueId={issue._id} />
        </div>

        {/* Right Column: Actions, Map, Reporter info, Department info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Support Widget */}
          <div
            className="card"
            style={{
              padding: '1.75rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Community Endorsement
            </span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary-deep)', margin: '0.35rem 0' }}>
              {supportCount}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              {supportCount === 1 ? '1 neighbor has' : `${supportCount} neighbors have`} supported this report for priority municipal action.
            </p>

            <button
              onClick={handleSupportClick}
              disabled={isSupporting}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: supported ? 'var(--color-primary-dark)' : 'var(--color-primary)',
              }}
            >
              <ThumbsUp size={16} fill={supported ? 'currentColor' : 'none'} />
              {supported ? 'Supported (Click to Withdraw)' : 'Endorse / Support This Issue'}
            </button>
          </div>

          {/* Assigned Municipal Department */}
          <div
            className="card"
            style={{
              padding: '1.75rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Building2 size={18} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                Assigned Municipal Authority
              </h3>
            </div>

            {issue.assignedDepartment ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                  {issue.assignedDepartment.name}
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                    ({issue.assignedDepartment.code})
                  </span>
                </div>

                {issue.assignedDepartment.headOfDepartment && (
                  <div style={{ fontSize: '0.825rem', color: '#475569' }}>
                    Officer in charge: <strong>{issue.assignedDepartment.headOfDepartment}</strong>
                  </div>
                )}

                {issue.assignedDepartment.contactEmail && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#64748b' }}>
                    <Mail size={13} /> {issue.assignedDepartment.contactEmail}
                  </div>
                )}

                {issue.assignedDepartment.contactPhone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#64748b' }}>
                    <Phone size={13} /> {issue.assignedDepartment.contactPhone}
                  </div>
                )}
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>
                Currently in initial triage queue. A municipal administrator will inspect and assign a department shortly.
              </p>
            )}
          </div>

          {/* Location Map */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
              <MapPin size={16} color="var(--color-primary)" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Geo-Location Verification</h4>
            </div>

            {issue.latitude && issue.longitude ? (
              <>
                <IssueMap singleIssue={issue} height="240px" />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                  <span>Lat: {issue.latitude}</span>
                  <span>Lng: {issue.longitude}</span>
                </div>
              </>
            ) : (
              <div
                style={{
                  padding: '2rem 1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-subtle)',
                }}
              >
                No exact GPS coordinates logged for this issue. Street location: <strong>{issue.location}</strong>
              </div>
            )}
          </div>

          {/* Reporter Information (Privacy-respecting) */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
              <User size={16} color="var(--color-primary)" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Citizen Reporter Details</h4>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-light)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                {issue.reporter?.name?.charAt(0) || 'C'}
              </div>
              <div>
                <strong style={{ fontSize: '0.925rem', color: 'var(--color-text-main)', display: 'block' }}>
                  {issue.reporter?.name || 'Verified Citizen'}
                </strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-subtle)' }}>
                  Resident of {issue.reporter?.neighborhood || issue.neighborhood}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
