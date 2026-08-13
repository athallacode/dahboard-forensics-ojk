'use client';

import { useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Eye,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './report-review.module.css';

// Review dua tahap (ISO/IEC 17025):
// 'pending'       : draft SFD menunggu review teknis Manajer Teknis
// 'tech_approved' : lolos teknis, menunggu pengesahan Kepala Lab
// 'approved'      : disahkan Kepala Lab, terbit ke pemohon
// 'rejected'      : dikembalikan untuk revisi
type ReportStatus = 'pending' | 'tech_approved' | 'approved' | 'rejected';

type ReportItem = {
  id: string;
  title: string;
  requestNo: string;
  analyst: string;
  date: string;
  status: ReportStatus;
  rejectNote?: string;
};

const initialReports: ReportItem[] = [
  { id: '1', title: 'Laporan Analisis Forensik Mobile Samsung A52', requestNo: 'REQ-2026-7801', analyst: 'Putri Apriani', date: '04 Juli 2026, 15:30', status: 'pending' },
  { id: '2', title: 'Hasil Akuisisi Disk Image Server XYZ', requestNo: 'REQ-2026-6465', analyst: 'Putri Apriani', date: '05 Juli 2026, 09:15', status: 'tech_approved' },
  { id: '3', title: 'Log Parsing Aplikasi SI-Keuangan', requestNo: 'REQ-2026-9021', analyst: 'Haniefah Muslimah', date: '05 Juli 2026, 11:45', status: 'pending' },
];

export default function ReportReviewPage() {
  const { user } = useAuth();
  const isTechManager = user?.role === 'manajer_teknis';
  const isSupervisor = user?.role === 'supervisor';
  const [reports, setReports] = useState<ReportItem[]>(initialReports);

  // Reject Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Manajer Teknis: review teknis (pending -> tech_approved)
  const handleTechApprove = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'tech_approved' } : r));
  };

  // Kepala Lab: pengesahan akhir (tech_approved -> approved)
  const handleEndorse = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };

  const handleRejectClick = (id: string) => {
    setSelectedReportId(id);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const submitReject = () => {
    if (!selectedReportId) return;
    setReports(prev => prev.map(r => 
      r.id === selectedReportId ? { ...r, status: 'rejected', rejectNote: rejectReason } : r
    ));
    setRejectModalOpen(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{isTechManager ? 'Review Teknis Laporan' : 'Pengesahan Laporan'}</h1>
        <p className={styles.subtitle}>
          {isTechManager
            ? 'Nilai kelayakan teknis draft laporan SFD: validasi metode, akurasi hasil, kesesuaian standar. Laporan yang lolos naik ke Kepala Lab.'
            : 'Sahkan laporan yang telah lolos review teknis Manajer Teknis. Laporan yang disahkan otomatis terbit ke Arsip Laporan.'}
        </p>
      </div>

      <div className={styles.listContainer}>
        {reports.map((report) => (
          <div key={report.id} className={styles.card}>
            <div className={styles.cardLeft}>
              <div className={styles.iconBox}>
                <FileText size={28} />
              </div>
              <div className={styles.infoBox}>
                <div className={styles.titleRow}>
                  <h3 className={styles.reportTitle}>{report.title}</h3>
                  {report.status === 'pending' && <span className={`${styles.badge} ${styles.badgePending}`}>Menunggu Review Teknis</span>}
                  {report.status === 'tech_approved' && <span className={`${styles.badge} ${styles.badgeTech}`}>Lolos Teknis — Menunggu Pengesahan</span>}
                  {report.status === 'approved' && <span className={`${styles.badge} ${styles.badgeApproved}`}>Disahkan — diterbitkan ke pemohon</span>}
                  {report.status === 'rejected' && <span className={`${styles.badge} ${styles.badgeRejected}`}>Revisi</span>}
                </div>
                
                <div className={styles.metaRow}>
                  <span className={styles.reqNo}>#{report.requestNo}</span>
                  <span>•</span>
                  <span>SFD: <strong>{report.analyst}</strong></span>
                  <span>•</span>
                  <span>Disubmit: {report.date}</span>
                </div>

                {report.status === 'rejected' && report.rejectNote && (
                  <div className={styles.rejectNoteBox}>
                    <AlertCircle size={14} />
                    <span><strong>Catatan Revisi:</strong> {report.rejectNote}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.cardRight}>
              <button className={styles.viewPdfBtn} onClick={() => alert('Membuka PDF viewer (Mock)')}>
                <Eye size={16} /> Lihat PDF
              </button>
              
              {report.status === 'pending' && isTechManager && (
                <>
                  <button className={styles.approveBtn} onClick={() => handleTechApprove(report.id)}>
                    <CheckCircle size={16} /> Setujui Teknis
                  </button>
                  <button className={styles.rejectBtn} onClick={() => handleRejectClick(report.id)}>
                    <XCircle size={16} /> Minta Revisi
                  </button>
                </>
              )}
              {report.status === 'tech_approved' && isSupervisor && (
                <>
                  <button className={styles.approveBtn} onClick={() => handleEndorse(report.id)}>
                    <CheckCircle size={16} /> Sahkan &amp; Terbitkan
                  </button>
                  <button className={styles.rejectBtn} onClick={() => handleRejectClick(report.id)}>
                    <XCircle size={16} /> Reject
                  </button>
                </>
              )}
              {report.status === 'pending' && isSupervisor && (
                <span className={styles.waitNote}>Menunggu review teknis</span>
              )}
              {report.status === 'tech_approved' && isTechManager && (
                <span className={styles.waitNote}>Menunggu pengesahan Kepala Lab</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Kembalikan untuk Revisi (Reject)</h3>
            <p className={styles.modalSubtitle}>Berikan catatan detail bagian mana yang harus diperbaiki oleh analis.</p>
            <textarea 
              className={styles.textarea} 
              rows={5} 
              placeholder="Catatan revisi..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setRejectModalOpen(false)}>Batal</button>
              <button 
                className={styles.confirmRejectBtn} 
                onClick={submitReject}
                disabled={!rejectReason.trim()}
              >
                Kirim Revisi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
