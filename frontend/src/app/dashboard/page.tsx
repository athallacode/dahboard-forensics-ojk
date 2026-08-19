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
  Search,
  Activity,
  AlertCircle,
  PieChart,
  History
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
  const myPending = myRequests.filter((r) => r.status === 'action_required').length;

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

  // Satu sumber data: mockDashboardStats (angka rekap seluruh lab)
  const { totalTasks, inProgress, completed } = mockDashboardStats;

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
          onViewAll={() => router.push('/dashboard/case-assignment')}
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
          <span>Verifikasi Permohonan</span>
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
  const pendingReview = assignedCases.filter((r) => r.status === 'pending_review').length;
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
          onViewAll={() => router.push('/dashboard/analis-workspace')}
          onDetails={(req) => router.push(`/dashboard/analis-workspace?requestId=${req.id}`)}
          maxRows={5}
        />
      </div>
    </>
  );
}

// ---- Admin Lab Dashboard ----
function AdminDashboard() {
  const router = useRouter();

  const pendingVerification = mockRequests.filter(r => r.status === 'pending_admin_verification').length;
  const readyForPickup = mockRequests.filter(r => r.status === 'ready_for_pickup').length;
  const completed = mockRequests.filter(r => r.status === 'completed').length;
  const allPhysical = mockRequests.filter(r => r.status !== 'action_required').length;

  return (
    <>
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <StatCard
          value={allPhysical}
          label="Total Register Fisik"
          icon={<ClipboardList size={22} />}
          color="blue"
          delay={100}
        />
        <StatCard
          value={pendingVerification}
          label="Menunggu Fisik"
          icon={<AlertTriangle size={22} />}
          color="orange"
          delay={200}
        />
        <StatCard
          value={readyForPickup}
          label="Siap Dikembalikan"
          icon={<CheckCircle2 size={22} />}
          color="green"
          delay={300}
        />
        <StatCard
          value={completed}
          label="Telah Selesai"
          icon={<ClipboardList size={22} />}
          color="blue"
          delay={400}
        />
      </div>

      <div className={styles.adminGrid}>
        {/* Left Column */}
        <div className={styles.adminLeft}>
          
          {/* Quick Search */}
          <div className={styles.adminCard}>
            <h3 className={styles.adminCardTitle}>
              <Search size={18} />
              Pencarian Cepat Resi
            </h3>
            <div className={styles.quickSearch}>
              <input type="text" placeholder="Masukkan Nomor Request (Contoh: REQ-2026...)" className={styles.searchInputAdmin} />
              <button className={styles.searchBtn}>Cari</button>
            </div>
          </div>

          {/* SLA Alerts */}
          <div className={styles.adminCard}>
            <h3 className={styles.adminCardTitle} style={{ color: 'var(--color-danger-600)' }}>
              <AlertCircle size={18} />
              Peringatan Pengambilan (Lewat Batas)
            </h3>
            <div className={styles.alertList}>
              <div className={styles.alertItem}>
                <div className={styles.alertIcon}><AlertTriangle size={16} /></div>
                <div className={styles.alertText}>
                  <strong>REQ-202604-0992</strong>
                  <span>Belum diambil sejak 5 hari lalu (Divisi Kepatuhan)</span>
                </div>
                <button className={styles.alertAction}>Follow Up</button>
              </div>
              <div className={styles.alertItem}>
                <div className={styles.alertIcon}><AlertTriangle size={16} /></div>
                <div className={styles.alertText}>
                  <strong>REQ-202604-0988</strong>
                  <span>Belum diambil sejak 7 hari lalu (Divisi Hukum)</span>
                </div>
                <button className={styles.alertAction}>Follow Up</button>
              </div>
            </div>
          </div>

          {/* Overview Table */}
          <div className={styles.tableSection} style={{ marginTop: '0' }}>
            <RequestTable
              requests={mockRequests.filter(r => ['pending_admin_verification', 'ready_for_pickup'].includes(r.status))}
              title="Tugas Logistik Fisik Saat Ini"
              onViewAll={() => router.push('/dashboard/admin-workspace')}
              onDetails={(req) => router.push('/dashboard/admin-workspace')}
              maxRows={5}
            />
          </div>
          
        </div>

        {/* Right Column */}
        <div className={styles.adminRight}>
          
          {/* Chart Placeholder */}
          <div className={styles.adminCard}>
            <h3 className={styles.adminCardTitle}>
              <PieChart size={18} />
              Volume Logistik Bulan Ini
            </h3>
            <div className={styles.chartPlaceholder}>
              <div className={styles.chartCircle}>
                <div className={styles.chartInner}>
                  <span>145</span>
                  <small>Total Fisik</small>
                </div>
              </div>
              <div className={styles.chartLegend}>
                <div className={styles.legendItem}>
                  <span className={styles.dot} style={{ background: '#3b82f6' }}></span>
                  Masuk (80)
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.dot} style={{ background: '#10b981' }}></span>
                  Keluar (65)
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className={styles.adminCard}>
            <h3 className={styles.adminCardTitle}>
              <History size={18} />
              Log Aktivitas Terakhir
            </h3>
            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <span className={styles.activityTime}>10:15</span>
                <p>Barang bukti <strong>REQ-202605-1029</strong> diterima dari Divisi Kepatuhan</p>
              </div>
              <div className={styles.activityItem}>
                <span className={styles.activityTime}>09:30</span>
                <p>Barang bukti <strong>REQ-202605-1011</strong> diserahkan ke Divisi Hukum</p>
              </div>
              <div className={styles.activityItem}>
                <span className={styles.activityTime}>Kemarin, 16:45</span>
                <p>Barang bukti <strong>REQ-202605-1008</strong> diserahkan ke Divisi Penindakan</p>
              </div>
              <div className={styles.activityItem}>
                <span className={styles.activityTime}>Kemarin, 14:20</span>
                <p>Barang bukti <strong>REQ-202605-1025</strong> diterima dari Pengawasan Bank</p>
              </div>
            </div>
          </div>

        </div>
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
      case 'manajer_teknis':
        return 'Tugaskan kasus dan review kelayakan teknis laporan SFD';
      case 'analis_lab':
        return 'Kelola kasus yang ditugaskan dan lanjutkan analisis';
      case 'admin':
        return 'Kelola penerimaan dan pengembalian logistik fisik laboratorium';
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
            <span className={styles.greetingDark}>Halo </span>
            <span className={styles.greetingMaroon}>{user?.name || 'User'}</span>
            <span className={styles.wave}> 👋</span>
          </h1>
          <p className={styles.greetingSubtext}>
            {greetingSubtext}
          </p>
        </div>
        <img src="/images/flag.png" alt="Indonesian Flag" className={styles.flagImg} />
      </div>

      {/* Role-Based Dashboard View */}
      {user?.role === 'staf_pemeriksa' && <StafPemeriksaDashboard />}
      {/* Manajer Teknis memakai tampilan tim yang sama dengan Kepala Lab */}
      {(user?.role === 'supervisor' || user?.role === 'manajer_teknis') && <SupervisorDashboard />}
      {user?.role === 'analis_lab' && <AnalisLabDashboard />}
      {user?.role === 'admin' && <AdminDashboard />}
    </div>
  );
}
