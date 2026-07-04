'use client';

import { useState } from 'react';
import { Search, Download, FileText, CheckCircle2, FileDown } from 'lucide-react';
import styles from './report.module.css';
import { mockRequests } from '@/data/mock';

export default function ReportPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Only show completed requests that have a report available
  const completedReports = mockRequests
    .filter(req => req.status === 'completed' || req.status === 'on_progress') // Mock data might not have enough completed, but let's filter completed only.
    .map((req, idx) => ({
      id: req.id,
      requestNo: req.requestNo,
      useCase: req.useCase,
      requester: req.assignedTo,
      dateCompleted: req.status === 'completed' ? '20 Mei 2024' : 'N/A', // Mocking completion date
      fileSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      status: req.status
    })).filter(req => req.status === 'completed');

  const filtered = completedReports.filter((r) => 
    r.useCase.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.requestNo.includes(searchQuery)
  );

  return (
    <div className={styles.page}>
      
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Report Dokumen Hasil</h1>
          <p className={styles.subtitle}>Unduh laporan hasil pengajuan pemeriksaan yang telah selesai</p>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Cari berdasarkan nomor request atau nama pengajuan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.reportList}>
        {filtered.map((report, index) => (
          <div key={report.id} className={styles.reportCard}>
            
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

            <div className={styles.cardRight}>
              <div className={styles.statusBadge}>
                <CheckCircle2 size={16} />
                <span>Completed</span>
              </div>
              <button className={styles.downloadBtn} onClick={() => alert(`Mendownload laporan untuk Request #${report.requestNo}...`)}>
                <FileDown size={18} />
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
