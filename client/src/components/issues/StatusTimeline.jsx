import React from 'react';
import { CheckCircle2, Clock, Eye, Wrench, XCircle } from 'lucide-react';

export const StatusTimeline = ({ statusHistory = [], currentStatus = 'Reported' }) => {
  const getStepIcon = (status) => {
    switch (status) {
      case 'Reported':
        return <Clock size={16} />;
      case 'Acknowledged':
        return <Eye size={16} />;
      case 'In Progress':
        return <Wrench size={16} />;
      case 'Resolved':
        return <CheckCircle2 size={16} />;
      case 'Rejected':
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'Reported':
        return { bg: '#f1f5f9', border: '#94a3b8', text: '#475569' };
      case 'Acknowledged':
        return { bg: '#e0f2fe', border: '#0284c7', text: '#0369a1' };
      case 'In Progress':
        return { bg: '#fef3c7', border: '#d97706', text: '#b45309' };
      case 'Resolved':
        return { bg: '#dcfce7', border: '#16a34a', text: '#15803d' };
      case 'Rejected':
        return { bg: '#fee2e2', border: '#dc2626', text: '#b91c1c' };
      default:
        return { bg: '#f1f5f9', border: '#cbd5e1', text: '#475569' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
          Municipal Status Lifecycle & Audit Trail
        </h4>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
          {statusHistory.length} Recorded Milestone{statusHistory.length === 1 ? '' : 's'}
        </span>
      </div>

      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        {/* Vertical connector line */}
        <div
          style={{
            position: 'absolute',
            left: '15px',
            top: '12px',
            bottom: '12px',
            width: '2px',
            backgroundColor: '#e2e8f0',
            zIndex: 1,
          }}
        />

        {statusHistory.map((item, index) => {
          const colors = getStepColor(item.status);
          const formattedDate = new Date(item.timestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={index}
              style={{
                position: 'relative',
                marginBottom: index === statusHistory.length - 1 ? '0' : '1.75rem',
                zIndex: 2,
              }}
            >
              {/* Step indicator circle */}
              <div
                style={{
                  position: 'absolute',
                  left: '-2rem',
                  top: '0',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: colors.bg,
                  border: `2px solid ${colors.border}`,
                  color: colors.text,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                }}
              >
                {getStepIcon(item.status)}
              </div>

              {/* Step detail card */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    marginBottom: '0.35rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '0.925rem',
                      color: colors.text,
                    }}
                  >
                    {item.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                    {formattedDate}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.35rem' }}>
                  Handled by:{' '}
                  <strong style={{ color: '#0f172a' }}>
                    {item.changedByName || 'Municipal Authority'}
                  </strong>
                </div>

                {item.notes && (
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--color-text-muted)',
                      backgroundColor: '#f8fafc',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      borderLeft: `3px solid ${colors.border}`,
                      marginTop: '0.35rem',
                      lineHeight: 1.45,
                    }}
                  >
                    {item.notes}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
