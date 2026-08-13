'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  FilePlus2,
  Search,
  BarChart3,
  BookOpen,
  Bell,
  HelpCircle,
  Activity,
  ClipboardCheck,
  Microscope,
  PackageCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';
import styles from './Sidebar.module.css';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

// Role-based menu configurations
const menuConfig: Record<UserRole, MenuItem[]> = {
  // Pemohon TIDAK punya Evidence Tracker: inventaris file hasil akuisisi adalah
  // dokumen kerja internal Lab. Pemantauan pemohon cukup lewat My Request (Progress Tracking).
  staf_pemeriksa: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <FileText size={20} />, label: 'My Request', href: '/dashboard/my-request' },
    { icon: <FilePlus2 size={20} />, label: 'Submit Request', href: '/dashboard/submit-request' },
    { icon: <BarChart3 size={20} />, label: 'Report', href: '/dashboard/report' },
    { icon: <BookOpen size={20} />, label: 'Knowledge Center', href: '/dashboard/knowledge-center' },
    { icon: <Bell size={20} />, label: 'Announcements', href: '/dashboard/announcements' },
    { icon: <HelpCircle size={20} />, label: 'Help & FAQ', href: '/dashboard/help' },
  ],
  supervisor: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <Activity size={20} />, label: 'Workload Monitoring', href: '/dashboard/workload-monitoring' },
    { icon: <ClipboardCheck size={20} />, label: 'Verifikasi Permohonan', href: '/dashboard/case-assignment' },
    { icon: <FileText size={20} />, label: 'Pengesahan Laporan', href: '/dashboard/report-review' },
    { icon: <Search size={20} />, label: 'Evidence Tracker', href: '/dashboard/evidence-tracker' },
    { icon: <BarChart3 size={20} />, label: 'Arsip Laporan', href: '/dashboard/report' },
    { icon: <BookOpen size={20} />, label: 'Knowledge Center', href: '/dashboard/knowledge-center' },
    { icon: <Bell size={20} />, label: 'Announcements', href: '/dashboard/announcements' },
    { icon: <HelpCircle size={20} />, label: 'Help & FAQ', href: '/dashboard/help' },
  ],
  manajer_teknis: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <ClipboardCheck size={20} />, label: 'Penugasan Kasus', href: '/dashboard/case-assignment' },
    { icon: <FileText size={20} />, label: 'Review Teknis', href: '/dashboard/report-review' },
    { icon: <Activity size={20} />, label: 'Workload Monitoring', href: '/dashboard/workload-monitoring' },
    { icon: <Search size={20} />, label: 'Evidence Tracker', href: '/dashboard/evidence-tracker' },
    { icon: <BookOpen size={20} />, label: 'Knowledge Center', href: '/dashboard/knowledge-center' },
    { icon: <Bell size={20} />, label: 'Announcements', href: '/dashboard/announcements' },
    { icon: <HelpCircle size={20} />, label: 'Help & FAQ', href: '/dashboard/help' },
  ],
  analis_lab: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <Microscope size={20} />, label: 'Workspace SFD', href: '/dashboard/analis-workspace' },
    { icon: <PackageCheck size={20} />, label: 'Penerimaan Barang', href: '/dashboard/case-assignment' },
    { icon: <Search size={20} />, label: 'Evidence Tracker', href: '/dashboard/evidence-tracker' },
    { icon: <BarChart3 size={20} />, label: 'Report', href: '/dashboard/report' },
    { icon: <BookOpen size={20} />, label: 'Knowledge Center', href: '/dashboard/knowledge-center' },
    { icon: <Bell size={20} />, label: 'Announcements', href: '/dashboard/announcements' },
    { icon: <HelpCircle size={20} />, label: 'Help & FAQ', href: '/dashboard/help' },
  ],
};

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ collapsed: _collapsed, onToggle: _onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const role = user?.role || 'staf_pemeriksa';
  const menuItems = menuConfig[role];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    // Exact match atau sub-path dengan pembatas '/' —
    // mencegah '/dashboard/report' ikut aktif saat di '/dashboard/report-review'
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside className={styles.sidebar}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <ul className={styles.menuList}>
          {menuItems.map((item) => {
            const active = isActive(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.menuItem} ${active ? styles.active : ''}`}
                >
                  <span className={styles.menuIcon}>{item.icon}</span>
                  <span className={styles.menuLabel}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
