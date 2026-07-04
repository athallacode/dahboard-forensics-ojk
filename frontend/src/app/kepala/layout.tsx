'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import KepalaSidebar from '@/components/KepalaSidebar';
import Topbar from '@/components/Topbar';
import styles from '../dashboard/dashboard.module.css'; // Reuse dashboard layout styles

export default function KepalaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <KepalaSidebar />
      <div
        className={styles.mainArea}
        style={{
          marginLeft: 'var(--sidebar-width)',
        }}
      >
        <Topbar />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
