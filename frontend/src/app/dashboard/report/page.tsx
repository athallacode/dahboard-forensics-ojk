'use client';

import { useState } from 'react';
import { Search, FileText, CheckCircle2, FileDown } from 'lucide-react';
import styles from './report.module.css';
import { mockRequests } from '@/data/mock';

export default function ReportPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const completedReports = mockRequests
    .filter(req => req.status === 'completed')
    .map((req) => ({
      id: req.id,
      requestNo: req.requestNo,
      useCase: req.useCase,
      requester: req.assignedTo,
      dateCompleted: '20 Mei 2024',
      fileSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      status: req.status,
    }));

  // If no completed reports from mock, provide fallback data for UI display
  const reports = completedReports.length > 0 ? completedReports : [
    {
      id: '1',
      requestNo: '6465',
      useCase: 'Pemeriksaan Perangkat Handphone',
      requester: 'M. Rizky Ramadhan',
      dateCompleted: '20 Mei 2024',
      fileSize: '1.3 MB',
      status: 'completed' as const,
    },
    {
      id: '2',
      requestNo: '5665',
      useCase: 'Pemeriksaan Perangkat Komputer',
      requester: 'Putri Apriani',
      dateCompleted: '18 Mei 2024',
      fileSize: '2.1 MB',
      status: 'completed' as const,
    },
    {
      id: '3',
      requestNo: '1755',
      useCase: 'Pemeriksaan Komunikasi Digital',
      requester: 'Haniefah Muslimah',
      dateCompleted: '15 Mei 2024',
      fileSize: '4.7 MB',
      status: 'completed' as const,
    },
    {
      id: '4',
      requestNo: '3201',
      useCase: 'Validasi Dokumen Elektronik',
      requester: 'Ahmad Fauzi',
      dateCompleted: '10 Mei 2024',
      fileSize: '1.8 MB',
      status: 'completed' as const,
    },
  ];

  const filtered = reports.filter((r) =>
    r.useCase.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.requestNo.includes(searchQuery)
  );

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Report Dokumen Hasil</h1>
        <p className={styles.subtitle}>Unduh laporan hasil pengajuan pemeriksaan yang telah selesai</p>
      </div>

      {/* Search Bar */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Cari berdasarkan nomor request atau nama pengajuan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            id="report-search"
          />
        </div>
      </div>

      {/* Report List */}
      <div className={styles.reportList}>
        {filtered.map((report) => (
          <div key={report.id} className={styles.reportCard}>

            {/* Left: Icon + Info */}
            <div className={styles.cardLeft}>
              <div className={styles.iconBox}>
                <FileText size={24} />
              </div>
              <div className={styles.reportInfo}>
                <h3 className={styles.reportTitle}>{report.useCase}</h3>
                <div className={styles.reportMeta}>
                  <span className={styles.reqNo}>Request #{report.requestNo}</span>
                  <span className={styles.divider}>•</span>
                  <span className={styles.dateCompleted}>Selesai pada: {report.dateCompleted}</span>
                </div>
              </div>
            </div>

            {/* Right: Badge + Download */}
            <div className={styles.cardRight}>
              <div className={styles.statusBadge}>
                <CheckCircle2 size={14} />
                <span>Completed</span>
              </div>
              <button
                className={styles.downloadBtn}
                onClick={() => alert(`Mendownload laporan untuk Request #${report.requestNo}...`)}
              >
                <FileDown size={16} />
                <span>Download ({report.fileSize})</span>
              </button>
            </div>

          </div>
        ))}

        {filtered.length === 0 && (
          <div className={styles.emptyState}>
            <FileText size={48} className={styles.emptyIcon} />
            <h3>Tidak ada laporan hasil</h3>
            <p>Belum ada pengajuan yang selesai atau kriteria pencarian tidak cocok.</p>
          </div>
        )}
      </div>

    </div>
  );
}
