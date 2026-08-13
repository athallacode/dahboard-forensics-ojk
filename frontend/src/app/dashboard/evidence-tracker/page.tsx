'use client';

import { useState } from 'react';
import {
  Search,
  Upload,
  FileText,
  Image as ImageIcon,
  Archive,
  Database,
  CheckCircle2,
  Clock,
  XCircle,
  Shield,
  Eye,
  Download,
  History,
  X,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { mockEvidenceFiles, mockRequests } from '@/data/mock';
import type { EvidenceFile } from '@/types';
import styles from './evidence.module.css';

const fileIcons: Record<string, React.ReactNode> = {
  'Disk Image': <Database size={20} />,
  'Archive': <Archive size={20} />,
  'Email Archive': <FileText size={20} />,
  'PDF Document': <FileText size={20} />,
  'CSV Data': <Database size={20} />,
  'Image': <ImageIcon size={20} />,
};

const statusIcons: Record<string, React.ReactNode> = {
  verified: <CheckCircle2 size={14} />,
  pending_review: <Clock size={14} />,
  rejected: <XCircle size={14} />,
};

export default function EvidenceTrackerPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showUpload, setShowUpload] = useState(false);
  const [timelineModal, setTimelineModal] = useState<EvidenceFile | null>(null);

  const isPemohon = user?.role === 'staf_pemeriksa';

  // Role scoping logic
  let evidence = mockEvidenceFiles;
  if (user?.role === 'analis_lab') {
    // Analis: hanya bukti dari kasus yang ditugaskan kepadanya
    const assignedRequestIds = mockRequests
      .filter((r) => r.assignedTo === user.name)
      .map((r) => r.id);
    evidence = mockEvidenceFiles.filter((e) =>
      assignedRequestIds.includes(e.requestId)
    );
  }
  // supervisor sees all

  const filtered = evidence.filter((e) => {
    const matchSearch = e.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.requestNo.includes(searchQuery);
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const verifiedCount = evidence.filter((e) => e.status === 'verified').length;
  const pendingCount = evidence.filter((e) => e.status === 'pending_review').length;

  // Chain of custody sesuai alur: serah terima fisik -> verifikasi -> penugasan -> akuisisi -> analisis -> review
  const mockTimeline = [
    { title: 'Request Disubmit', actor: 'M. Rizky Ramadhan — Pemohon', time: '04/07/2026, 08:15:00', done: true },
    { title: 'Serah Terima Barang Bukti Fisik', actor: 'Siti Nurhaliza — Kepala Lab (segel SEAL-2026-0142)', time: '04/07/2026, 09:10:44', done: true },
    { title: 'Verifikasi Permohonan', actor: 'Siti Nurhaliza — Kepala Lab', time: '04/07/2026, 09:30:12', done: true },
    { title: 'Ditugaskan ke SFD', actor: 'Andi Prasetyo — Manajer Teknis', time: '04/07/2026, 10:05:00', done: true },
    { title: 'Akuisisi & Imaging (hash SHA-256)', actor: 'Putri Apriani — SFD', time: '05/07/2026, 11:20:45', done: true },
    { title: 'Analisis Artefak', actor: 'Putri Apriani — SFD', time: '05/07/2026, 15:40:11', done: true },
    { title: 'Review Teknis & Pengesahan', actor: '-', time: '-', done: false },
  ];

  // Penjaga: Evidence Tracker adalah dokumen kerja internal Lab.
  // Pemohon yang membuka lewat URL diarahkan memantau lewat My Request.
  if (isPemohon) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <Shield size={48} strokeWidth={1} />
          <h3>Halaman khusus personel Lab</h3>
          <p>
            Inventaris file hasil akuisisi dikelola oleh Lab. Untuk memantau perkembangan
            pemeriksaan barang bukti Anda, buka <Link href="/dashboard/my-request"><b>My Request</b></Link>{' '}
            lalu klik Detail untuk melihat Progress Tracking.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Evidence Tracker</h1>
          <p className={styles.subtitle}>
            {isPemohon
              ? 'Pantau hasil akuisisi barang bukti yang Anda serahkan — file dibuat dan dikelola oleh Lab'
              : 'Pelacakan dan manajemen bukti digital pemeriksaan'}
          </p>
        </div>
        {/* Barang bukti diserahkan FISIK oleh pemohon; akuisisi/ekstraksi (file digital + hash)
            dilakukan personel Lab demi chain of custody. Hanya SFD yang meng-upload.
            Pemohon murni memantau: lihat rincian & riwayat — TANPA download file bukti mentah. */}
        {user?.role === 'analis_lab' && (
          <button
            className={styles.uploadBtn}
            onClick={() => setShowUpload(!showUpload)}
            id="upload-evidence-btn"
          >
            <Upload size={16} />
            <span>Upload Evidence</span>
          </button>
        )}
      </div>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <div className={styles.miniStat}>
          <span className={styles.miniStatValue}>{evidence.length}</span>
          <span className={styles.miniStatLabel}>Total Files</span>
        </div>
        <div className={styles.miniStat}>
          <span className={`${styles.miniStatValue} ${styles.verified}`}>{verifiedCount}</span>
          <span className={styles.miniStatLabel}>Verified</span>
        </div>
        <div className={styles.miniStat}>
          <span className={`${styles.miniStatValue} ${styles.pendingVal}`}>{pendingCount}</span>
          <span className={styles.miniStatLabel}>Pending Review</span>
        </div>
      </div>

      {/* Upload Zone */}
      {showUpload && (
        <div className={styles.uploadZone}>
          <div className={styles.uploadContent}>
            <Shield size={40} className={styles.shieldIcon} />
            <h3>Upload Hasil Akuisisi</h3>
            <p>File hasil akuisisi/ekstraksi barang bukti. Akan dienkripsi, di-hash (SHA-256), dan tercatat pada audit trail immutable</p>
            <div className={styles.uploadArea}>
              <Upload size={24} />
              <span>
                Drag &amp; drop atau{' '}
                <label htmlFor="evidence-file" className={styles.browseLink}>
                  pilih file
                </label>
              </span>
              <input id="evidence-file" type="file" multiple className={styles.fileInput} />
            </div>
            <div className={styles.uploadMeta}>
              <select className={styles.select} defaultValue="">
                <option value="" disabled>Pilih Request terkait...</option>
                <option value="6465">Request #6465</option>
                <option value="5665">Request #5665</option>
                <option value="1755">Request #1755</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Cari file atau nomor request..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterTabs}>
          {['all', 'verified', 'pending_review', 'rejected'].map((s) => (
            <button
              key={s}
              className={`${styles.tab} ${statusFilter === s ? styles.activeTab : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === 'all' ? 'Semua' : s === 'verified' ? 'Verified' : s === 'pending_review' ? 'Pending' : 'Rejected'}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Grid */}
      <div className={styles.evidenceGrid}>
        {filtered.map((file, index) => (
          <div
            key={file.id}
            className={`${styles.evidenceCard} animate-fadeInUp`}
            style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
          >
            {/* Top: Icon + Status */}
            <div className={styles.cardTop}>
              <div className={styles.fileIcon}>
                {fileIcons[file.fileType] || <FileText size={20} />}
              </div>
              <span className={`${styles.statusTag} ${styles[file.status]}`}>
                {statusIcons[file.status]}
                {file.status === 'verified' ? 'Verified' : file.status === 'pending_review' ? 'Pending' : 'Rejected'}
              </span>
            </div>

            {/* Middle: Filename + Meta */}
            <h4 className={styles.fileName}>{file.fileName}</h4>
            <div className={styles.fileMeta}>
              <span>{file.fileType}</span>
              <span>•</span>
              <span>{file.fileSize}</span>
            </div>

            {/* Info: Request & Version */}
            <div className={styles.fileInfo}>
              <span>Request #{file.requestNo}</span>
              <span>v{file.version}</span>
            </div>

            {/* Footer: Uploader + Actions */}
            <div className={styles.fileFooter}>
              <div className={styles.uploaderInfo}>
                <div className={styles.uploaderAvatar}>
                  {file.uploadedBy.charAt(0)}
                </div>
                <span className={styles.uploadInfoText}>
                  {file.uploadedBy.split(' ')[0]} • {file.uploadedAt}
                </span>
              </div>
              <div className={styles.fileActions}>
                <button className={styles.iconAction} title="Lihat">
                  <Eye size={14} />
                </button>
                {/* File bukti mentah bersifat sensitif — pemohon tidak boleh mengunduhnya.
                    Haknya pemohon adalah laporan hasil di menu Report. */}
                {!isPemohon && (
                  <button className={styles.iconAction} title="Download">
                    <Download size={14} />
                  </button>
                )}
                <button className={styles.iconAction} title="Riwayat Versi" onClick={() => setTimelineModal(file)}>
                  <History size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className={styles.emptyState}>
          <Database size={48} strokeWidth={1} />
          <h3>Tidak ada evidence ditemukan</h3>
          <p>{isPemohon ? 'Hasil akuisisi akan muncul di sini setelah Lab memproses barang bukti Anda' : 'Upload hasil akuisisi baru atau ubah filter pencarian'}</p>
        </div>
      )}

      {/* Timeline Modal */}
      {timelineModal && (
        <div className={styles.modalOverlay} onClick={() => setTimelineModal(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Detail Riwayat Evidence</h2>
              <button className={styles.closeBtn} onClick={() => setTimelineModal(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.modalSubHeader}>
              <h4>{timelineModal.fileName}</h4>
              <p>Request #{timelineModal.requestNo} • v{timelineModal.version}</p>
            </div>

            <div className={styles.timelineContainer}>
              {mockTimeline.map((step, idx) => (
                <div key={idx} className={styles.timelineItem}>
                  <div className={styles.timelineIcon}>
                    {step.done ? <div className={styles.dotFilled} /> : <div className={styles.dotHollow} />}
                    {idx < mockTimeline.length - 1 && <div className={styles.timelineLine} />}
                  </div>
                  <div className={styles.timelineContent}>
                    <h5 className={`${styles.stepTitle} ${!step.done ? styles.textMuted : ''}`}>{step.title}</h5>
                    {step.done && (
                      <>
                        <p className={styles.stepActor}>oleh {step.actor}</p>
                        <p className={styles.stepTime}>{step.time}</p>
                        <div className={styles.immutableBadge}>
                          <ShieldCheck size={12} />
                          Immutable Log | SHA-256 Verified
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
