'use client';

import { useState } from 'react';
import { Search, Filter, Download, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import StatusBadge from '@/components/StatusBadge';
import { mockRequests } from '@/data/mock';
import type { ExaminationRequest, RequestStatus } from '@/types';
import styles from './myrequest.module.css';

export default function MyRequestPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [selectedRequest, setSelectedRequest] = useState<ExaminationRequest | null>(null);

  const requests = user?.role === 'staf_pemeriksa'
    ? mockRequests.filter((r) => r.createdBy === user.id)
    : user?.role === 'supervisor'
      ? mockRequests.filter((r) => r.division === user.division)
      : mockRequests;

  const filtered = requests.filter((r) => {
    const matchSearch = r.useCase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requestNo.includes(searchQuery);
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Request</h1>
          <p className={styles.subtitle}>Daftar permintaan pemeriksaan Anda</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn} id="export-requests-btn">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Cari berdasarkan use case atau nomor request..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            id="request-search"
          />
        </div>
        <div className={styles.statusFilters}>
          {(['all', 'on_progress', 'completed', 'pending', 'rejected'] as const).map((status) => (
            <button
              key={status}
              className={`${styles.filterChip} ${statusFilter === status ? styles.activeChip : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' ? 'Semua' : status === 'on_progress' ? 'On Progress' : status === 'completed' ? 'Completed' : status === 'pending' ? 'Pending' : 'Rejected'}
              {status !== 'all' && (
                <span className={styles.chipCount}>
                  {requests.filter((r) => r.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Request Cards */}
      <div className={styles.requestList}>
        {filtered.map((request, index) => (
          <div
            key={request.id}
            className={`${styles.requestCard} animate-fadeInUp`}
            style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
          >
            <div className={styles.cardLeft}>
              <div className={styles.requestNoBox}>#{request.requestNo}</div>
              <div className={styles.cardInfo}>
                <h3 className={styles.cardTitle}>{request.useCase}</h3>
                <p className={styles.cardDesc}>{request.description}</p>
                <div className={styles.cardMeta}>
                  <span>📅 {request.requestDate}</span>
                  <span>👤 {request.assignedTo}</span>
                  <span className={styles.priorityTag} data-priority={request.priority}>
                    {request.priority}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.cardRight}>
              <StatusBadge status={request.status} />
              <button
                className={styles.viewBtn}
                onClick={() => setSelectedRequest(request)}
              >
                <Eye size={16} />
                <span>Detail</span>
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className={styles.emptyState}>
            <Search size={48} strokeWidth={1} />
            <h3>Tidak ada data ditemukan</h3>
            <p>Coba ubah filter atau kata kunci pencarian Anda</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className={styles.modalOverlay} onClick={() => setSelectedRequest(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Detail Request #{selectedRequest.requestNo}</h2>
              <button className={styles.modalClose} onClick={() => setSelectedRequest(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              
              <div className={styles.requestSummary}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Use Case</span>
                  <span className={styles.summaryValue}>{selectedRequest.useCase}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Assigned To</span>
                  <span className={styles.summaryValue}>{selectedRequest.assignedTo}</span>
                </div>
              </div>

              <h3 className={styles.timelineTitle}>Progress Tracking</h3>
              <div className={styles.timeline}>
                
                {/* Step 1 */}
                <div className={`${styles.timelineItem} ${styles.completed}`}>
                  <div className={styles.timelineMarker}>
                    <div className={styles.markerCircle}></div>
                    <div className={styles.markerLine}></div>
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <h4>Request Disubmit</h4>
                      <span className={styles.timelineDate}>10 Mei 2024, 09:15</span>
                    </div>
                    <p>Permohonan baru berhasil dikirim dan menunggu verifikasi supervisor.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className={`${styles.timelineItem} ${styles.completed}`}>
                  <div className={styles.timelineMarker}>
                    <div className={styles.markerCircle}></div>
                    <div className={styles.markerLine}></div>
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <h4>Verifikasi Supervisor</h4>
                      <span className={styles.timelineDate}>12 Mei 2024, 14:30</span>
                    </div>
                    <p>Permohonan telah disetujui oleh Supervisor (Bpk. Anton).</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className={`${styles.timelineItem} ${selectedRequest.status === 'on_progress' || selectedRequest.status === 'completed' ? styles.completed : styles.current}`}>
                  <div className={styles.timelineMarker}>
                    <div className={styles.markerCircle}></div>
                    <div className={styles.markerLine}></div>
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <h4>Proses Analisa Berjalan</h4>
                      <span className={styles.timelineDate}>{selectedRequest.status === 'on_progress' || selectedRequest.status === 'completed' ? '15 Mei 2024, 10:00' : 'Menunggu'}</span>
                    </div>
                    <p>Barang bukti sedang dianalisa oleh analis yang bertugas ({selectedRequest.assignedTo}).</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className={`${styles.timelineItem} ${selectedRequest.status === 'completed' ? styles.completed : ''}`}>
                  <div className={styles.timelineMarker}>
                    <div className={styles.markerCircle}></div>
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <h4>Selesai (Completed)</h4>
                      <span className={styles.timelineDate}>{selectedRequest.status === 'completed' ? '20 Mei 2024, 16:45' : 'Menunggu'}</span>
                    </div>
                    <p>Laporan hasil pemeriksaan telah selesai dan dapat diunduh di menu Report.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
