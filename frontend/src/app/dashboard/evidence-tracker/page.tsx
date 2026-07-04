'use client';

import { useState } from 'react';
import {
  Search,
  Upload,
  FileText,
  Image,
  Archive,
  Database,
  CheckCircle2,
  Clock,
  XCircle,
  Shield,
  Eye,
  Download,
  History,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { mockEvidenceFiles } from '@/data/mock';
import type { EvidenceFile } from '@/types';
import styles from './evidence.module.css';

const fileIcons: Record<string, React.ReactNode> = {
  'Disk Image': <Database size={20} />,
  'Archive': <Archive size={20} />,
  'Email Archive': <FileText size={20} />,
  'PDF Document': <FileText size={20} />,
  'CSV Data': <Database size={20} />,
  'Image': <Image size={20} />,
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

  const evidence = user?.role === 'staf_pemeriksa'
    ? mockEvidenceFiles.filter((e) => e.uploadedBy === user.name)
    : mockEvidenceFiles;

  const filtered = evidence.filter((e) => {
    const matchSearch = e.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.requestNo.includes(searchQuery);
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Evidence Tracker</h1>
          <p className={styles.subtitle}>Pelacakan dan manajemen bukti digital pemeriksaan</p>
        </div>
        <button className={styles.uploadBtn} onClick={() => setShowUpload(!showUpload)} id="upload-evidence-btn">
          <Upload size={16} />
          <span>Upload Evidence</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <div className={styles.miniStat}>
          <span className={styles.miniStatValue}>{evidence.length}</span>
          <span className={styles.miniStatLabel}>Total Files</span>
        </div>
        <div className={styles.miniStat}>
          <span className={`${styles.miniStatValue} ${styles.verified}`}>{evidence.filter((e) => e.status === 'verified').length}</span>
          <span className={styles.miniStatLabel}>Verified</span>
        </div>
        <div className={styles.miniStat}>
          <span className={`${styles.miniStatValue} ${styles.pendingVal}`}>{evidence.filter((e) => e.status === 'pending_review').length}</span>
          <span className={styles.miniStatLabel}>Pending Review</span>
        </div>
      </div>

      {/* Upload Zone */}
      {showUpload && (
        <div className={styles.uploadZone}>
          <div className={styles.uploadContent}>
            <Shield size={40} />
            <h3>Upload Bukti Digital</h3>
            <p>File akan dienkripsi dan disimpan dengan audit trail immutable</p>
            <div className={styles.uploadArea}>
              <Upload size={24} />
              <span>Drag & drop atau <label htmlFor="evidence-file" className={styles.browseLink}>pilih file</label></span>
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

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Cari file atau nomor request..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            id="evidence-search"
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
            <div className={styles.cardTop}>
              <div className={styles.fileIcon}>
                {fileIcons[file.fileType] || <FileText size={20} />}
              </div>
              <span className={`${styles.statusTag} ${styles[file.status]}`}>
                {statusIcons[file.status]}
                {file.status === 'verified' ? 'Verified' : file.status === 'pending_review' ? 'Pending' : 'Rejected'}
              </span>
            </div>
            <h4 className={styles.fileName}>{file.fileName}</h4>
            <div className={styles.fileMeta}>
              <span>{file.fileType}</span>
              <span>•</span>
              <span>{file.fileSize}</span>
            </div>
            <div className={styles.fileInfo}>
              <span>Request #{file.requestNo}</span>
              <span>v{file.version}</span>
            </div>
            <div className={styles.fileFooter}>
              <span className={styles.uploadInfo}>
                {file.uploadedBy.split(' ')[0]} • {file.uploadedAt}
              </span>
              <div className={styles.fileActions}>
                <button className={styles.iconAction} title="Lihat">
                  <Eye size={14} />
                </button>
                <button className={styles.iconAction} title="Download">
                  <Download size={14} />
                </button>
                <button className={styles.iconAction} title="Riwayat Versi">
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
          <p>Upload bukti digital baru atau ubah filter pencarian</p>
        </div>
      )}
    </div>
  );
}
