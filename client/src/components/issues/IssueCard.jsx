import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StatusBadge } from '../common/StatusBadge';
import { SeverityBadge } from '../common/SeverityBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { issuesAPI } from '../../services/api';
import { MapPin, ThumbsUp, MessageSquare, Calendar, ChevronRight } from 'lucide-react';

export const IssueCard = ({ issue, onSupportChange }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [supported, setSupported] = useState(issue.userHasSupported || false);
  const [supportCount, setSupportCount] = useState(issue.supportCount || 0);
  const [isSupporting, setIsSupporting] = useState(false);

  const handleSupportClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

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
          if (onSupportChange) onSupportChange(issue._id, false, res.data.supportCount);
        }
      } else {
        const res = await issuesAPI.support(issue._id);
        if (res.data.success) {
          setSupported(true);
          setSupportCount(res.data.supportCount);
          showToast('Thank you for supporting this issue!', 'success');
          if (onSupportChange) onSupportChange(issue._id, true, res.data.supportCount);
        }
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update support status', 'error');
    } finally {
      setIsSupporting(false);
    }
  };

  const formattedDate = new Date(issue.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const displayImage =
    issue.images && issue.images.length > 0
      ? issue.images[0]
      : 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      className="card issue-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Card Image Header */}
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
        <img
          src={displayImage}
          alt={issue.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80';
          }}
        />
        {/* Status Badge Over Image */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
          <StatusBadge status={issue.status} />
        </div>
        {/* Reference ID Pill */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            color: '#ffffff',
            fontSize: '0.7rem',
            fontFamily: 'monospace',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '4px',
          }}
        >
          {issue.referenceId || `#CC-${issue._id.slice(-6)}`}
        </div>
      </div>

      {/* Card Content */}
      <div
        className="card-body"
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '1.25rem',
        }}
      >
        {/* Badges Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <CategoryBadge category={issue.category} />
          <SeverityBadge severity={issue.severity} />
        </div>

        {/* Issue Title */}
        <h3
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            lineHeight: 1.35,
            marginBottom: '0.5rem',
            color: 'var(--color-text-main)',
          }}
        >
          <Link
            to={`/issues/${issue._id}`}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {issue.title}
          </Link>
        </h3>

        {/* Issue Description Excerpt */}
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.5,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {issue.description}
        </p>

        {/* Location & Date Metadata */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            fontSize: '0.78rem',
            color: 'var(--color-text-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={13} color="var(--color-primary)" />
            <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
              {issue.neighborhood}
            </span>
            <span style={{ opacity: 0.7 }}>&bull; {issue.location}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={13} />
            <span>Reported on {formattedDate}</span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.85rem',
            marginTop: '0.75rem',
            borderTop: '1px dashed var(--color-border)',
          }}
        >
          {/* Support Button */}
          <button
            onClick={handleSupportClick}
            disabled={isSupporting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${supported ? 'var(--color-primary)' : 'var(--color-border)'}`,
              backgroundColor: supported ? 'var(--color-primary-subtle)' : '#ffffff',
              color: supported ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <ThumbsUp size={14} fill={supported ? 'currentColor' : 'none'} />
            <span>{supportCount} {supportCount === 1 ? 'Support' : 'Supports'}</span>
          </button>

          {/* Comments Count & View Details Link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.8rem',
                color: 'var(--color-text-subtle)',
              }}
            >
              <MessageSquare size={13} />
              {issue.commentsCount || 0}
            </span>

            <Link
              to={`/issues/${issue._id}`}
              className="btn btn-secondary btn-sm"
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.8rem',
              }}
            >
              View <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
