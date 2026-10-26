import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Create a custom SVG pin icon to avoid bundler asset path issues
const createCustomMarker = (status, category) => {
  let color = '#059669'; // Default emerald
  if (status === 'Reported') color = '#64748b';
  if (status === 'Acknowledged') color = '#0284c7';
  if (status === 'In Progress') color = '#d97706';
  if (status === 'Resolved') color = '#16a34a';
  if (status === 'Rejected') color = '#dc2626';

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="30" height="40">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12z" fill="${color}" stroke="#ffffff" stroke-width="1.5" />
      <circle cx="12" cy="12" r="5" fill="#ffffff" />
    </svg>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svgIcon,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -36],
  });
};

export const IssueMap = ({
  issues = [],
  singleIssue = null,
  selectable = false,
  selectedCoords = null,
  onLocationSelect = null,
  height = '400px',
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent duplicate map initialization
    if (!mapInstanceRef.current) {
      // Default center: Metro coordinates (e.g. 17.4435, 78.3772)
      let initialLat = 17.4435;
      let initialLng = 78.3772;
      let initialZoom = 13;

      if (singleIssue && singleIssue.latitude && singleIssue.longitude) {
        initialLat = singleIssue.latitude;
        initialLng = singleIssue.longitude;
        initialZoom = 15;
      } else if (selectedCoords && selectedCoords.lat && selectedCoords.lng) {
        initialLat = selectedCoords.lat;
        initialLng = selectedCoords.lng;
        initialZoom = 15;
      }

      const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], initialZoom);

      // OpenStreetMap free tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Handle map click for location selection
      if (selectable && onLocationSelect) {
        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          onLocationSelect({
            lat: parseFloat(lat.toFixed(5)),
            lng: parseFloat(lng.toFixed(5)),
          });
        });
      }
    }

    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    // Single issue mode
    if (singleIssue && singleIssue.latitude && singleIssue.longitude) {
      const marker = L.marker([singleIssue.latitude, singleIssue.longitude], {
        icon: createCustomMarker(singleIssue.status, singleIssue.category),
      });

      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; font-size: 13px; min-width: 180px;">
          <strong style="color: #0f172a; display: block; margin-bottom: 4px;">${singleIssue.title}</strong>
          <span style="color: #64748b; font-size: 11px;">${singleIssue.neighborhood} &bull; ${singleIssue.location}</span>
          <div style="margin-top: 6px; font-weight: 600; color: #059669;">Status: ${singleIssue.status}</div>
        </div>
      `);

      markersLayer.addLayer(marker);
      map.setView([singleIssue.latitude, singleIssue.longitude], 15);
    }
    // Multiple issues mode
    else if (issues && issues.length > 0) {
      const bounds = [];

      issues.forEach((issue) => {
        if (issue.latitude && issue.longitude) {
          const marker = L.marker([issue.latitude, issue.longitude], {
            icon: createCustomMarker(issue.status, issue.category),
          });

          marker.bindPopup(`
            <div style="font-family: system-ui, sans-serif; font-size: 12px; min-width: 200px;">
              <span style="display: inline-block; background: #e2e8f0; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 600; margin-bottom: 4px;">
                ${issue.category}
              </span>
              <strong style="color: #0f172a; display: block; font-size: 13px; margin-bottom: 4px;">
                ${issue.title}
              </strong>
              <div style="color: #64748b; margin-bottom: 6px;">
                📍 ${issue.neighborhood}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 6px;">
                <span style="font-weight: 600; color: #059669;">${issue.status}</span>
                <a href="/issues/${issue._id}" style="color: #0284c7; font-weight: 600; text-decoration: none;">View details &rarr;</a>
              </div>
            </div>
          `);

          markersLayer.addLayer(marker);
          bounds.push([issue.latitude, issue.longitude]);
        }
      });

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }
    }
    // Location picker mode
    else if (selectedCoords && selectedCoords.lat && selectedCoords.lng) {
      const marker = L.marker([selectedCoords.lat, selectedCoords.lng], {
        icon: createCustomMarker('Reported', 'Default'),
      });

      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; font-size: 12px;">
          <strong>Selected Issue Coordinates</strong><br/>
          Lat: ${selectedCoords.lat}, Lng: ${selectedCoords.lng}
        </div>
      `).openPopup();

      markersLayer.addLayer(marker);
      map.setView([selectedCoords.lat, selectedCoords.lng], 15);
    }
  }, [issues, singleIssue, selectedCoords, selectable, onLocationSelect]);

  return (
    <div
      style={{
        width: '100%',
        height: height,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
