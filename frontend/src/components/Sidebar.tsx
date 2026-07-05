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
  staf_pemeriksa: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <FileText size={20} />, label: 'My Request', href: '/dashboard/my-request' },
    { icon: <FilePlus2 size={20} />, label: 'Submit Request', href: '/dashboard/submit-request' },
    { icon: <Search size={20} />, label: 'Evidence Tracker', href: '/dashboard/evidence-tracker' },
    { icon: <BarChart3 size={20} />, label: 'Report', href: '/dashboard/report' },
    { icon: <BookOpen size={20} />, label: 'Knowledge Center', href: '/dashboard/knowledge-center' },
    { icon: <Bell size={20} />, label: 'Announcements', href: '/dashboard/announcements' },
    { icon: <HelpCircle size={20} />, label: 'Help & FAQ', href: '/dashboard/help' },
  ],
  supervisor: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <Activity size={20} />, label: 'Workload Monitoring', href: '/dashboard/workload-monitoring' },
    { icon: <ClipboardCheck size={20} />, label: 'Case Assignment', href: '/dashboard/case-assignment' },
    { icon: <Search size={20} />, label: 'Evidence Tracker', href: '/dashboard/evidence-tracker' },
    { icon: <BarChart3 size={20} />, label: 'Report', href: '/dashboard/report' },
    { icon: <BookOpen size={20} />, label: 'Knowledge Center', href: '/dashboard/knowledge-center' },
    { icon: <Bell size={20} />, label: 'Announcements', href: '/dashboard/announcements' },
    { icon: <HelpCircle size={20} />, label: 'Help & FAQ', href: '/dashboard/help' },
  ],
  analis_lab: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <Microscope size={20} />, label: 'Assigned Cases', href: '/dashboard/assigned-cases' },
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
    return pathname.startsWith(href);
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
