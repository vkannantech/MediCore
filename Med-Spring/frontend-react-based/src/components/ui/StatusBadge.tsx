import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type StatusType = 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'PENDING' | 'COMPLETED';

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType;
}

const statusStyles: Record<StatusType, string> = {
  ACTIVE: 'bg-eucalyptus/15 text-eucalyptus border border-eucalyptus/30',
  COMPLETED: 'bg-eucalyptus/15 text-eucalyptus border border-eucalyptus/30',
  EXPIRED: 'bg-mist/15 text-mist border border-mist/30',
  REVOKED: 'bg-coral/15 text-coral border border-coral/30',
  PENDING: 'bg-gold/15 text-gold border border-gold/30',
};

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase',
        statusStyles[status],
        className
      )}
      {...props}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  );
}
