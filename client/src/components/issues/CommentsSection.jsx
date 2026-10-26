import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { commentsAPI } from '../../services/api';
import { MessageSquare, Send, Trash2, User, ShieldCheck } from 'lucide-react';

export const CommentsSection = ({ issueId }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await commentsAPI.getByIssue(issueId);
      if (res.data.success) {
        setComments(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (issueId) {
      fetchComments();
    }
  }, [issueId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!isAuthenticated) {
      showToast('Please log in to post a community comment.', 'info');
      return;
    }

    if (content.trim().length > 1000) {
      showToast('Comment cannot exceed 1000 characters.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await commentsAPI.create(issueId, content.trim());
      if (res.data.success) {
        setComments((prev) => [...prev, res.data.data]);
        setContent('');
        showToast('Comment posted successfully.', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to post comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await commentsAPI.delete(commentId);
      if (res.data.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        showToast('Comment deleted.', 'info');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete comment', 'error');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <MessageSquare size={20} color="var(--color-primary)" />
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
          Community Discussion ({comments.length})
        </h3>
      </div>

      {/* Post comment input */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1.75rem' }}>
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <textarea
              className="form-control"
              placeholder="Share an update, additional context, or verification details..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              maxLength={1000}
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
              {content.length}/1000 characters
            </span>
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Send size={14} />
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            textAlign: 'center',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            color: 'var(--color-text-muted)',
          }}
        >
          <a href="/login" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
            Log in
          </a>{' '}
          to join the community discussion or post official updates.
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-subtle)' }}>Loading discussion...</p>
      ) : comments.length === 0 ? (
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-subtle)', fontStyle: 'italic' }}>
          No comments yet. Be the first to share your thoughts or observations!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {comments.map((comment) => {
            const isAuthor = user && comment.author && comment.author._id === user._id;
            const canDelete = isAuthor || isAdmin;
            const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            const isAuthorityComment = comment.author?.role === 'admin';

            return (
              <div
                key={comment._id}
                style={{
                  padding: '1rem',
                  backgroundColor: isAuthorityComment ? '#f0fdf4' : '#f8fafc',
                  border: `1px solid ${isAuthorityComment ? '#bbf7d0' : '#e2e8f0'}`,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: isAuthorityComment ? '#16a34a' : '#0284c7',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {comment.author?.name?.charAt(0) || 'U'}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-main)' }}>
                      {comment.author?.name || 'Citizen'}
                    </span>
                    {isAuthorityComment && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          backgroundColor: '#dcfce7',
                          color: '#15803d',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px',
                        }}
                      >
                        <ShieldCheck size={11} /> Municipal Authority
                      </span>
                    )}
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                      &bull; {formattedDate}
                    </span>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      title="Delete Comment"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#94a3b8',
                        padding: '2px',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: 1.5, margin: '0.2rem 0 0 0' }}>
                  {comment.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
