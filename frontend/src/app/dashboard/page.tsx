'use client';

import { useRouter } from 'next/navigation';
import {
  ClipboardList,
  Loader2,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import StatCard from '@/components/StatCard';
import RequestTable from '@/components/RequestTable';
import { mockDashboardStats, mockRequests } from '@/data/mock';
import styles from './page.module.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Filter requests based on role
  const visibleRequests = user?.role === 'staf_pemeriksa'
    ? mockRequests.filter((r) => r.createdBy === user.id)
    : mockRequests;

  return (
    <div className={styles.page}>
      {/* WiFi OJK Security Banner */}
      <div className={styles.securityBanner}>
        <div className={styles.securityIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
            <line x1="12" y1="20" x2="12.01" y2="20"></line>
          </svg>
        </div>
        <span>Sistem Terkoneksi (Internal WiFi OJK) - Sesuai Standar Keamanan IT</span>
      </div>

      {/* Greeting Banner */}
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <h1 className={styles.greeting}>
            <span className={styles.greetingDark}>Halo {user?.name?.split(' ')[0] || 'User'} </span>
            <span className={styles.greetingMaroon}>{user?.name?.split(' ').slice(1).join(' ') || ''}</span>
            <span className={styles.wave}>👋</span>
          </h1>
          <p className={styles.greetingSubtext}>
            Selamat datang kembali! Mari pantau progres pemeriksaan hari ini
          </p>
        </div>
        <img src="/images/flag.png" alt="Indonesian Flag" className={styles.flagImg} />
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <StatCard
          value={mockDashboardStats.totalTasks}
          label="Total Tasks"
          icon={<ClipboardList size={22} />}
          color="blue"
          delay={100}
        />
        <StatCard
          value={mockDashboardStats.inProgress}
          label="In Progress"
          icon={<Loader2 size={22} />}
          color="orange"
          delay={200}
        />
        <StatCard
          value={mockDashboardStats.completed}
          label="Completed"
          icon={<CheckCircle2 size={22} />}
          color="green"
          delay={300}
        />
        <StatCard
          value={mockDashboardStats.pending}
          label="Pending Review"
          icon={<Clock size={22} />}
          color="red"
          delay={400}
        />
      </div>

      {/* Request Table — Full Width */}
      <div className={styles.tableSection}>
        <RequestTable
          requests={visibleRequests}
          onViewAll={() => router.push('/dashboard/my-request')}
          onDetails={(req) => alert(`Detail Request #${req.requestNo}\n\n${req.useCase}\n\nStatus: ${req.status}\nDeskripsi: ${req.description}`)}
          maxRows={5}
        />
      </div>
    </div>
  );
}
