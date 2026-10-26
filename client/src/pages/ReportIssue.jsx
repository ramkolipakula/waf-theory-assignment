import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { issuesAPI } from '../services/api';
import { IssueMap } from '../components/issues/IssueMap';
import {
  PlusCircle,
  Upload,
  MapPin,
  Crosshair,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const ReportIssue = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Garbage & Sanitation',
    severity: 'Medium',
    description: '',
    location: '',
    neighborhood: user?.neighborhood || 'Downtown Core',
    latitude: '',
    longitude: '',
    imageUrl: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const categories = [
    'Garbage & Sanitation',
    'Road Damage & Potholes',
    'Streetlights',
    'Water Leakage',
    'Drainage & Sewage',
    'Public Infrastructure',
    'Other',
  ];

  const neighborhoods = [
    'Downtown Core',
    'Greenwood Park',
    'Metro Heights',
    'Lakeside District',
    'Riverside District',
    'Westend Suburbs',
    'Northgate Sector',
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file size cannot exceed 5MB.', 'error');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Optional GPS Detection
  const detectGpsLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'info');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(5));
        const lng = parseFloat(position.coords.longitude.toFixed(5));
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          location: prev.location || `GPS Location (${lat}, ${lng})`,
        }));
        setGpsLoading(false);
        showToast('GPS coordinates accurately detected!', 'success');
      },
      (error) => {
        setGpsLoading(false);
        showToast(
          'Could not retrieve GPS location. You may enter the location manually or click on the map.',
          'info'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Handle map click coordinate selection
  const handleMapLocationSelect = (coords) => {
    setFormData((prev) => ({
      ...prev,
      latitude: coords.lat,
      longitude: coords.lng,
      location: prev.location || `Near Lat: ${coords.lat}, Lng: ${coords.lng}`,
    }));
    showToast(`Coordinates pinned on map: ${coords.lat}, ${coords.lng}`, 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.title.trim()) {
      setErrorMessage('Please provide a descriptive title for the issue.');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMessage('Please provide detailed information describing the issue.');
      return;
    }
    if (!formData.location.trim()) {
      setErrorMessage('Please provide an address or physical location.');
      return;
    }

    setSubmitting(true);

    try {
      // Use FormData for file upload or JSON payload
      const form = new FormData();
      form.append('title', formData.title.trim());
      form.append('category', formData.category);
      form.append('severity', formData.severity);
      form.append('description', formData.description.trim());
      form.append('location', formData.location.trim());
      form.append('neighborhood', formData.neighborhood.trim());

      if (formData.latitude) form.append('latitude', formData.latitude);
      if (formData.longitude) form.append('longitude', formData.longitude);
      if (selectedFile) {
        form.append('image', selectedFile);
      } else if (formData.imageUrl.trim()) {
        form.append('imageUrl', formData.imageUrl.trim());
      }

      const res = await issuesAPI.create(form);
      if (res.data.success) {
        showToast(`Report logged successfully! Complaint ID: ${res.data.data.referenceId}`, 'success');
        navigate(`/issues/${res.data.data._id}`);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Failed to submit report. Please review form inputs.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '880px' }}>
      <div
        className="card"
        style={{
          padding: '2.5rem',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-md)',
          backgroundColor: '#ffffff',
        }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <PlusCircle size={15} /> Citizen Issue Submission
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: '0.35rem' }}>
            Report a Civic Problem
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Submit photographic evidence and location details. Your report will be automatically routed to the relevant municipal department.
          </p>
        </div>

        {errorMessage && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              fontWeight: 500,
            }}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Issue Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Issue Title <span className="required">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-control"
              placeholder="e.g. Hazardous Deep Pothole in Front of Public School"
              value={formData.title}
              onChange={handleInputChange}
              maxLength={120}
              required
            />
            <span className="form-hint">A concise summary of the civic maintenance problem (max 120 chars)</span>
          </div>

          {/* Category & Severity Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="category">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="severity">
                Severity Level <span className="required">*</span>
              </label>
              <select
                id="severity"
                name="severity"
                className="form-control"
                value={formData.severity}
                onChange={handleInputChange}
                required
              >
                <option value="Low">Low (Minor / Cosmetic)</option>
                <option value="Medium">Medium (Standard priority)</option>
                <option value="High">High (Significant impact)</option>
                <option value="Critical">Critical (Immediate danger)</option>
              </select>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Detailed Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows={4}
              placeholder="Explain the issue thoroughly: How long has it persisted? How is it impacting citizens or traffic? Any identifiable landmarks?"
              value={formData.description}
              onChange={handleInputChange}
              maxLength={2000}
              required
            />
            <span className="form-hint">{formData.description.length}/2000 characters</span>
          </div>

          {/* Image Upload & Live Preview */}
          <div className="form-group">
            <label className="form-label">
              Photograph / Evidence (Upload or URL)
            </label>
            <div
              style={{
                border: '2px dashed var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              {imagePreview ? (
                <div style={{ position: 'relative', width: '100%', maxWidth: '320px', height: '180px' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setImagePreview(null);
                    }}
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      backgroundColor: 'rgba(220, 38, 38, 0.9)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={32} color="var(--color-primary)" />
                  <div>
                    <label
                      htmlFor="image-file"
                      className="btn btn-secondary btn-sm"
                      style={{ cursor: 'pointer', display: 'inline-block' }}
                    >
                      Choose Photo from Device
                    </label>
                    <input
                      id="image-file"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                    Supported formats: JPEG, PNG, WebP (Max 5MB)
                  </span>
                </>
              )}
            </div>

            {/* Optional Fallback Image URL */}
            <div style={{ marginTop: '0.5rem' }}>
              <input
                name="imageUrl"
                type="url"
                className="form-control"
                placeholder="Or paste an online image URL (optional)"
                value={formData.imageUrl}
                onChange={(e) => {
                  handleInputChange(e);
                  if (e.target.value.startsWith('http')) {
                    setImagePreview(e.target.value);
                  }
                }}
              />
            </div>
          </div>

          {/* Location Details & Neighborhood */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="location">
                Street Address / Landmark <span className="required">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                className="form-control"
                placeholder="e.g. Opposite Gate 2, City General Hospital"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="neighborhood">
                Neighborhood / Ward <span className="required">*</span>
              </label>
              <select
                id="neighborhood"
                name="neighborhood"
                className="form-control"
                value={formData.neighborhood}
                onChange={handleInputChange}
                required
              >
                {neighborhoods.map((nh) => (
                  <option key={nh} value={nh}>
                    {nh}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Map & GPS Detection */}
          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ margin: 0 }}>
                Pin Location on Map (Optional Coordinates)
              </label>
              <button
                type="button"
                onClick={detectGpsLocation}
                disabled={gpsLoading}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Crosshair size={14} color="var(--color-primary)" />
                {gpsLoading ? 'Detecting GPS...' : 'Use Current GPS'}
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', marginBottom: '0.75rem' }}>
              Click anywhere on the map to pin the exact coordinates of the issue.
            </p>

            <IssueMap
              selectable={true}
              selectedCoords={
                formData.latitude && formData.longitude
                  ? { lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) }
                  : null
              }
              onLocationSelect={handleMapLocationSelect}
              height="260px"
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
              <input
                name="latitude"
                type="number"
                step="any"
                className="form-control"
                placeholder="Latitude (e.g. 17.4435)"
                value={formData.latitude}
                onChange={handleInputChange}
              />
              <input
                name="longitude"
                type="number"
                step="any"
                className="form-control"
                placeholder="Longitude (e.g. 78.3772)"
                value={formData.longitude}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1.5rem', padding: '0.875rem' }}
          >
            <CheckCircle size={18} />
            {submitting ? 'Registering Civic Complaint...' : 'Submit Civic Issue Report'}
          </button>
        </form>
      </div>
    </div>
  );
};
