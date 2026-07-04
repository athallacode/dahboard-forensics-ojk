'use client';

import { ArrowUpRight } from 'lucide-react';
import styles from './StatCard.module.css';

interface StatCardProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  color: 'blue' | 'orange' | 'green' | 'red';
  trend?: { value: number; isPositive: boolean };
  linkText?: string;
  onLinkClick?: () => void;
  delay?: number;
}

export default function StatCard({
  value,
  label,
  icon: _icon,
  color: _color,
  trend: _trend,
  linkText = 'View All',
  onLinkClick,
  delay = 0,
}: StatCardProps) {
  return (
    <div
      className={`${styles.card} animate-fadeInUp`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={styles.body}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
      </div>
      {linkText && (
        <button className={styles.link} onClick={onLinkClick}>
          <ArrowUpRight size={14} />
          <span>{linkText}</span>
        </button>
      )}
    </div>
  );
}
