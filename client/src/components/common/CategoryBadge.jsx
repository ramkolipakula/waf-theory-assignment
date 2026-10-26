import React from 'react';
import {
  Trash2,
  Construction,
  Lightbulb,
  Droplets,
  Waves,
  Landmark,
  Layers,
} from 'lucide-react';

export const CategoryBadge = ({ category }) => {
  const getIcon = () => {
    switch (category) {
      case 'Garbage & Sanitation':
        return <Trash2 size={13} />;
      case 'Road Damage & Potholes':
        return <Construction size={13} />;
      case 'Streetlights':
        return <Lightbulb size={13} />;
      case 'Water Leakage':
        return <Droplets size={13} />;
      case 'Drainage & Sewage':
        return <Waves size={13} />;
      case 'Public Infrastructure':
        return <Landmark size={13} />;
      default:
        return <Layers size={13} />;
    }
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontSize: '0.75rem',
        fontWeight: '600',
        padding: '0.2rem 0.55rem',
        borderRadius: '6px',
        backgroundColor: '#f1f5f9',
        color: '#334155',
        border: '1px solid #e2e8f0',
      }}
    >
      {getIcon()}
      {category}
    </span>
  );
};
