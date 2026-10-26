import React from 'react';
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';

export const SeverityBadge = ({ severity }) => {
  switch (severity) {
    case 'Critical':
      return (
        <span className="badge badge-severity-critical" title="Presents immediate hazard to public safety">
          <ShieldAlert size={12} />
          Critical
        </span>
      );
    case 'High':
      return (
        <span className="badge badge-severity-high" title="Significant community impact requiring prompt action">
          <AlertTriangle size={12} />
          High
        </span>
      );
    case 'Medium':
      return (
        <span className="badge badge-severity-medium" title="Standard civic maintenance priority">
          <AlertCircle size={12} />
          Medium
        </span>
      );
    case 'Low':
      return (
        <span className="badge badge-severity-low" title="Minor cosmetic or non-urgent repair">
          <Info size={12} />
          Low
        </span>
      );
    default:
      return <span className="badge badge-severity-medium">{severity || 'Medium'}</span>;
  }
};
