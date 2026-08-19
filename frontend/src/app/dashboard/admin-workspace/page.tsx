'use client';

import { useState } from 'react';
import { Package, PackageCheck, ShieldAlert, CheckCircle2, Archive, ClipboardList, TrendingUp } from 'lucide-react';
import { mockRequests } from '@/data/mock';
import type { ExaminationRequest } from '@/types';
import styles from './admin.module.css';

export default function AdminWorkspacePage() {
  const [requests, setRequests] = useState<ExaminationRequest[]>(mockRequests);

  const pendingVerification = requests.filter(r => r.status === 'pending_admin_verification');
  const readyForPickup = requests.filter(r => r.status === 'ready_for_pickup');
  const completed = requests.filter(r => r.status === 'completed');
  const allPhysical = requests.filter(r => r.status !== 'action_required');

  const handleVerify = (id: string) => {
    // In a real app, this would call an API
    setRequests(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'pending_review' } : r
    ));
    alert('Barang fisik berhasil diverifikasi dan diserahkan ke sistem!');
  };

  const handleReturn = (id: string) => {
    // In a real app, this would call an API
    setRequests(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'completed' } : r
    ));
    alert('Barang bukti fisik telah dikembalikan ke pemohon.');
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Logistik Fisik (Admin Lab)</h1>
        <p className={styles.subtitle}>
          Kelola serah terima dan pengembalian barang bukti fisik dari dan ke pemohon.
        </p>
      </div>

      {/* Stats Row */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--color-primary-100)', color: 'var(--color-primary-600)' }}>
            <ClipboardList size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Total Register Fisik</h3>
            <p>{allPhysical.length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--color-warning-100)', color: 'var(--color-warning-600)' }}>
            <Package size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Menunggu Fisik</h3>
            <p>{pendingVerification.length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#d1fae5', color: '#059669' }}>
            <PackageCheck size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Siap Dikembalikan</h3>
            <p>{readyForPickup.length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--color-neutral-100)', color: 'var(--color-neutral-600)' }}>
            <Archive size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Telah Selesai</h3>
            <p>{completed.length}</p>
          </div>
        </div>
      </div>

      <div className={styles.tableSection}>
        <h2 className={styles.sectionTitle}>
          <Package className={styles.icon} size={20} />
          Menunggu Penerimaan Fisik
        </h2>
        <p className={styles.subtitle} style={{marginBottom: '16px'}}>
          Pemohon telah mensubmit permohonan di sistem. Harap verifikasi kelengkapan barang fisik.
        </p>
        
        {pendingVerification.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No Request</th>
                  <th>Use Case</th>
                  <th>Tanggal Submit</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pendingVerification.map(req => (
                  <tr key={req.id}>
                    <td><span className={styles.primaryText}>{req.requestNo}</span></td>
                    <td>
                      <span className={styles.primaryText}>{req.useCase}</span>
                      <span className={styles.secondaryText}>{req.description.substring(0, 50)}...</span>
                    </td>
                    <td>{req.requestDate}</td>
                    <td>
                      <button 
                        className={styles.actionBtn}
                        onClick={() => handleVerify(req.id)}
                      >
                        Terima & Verifikasi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <ShieldAlert size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
            <p>Tidak ada barang fisik yang menunggu untuk diterima saat ini.</p>
          </div>
        )}
      </div>

      <div className={styles.tableSection} style={{ marginTop: '24px' }}>
        <h2 className={styles.sectionTitle}>
          <PackageCheck className={styles.icon} size={20} />
          Barang Siap Dikembalikan
        </h2>
        <p className={styles.subtitle} style={{marginBottom: '16px'}}>
          Pemeriksaan telah selesai. Barang bukti fisik siap diserahkan kembali ke pemohon.
        </p>
        
        {readyForPickup.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No Request</th>
                  <th>Use Case</th>
                  <th>Divisi Pemohon</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {readyForPickup.map(req => (
                  <tr key={req.id}>
                    <td><span className={styles.primaryText}>{req.requestNo}</span></td>
                    <td><span className={styles.primaryText}>{req.useCase}</span></td>
                    <td><span className={styles.secondaryText}>{req.division}</span></td>
                    <td>
                      <button 
                        className={`${styles.actionBtn} ${styles.returnBtn}`}
                        onClick={() => handleReturn(req.id)}
                      >
                        Kembalikan Barang
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <CheckCircle2 size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
            <p>Tidak ada barang yang siap untuk dikembalikan.</p>
          </div>
        )}
      </div>

    </div>
  );
}
