import React from 'react';
import { Clock, Eye, Wrench, CheckCircle2, XCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'Reported':
      return (
        <span className="badge badge-reported" title="Issue reported by citizen and awaiting municipal triage">
          <Clock size={12} />
          Reported
        </span>
      );
    case 'Acknowledged':
      return (
        <span className="badge badge-acknowledged" title="Reviewed and officially acknowledged by department">
          <Eye size={12} />
          Acknowledged
        </span>
      );
    case 'In Progress':
      return (
        <span className="badge badge-in-progress" title="Municipal field crews or contractors are actively working">
          <Wrench size={12} />
          In Progress
        </span>
      );
    case 'Resolved':
      return (
        <span className="badge badge-resolved" title="Issue successfully addressed and verified">
          <CheckCircle2 size={12} />
          Resolved
        </span>
      );
    case 'Rejected':
      return (
        <span className="badge badge-rejected" title="Issue rejected or marked invalid/duplicate">
          <XCircle size={12} />
          Rejected
        </span>
      );
    default:
      return <span className="badge badge-reported">{status || 'Unknown'}</span>;
  }
};
