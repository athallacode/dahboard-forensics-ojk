'use client';

import { useRouter } from 'next/navigation';
import {
  ClipboardList,
  Loader2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BarChart3,
  Timer,
  Microscope,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import StatCard from '@/components/StatCard';
import RequestTable from '@/components/RequestTable';
import { mockDashboardStats, mockRequests } from '@/data/mock';
import styles from './page.module.css';

/* ============================================
   ROLE-BASED DASHBOARD VIEWS
   ============================================ */

// ---- Staf Pemeriksa (Pemohon) Dashboard ----
function StafPemeriksaDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const myRequests = mockRequests.filter((r) => r.createdBy === user?.id);
  const myInProgress = myRequests.filter((r) => r.status === 'on_progress').length;
  const myCompleted = myRequests.filter((r) => r.status === 'completed').length;
  const myPending = myRequests.filter((r) => r.status === 'pending').length;

  return (
    <>
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <StatCard
          value={myRequests.length}
          label="My Total Requests"
          icon={<ClipboardList size={22} />}
          color="blue"
          delay={100}
        />
        <StatCard
          value={myInProgress}
          label="In Progress"
          icon={<Loader2 size={22} />}
          color="orange"
          delay={200}
        />
        <StatCard
          value={myCompleted}
          label="Completed"
          icon={<CheckCircle2 size={22} />}
          color="green"
          delay={300}
        />
        <StatCard
          value={myPending}
          label="Action Required"
          icon={<AlertTriangle size={22} />}
          color="red"
          delay={400}
        />
      </div>

      {/* Request Table */}
      <div className={styles.tableSection}>
        <RequestTable
          requests={myRequests}
          title="Permintaan Saya (My Active Requests)"
          onViewAll={() => router.push('/dashboard/my-request')}
          onDetails={(req) => alert(`Detail Request #${req.requestNo}\n\n${req.useCase}\n\nStatus: ${req.status}\nDeskripsi: ${req.description}`)}
          maxRows={5}
        />
      </div>
    </>
  );
}

// ---- Supervisor (Kepala Lab) Dashboard ----
function SupervisorDashboard() {
  const router = useRouter();

  const totalTasks = mockDashboardStats.totalTasks;
  const inProgress = mockRequests.filter((r) => r.status === 'on_progress').length;
  const completed = mockRequests.filter((r) => r.status === 'completed').length;

  return (
    <>
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <StatCard
          value={totalTasks}
          label="Total Lab Tasks"
          icon={<ClipboardList size={22} />}
          color="blue"
          delay={100}
        />
        <StatCard
          value={inProgress}
          label="In Progress"
          icon={<Loader2 size={22} />}
          color="orange"
          delay={200}
        />
        <StatCard
          value={completed}
          label="Completed"
          icon={<CheckCircle2 size={22} />}
          color="green"
          delay={300}
        />
        <StatCard
          value={10}
          label="Avg. SLA (Days)"
          icon={<Timer size={22} />}
          color="red"
          delay={400}
        />
      </div>

      {/* Overview Table — All Requests */}
      <div className={styles.tableSection}>
        <RequestTable
          requests={mockRequests}
          title="Overview Lab — Semua Permintaan"
          onViewAll={() => router.push('/dashboard/workload-monitoring')}
          onDetails={(req) => alert(`Detail Request #${req.requestNo}\n\n${req.useCase}\n\nAssigned: ${req.assignedTo}\nStatus: ${req.status}`)}
          maxRows={5}
        />
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <button
          className={styles.quickActionBtn}
          onClick={() => router.push('/dashboard/workload-monitoring')}
        >
          <BarChart3 size={18} />
          <span>Workload Monitoring</span>
          <ArrowRight size={16} />
        </button>
        <button
          className={styles.quickActionBtn}
          onClick={() => router.push('/dashboard/case-assignment')}
        >
          <ClipboardList size={18} />
          <span>Case Assignment</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </>
  );
}

// ---- Analis Lab (Pemeriksa) Dashboard ----
function AnalisLabDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  // Cases assigned to this analyst
  const assignedCases = mockRequests.filter((r) => r.assignedTo === user?.name);
  const pendingReview = assignedCases.filter((r) => r.status === 'pending').length;
  const completedByMe = assignedCases.filter((r) => r.status === 'completed').length;
  const highPriority = assignedCases.filter((r) => r.priority === 'high').length;

  return (
    <>
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <StatCard
          value={assignedCases.length}
          label="My Assigned Cases"
          icon={<Microscope size={22} />}
          color="blue"
          delay={100}
        />
        <StatCard
          value={pendingReview}
          label="Pending Review"
          icon={<Clock size={22} />}
          color="orange"
          delay={200}
        />
        <StatCard
          value={completedByMe}
          label="Completed by Me"
          icon={<CheckCircle2 size={22} />}
          color="green"
          delay={300}
        />
        <StatCard
          value={highPriority}
          label="High Priority"
          icon={<AlertTriangle size={22} />}
          color="red"
          delay={400}
        />
      </div>

      {/* Assigned Cases Table */}
      <div className={styles.tableSection}>
        <RequestTable
          requests={assignedCases}
          title="Kasus Dalam Penanganan Saya (My Assigned Tasks)"
          onViewAll={() => router.push('/dashboard/assigned-cases')}
          onDetails={(req) => alert(`Open Workspace for Request #${req.requestNo}\n\n${req.useCase}\n\nPriority: ${req.priority}\nStatus: ${req.status}`)}
          maxRows={5}
        />
      </div>
    </>
  );
}

/* ============================================
   MAIN DASHBOARD PAGE
   ============================================ */
export default function DashboardPage() {
  const { user } = useAuth();

  // Role-specific greeting
  const greetingSubtext = (() => {
    switch (user?.role) {
      case 'staf_pemeriksa':
        return 'Mari pantau status permintaan pemeriksaan Anda';
      case 'supervisor':
        return 'Pantau kinerja dan beban kerja tim laboratorium';
      case 'analis_lab':
        return 'Kelola kasus yang ditugaskan dan lanjutkan analisis';
      default:
        return 'Selamat datang kembali!';
    }
  })();

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
            {greetingSubtext}
          </p>
        </div>
        <img src="/images/flag.png" alt="Indonesian Flag" className={styles.flagImg} />
      </div>

      {/* Role-Based Dashboard View */}
      {user?.role === 'staf_pemeriksa' && <StafPemeriksaDashboard />}
      {user?.role === 'supervisor' && <SupervisorDashboard />}
      {user?.role === 'analis_lab' && <AnalisLabDashboard />}
    </div>
  );
}
