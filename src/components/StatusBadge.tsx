import React from 'react';
import { AppointmentStatus } from '../types';
import { Badge } from './Badge';

const MAP: Record<AppointmentStatus, { variant: string; label: string }> = {
  PENDING: { variant: 'pending', label: 'Pending' },
  CONFIRMED: { variant: 'confirmed', label: 'Confirmed' },
  COMPLETED: { variant: 'completed', label: 'Completed' },
  CANCELLED: { variant: 'cancelled', label: 'Cancelled' },
};

interface StatusBadgeProps {
  status: AppointmentStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = MAP[status] || MAP.PENDING;
  return <Badge variant={config.variant as any} label={config.label} />;
};
