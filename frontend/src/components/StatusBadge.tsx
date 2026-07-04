'use client';

import styles from './StatusBadge.module.css';
import type { RequestStatus } from '@/types';

interface StatusBadgeProps {
  status: RequestStatus;
  size?: 'sm' | 'md';
}

const statusLabels: Record<RequestStatus, string> = {
  completed: 'Completed',
  on_progress: 'On Progress',
  pending: 'Pending',
  rejected: 'Rejected',
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[status]} ${styles[size]}`}>
      <span className={styles.dot} />
      <span>{statusLabels[status]}</span>
    </span>
  );
}
