import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { issuesAPI } from '../services/api';
import { IssueCard } from '../components/issues/IssueCard';
import { IssueMap } from '../components/issues/IssueMap';
import {
  Search,
  Filter,
  Grid,
  Map as MapIcon,
  RotateCcw,
  Compass,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const ExploreIssues = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [issues, setIssues] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  // Filters state initialized from query params if present
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [neighborhood, setNeighborhood] = useState(searchParams.get('neighborhood') || 'All');
  const [severity, setSeverity] = useState(searchParams.get('severity') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(1);

  const categories = [
    'All',
    'Garbage & Sanitation',
    'Road Damage & Potholes',
    'Streetlights',
    'Water Leakage',
    'Drainage & Sewage',
    'Public Infrastructure',
    'Other',
  ];

  const statuses = ['All', 'Reported', 'Acknowledged', 'In Progress', 'Resolved', 'Rejected'];

  const neighborhoods = [
    'All',
    'Downtown Core',
    'Greenwood Park',
    'Metro Heights',
    'Lakeside District',
    'Riverside District',
    'Westend Suburbs',
    'Northgate Sector',
  ];

  const severities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        sort,
      };

      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (status !== 'All') params.status = status;
      if (neighborhood !== 'All') params.neighborhood = neighborhood;
      if (severity !== 'All') params.severity = severity;

      const res = await issuesAPI.getAll(params);
      if (res.data.success) {
        setIssues(res.data.data);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [category, status, neighborhood, severity, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchIssues();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setStatus('All');
    setNeighborhood('All');
    setSeverity('All');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Compass size={15} /> Community Registry
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>
            Explore Community Civic Issues
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Discover reported neighborhood concerns, lend community support, and track resolution timelines.
          </p>
        </div>

        {/* View Mode Toggle: Grid vs Map */}
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: viewMode === 'grid' ? '#ffffff' : 'transparent',
              color: viewMode === 'grid' ? 'var(--color-text-main)' : 'var(--color-text-subtle)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: viewMode === 'grid' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            <Grid size={15} /> Grid View
          </button>
          <button
            onClick={() => setViewMode('map')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: viewMode === 'map' ? '#ffffff' : 'transparent',
              color: viewMode === 'map' ? 'var(--color-text-main)' : 'var(--color-text-subtle)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: viewMode === 'map' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            <MapIcon size={15} /> Map View
          </button>
        </div>
      </div>

      {/* Search & Filter Controls Bar */}
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
        {/* Search Bar */}
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
              placeholder="Search by issue title, description, reference ID, or street location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.625rem 1.25rem' }}>
            Search
          </button>
        </form>

        {/* Dropdown Filters Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
          {/* Category */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
              Category
            </label>
            <select
              className="form-control"
              style={{ fontSize: '0.85rem', padding: '0.45rem 0.65rem' }}
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
              Status
            </label>
            <select
              className="form-control"
              style={{ fontSize: '0.85rem', padding: '0.45rem 0.65rem' }}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Neighborhood */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
              Neighborhood
            </label>
            <select
              className="form-control"
              style={{ fontSize: '0.85rem', padding: '0.45rem 0.65rem' }}
              value={neighborhood}
              onChange={(e) => {
                setNeighborhood(e.target.value);
                setPage(1);
              }}
            >
              {neighborhoods.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Severity */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
              Severity
            </label>
            <select
              className="form-control"
              style={{ fontSize: '0.85rem', padding: '0.45rem 0.65rem' }}
              value={severity}
              onChange={(e) => {
                setSeverity(e.target.value);
                setPage(1);
              }}
            >
              {severities.map((sev) => (
                <option key={sev} value={sev}>
                  {sev}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
              Sort Order
            </label>
            <select
              className="form-control"
              style={{ fontSize: '0.85rem', padding: '0.45rem 0.65rem' }}
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="mostSupported">Most Supported</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={handleResetFilters}
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: '0.85rem', padding: '0.45rem 0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
            >
              <RotateCcw size={14} /> Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Active Results Summary */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-text-subtle)' }}>
        <span>
          Showing <strong>{issues.length}</strong> of <strong>{total}</strong> civic issue reports
        </span>
        {totalPages > 1 && (
          <span>
            Page {page} of {totalPages}
          </span>
        )}
      </div>

      {/* View Mode: Map vs Grid */}
      {viewMode === 'map' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '0.75rem 1rem', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.85rem', color: '#166534' }}>
            🗺️ Interactive Map displaying geo-located civic issues across municipal sectors. Click any pin to view details and jump to the report.
          </div>
          <IssueMap issues={issues} height="560px" />
        </div>
      ) : loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-subtle)' }}>
          Loading community issues...
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
          <Compass size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
            No Matching Civic Issues Found
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0.5rem auto 1.5rem auto' }}>
            Try adjusting your search keywords, clearing specific category filters, or selecting "All" neighborhoods.
          </p>
          <button onClick={handleResetFilters} className="btn btn-secondary">
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
          {issues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
