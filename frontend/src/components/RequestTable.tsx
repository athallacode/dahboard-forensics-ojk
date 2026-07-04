'use client';

import { useState } from 'react';
import { SlidersHorizontal, ExternalLink } from 'lucide-react';
import StatusBadge from './StatusBadge';
import type { ExaminationRequest, RequestStatus } from '@/types';
import styles from './RequestTable.module.css';

interface RequestTableProps {
  requests: ExaminationRequest[];
  title?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
  onDetails?: (request: ExaminationRequest) => void;
  maxRows?: number;
}

export default function RequestTable({
  requests,
  title = 'Permintaan Aktif',
  showViewAll = true,
  onViewAll,
  onDetails,
  maxRows,
}: RequestTableProps) {
  const [filter, setFilter] = useState<RequestStatus | 'all'>('all');
  const [showFilter, setShowFilter] = useState(false);

  const filtered = filter === 'all'
    ? requests
    : requests.filter((r) => r.status === filter);

  const displayed = maxRows ? filtered.slice(0, maxRows) : filtered;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.actions}>
          <div className={styles.filterContainer}>
            <button
              className={styles.filterBtn}
              onClick={() => setShowFilter(!showFilter)}
              id="table-filter-btn"
            >
              <SlidersHorizontal size={16} />
              <span>Filter</span>
            </button>
            {showFilter && (
              <div className={styles.filterDropdown}>
                {['all', 'completed', 'on_progress', 'pending', 'rejected'].map((s) => (
                  <button
                    key={s}
                    className={`${styles.filterOption} ${filter === s ? styles.activeFilter : ''}`}
                    onClick={() => { setFilter(s as RequestStatus | 'all'); setShowFilter(false); }}
                  >
                    {s === 'all' ? 'Semua' : s === 'on_progress' ? 'On Progress' : s === 'completed' ? 'Completed' : s === 'pending' ? 'Pending' : 'Rejected'}
                  </button>
                ))}
              </div>
            )}
          </div>
          {showViewAll && (
            <button className={styles.viewAllBtn} onClick={onViewAll}>
              View All
            </button>
          )}
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Request No.</th>
              <th>Use Case</th>
              <th>Request Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((request, index) => (
              <tr key={request.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                <td className={styles.rowNum}>{String(index + 1).padStart(2, '0')}</td>
                <td>
                  <span className={styles.requestNo}>{request.requestNo}</span>
                </td>
                <td className={styles.useCase}>{request.useCase}</td>
                <td className={styles.date}>{request.requestDate}</td>
                <td>
                  <StatusBadge status={request.status} />
                </td>
                <td>
                  <button
                    className={styles.detailsBtn}
                    onClick={() => onDetails?.(request)}
                    id={`details-btn-${request.id}`}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
            {displayed.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.emptyState}>
                  Tidak ada data yang ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
