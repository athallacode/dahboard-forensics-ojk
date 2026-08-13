'use client';

import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import styles from './access-denied.module.css';

export default function AccessDeniedPage() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.logoWrapper}>
          <img
            src="/images/ojk-logo.png"
            alt="OJK Logo"
            className={styles.logo}
          />
        </div>

        <div className={styles.iconCircle}>
          <Lock size={48} className={styles.lockIcon} />
        </div>

        <h1 className={styles.title}>Akses Ditolak</h1>
        <p className={styles.message}>
          Sistem hanya dapat diakses dari jaringan internal OJK.<br />
          Silakan terhubung ke WiFi kantor.
        </p>

        <button 
          className={styles.retryBtn} 
          onClick={() => router.push('/login')}
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
