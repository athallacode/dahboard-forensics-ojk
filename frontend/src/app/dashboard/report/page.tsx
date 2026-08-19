'use client';

import { useState } from 'react';
import { Search, FileText, CheckCircle2, FileDown, Filter, AlertCircle, Clock } from 'lucide-react';
import styles from './report.module.css';
import { useAuth } from '@/context/AuthContext';

// Mock data representing the "database" of reports
const allReports = [
  { id: '1', requestNo: 'REQ-2026-6465', title: 'Laporan Analisis Forensik Smartphone Samsung', useCase: 'Pemeriksaan Perangkat Handphone', requester: 'M. Rizky Ramadhan', analyst: 'Putri Apriani', dateSubmitted: '20 Mei 2026', fileSize: '1.3 MB', status: 'approved' },
  { id: '2', requestNo: 'REQ-2026-5665', title: 'Laporan Akuisisi Disk PC Kantor', useCase: 'Pemeriksaan Perangkat Komputer', requester: 'M. Rizky Ramadhan', analyst: 'Haniefah Muslimah', dateSubmitted: '18 Mei 2026', fileSize: '2.1 MB', status: 'pending' },
  { id: '3', requestNo: 'REQ-2026-1755', title: 'Laporan Log Parsing SI-Keuangan', useCase: 'Pemeriksaan Komunikasi Digital', requester: 'Siti Aminah', analyst: 'Haniefah Muslimah', dateSubmitted: '15 Mei 2026', fileSize: '4.7 MB', status: 'rejected' },
  { id: '4', requestNo: 'REQ-2026-3201', title: 'Laporan Validasi PDF Bukti Transfer', useCase: 'Validasi Dokumen Elektronik', requester: 'M. Rizky Ramadhan', analyst: 'Putri Apriani', dateSubmitted: '10 Mei 2026', fileSize: '1.8 MB', status: 'approved' },
];

export default function ReportPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [analystFilter, setAnalystFilter] = useState('all');

  const role = user?.role || 'staf_pemeriksa';
  const userName = user?.name || '';

  // Scoping logic based on role
  let visibleReports = allReports;
  
  if (role === 'staf_pemeriksa') {
    // Only see OWN reports that are APPROVED (Completed)
    visibleReports = allReports.filter(r => r.requester === userName && r.status === 'approved');
  } else if (role === 'analis_lab') {
    // Only see reports authored by them
    visibleReports = allReports.filter(r => r.analyst === userName);
  } else if (role === 'supervisor') {
    // Sees all reports
    if (analystFilter !== 'all') {
      visibleReports = visibleReports.filter(r => r.analyst === analystFilter);
    }
  }

  // Common Search Filter
  const filtered = visibleReports.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.requestNo.includes(searchQuery)
  );

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Report Dokumen Hasil</h1>
        <p className={styles.subtitle}>Arsip laporan hasil pemeriksaan forensik yang telah diterbitkan — siap diunduh</p>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Cari nomor request atau judul laporan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {role === 'supervisor' && (
          <div className={styles.filterBox}>
            <Filter size={18} className={styles.filterIcon} />
            <select 
              className={styles.filterSelect}
              value={analystFilter}
              onChange={(e) => setAnalystFilter(e.target.value)}
            >
              <option value="all">Semua Analis</option>
              <option value="Putri Apriani">Putri Apriani</option>
              <option value="M. Rizky Ramadhan">M. Rizky Ramadhan</option>
              <option value="Haniefah Muslimah">Haniefah Muslimah</option>
            </select>
          </div>
        )}
      </div>

      {/* Report List */}
      <div className={styles.reportList}>
        {filtered.map((report) => (
          <div key={report.id} className={styles.reportCard}>
            
            {/* Left Info */}
            <div className={styles.cardLeft}>
              <div className={styles.iconBox}>
                <FileText size={24} />
              </div>
              <div className={styles.reportInfo}>
                <div className={styles.titleRow}>
                  <h3 className={styles.reportTitle}>{report.title}</h3>
                  
                  {/* Supervisor and Analis see statuses */}
                  {(role === 'supervisor' || role === 'analis_lab') && (
                    <>
                      {report.status === 'pending' && <span className={`${styles.badge} ${styles.badgePending}`}><Clock size={12}/> Pending Review</span>}
                      {report.status === 'approved' && <span className={`${styles.badge} ${styles.badgeApproved}`}><CheckCircle2 size={12}/> Approved</span>}
                      {report.status === 'rejected' && <span className={`${styles.badge} ${styles.badgeRejected}`}><AlertCircle size={12}/> Revisi</span>}
                    </>
                  )}
                </div>

                <div className={styles.reportMeta}>
                  <span className={styles.reqNo}>{report.requestNo}</span>
                  <span className={styles.divider}>•</span>
                  <span><strong>{report.useCase}</strong></span>
                  <span className={styles.divider}>•</span>
                  <span>Disubmit: {report.dateSubmitted}</span>
                  
                  {role === 'supervisor' && (
                    <>
                      <span className={styles.divider}>•</span>
                      <span>Analis: <strong>{report.analyst}</strong></span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className={styles.cardRight}>
              {/* Staf Pemeriksa sees Download */}
              {role === 'staf_pemeriksa' && (
                <button
                  className={styles.downloadBtn}
                  onClick={() => alert(`Mendownload ${report.title}...`)}
                >
                  <FileDown size={16} />
                  <span>Download ({report.fileSize})</span>
                </button>
              )}

              {/* Analis Lab can download their own approved reports or edit pending ones */}
              {role === 'analis_lab' && report.status === 'approved' && (
                <button
                  className={styles.downloadBtn}
                  onClick={() => alert(`Mendownload Final PDF...`)}
                >
                  <FileDown size={16} /> Final PDF ({report.fileSize})
                </button>
              )}

              {/* Supervisor actions are managed in Report Review page, here they just see/download */}
              {role === 'supervisor' && (
                <button
                  className={styles.viewBtn}
                  onClick={() => alert(`Membuka PDF viewer...`)}
                >
                  Lihat File ({report.fileSize})
                </button>
              )}
            </div>

          </div>
        ))}

        {filtered.length === 0 && (
          <div className={styles.emptyState}>
            <FileText size={48} className={styles.emptyIcon} />
            <h3>Tidak ada laporan ditemukan</h3>
            <p>Kriteria pencarian tidak cocok atau Anda belum memiliki akses ke laporan mana pun.</p>
          </div>
        )}
      </div>

    </div>
  );
}
