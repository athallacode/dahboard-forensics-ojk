'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Inbox,
  ClipboardList,
  Search,
  Activity,
  BarChart3,
  BookOpen,
  Bell,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './Sidebar.module.css'; // Reusing existing Sidebar styles

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/kepala' },
  { icon: <Inbox size={20} />, label: 'Incoming Request', href: '/kepala/incoming-request' },
  { icon: <ClipboardList size={20} />, label: 'Case Assignment', href: '/kepala/case-assignment' },
  { icon: <Search size={20} />, label: 'Evidence Tracker', href: '/kepala/evidence-tracker' },
  { icon: <Activity size={20} />, label: 'Workload Monitoring', href: '/kepala/workload' },
  { icon: <BarChart3 size={20} />, label: 'Report', href: '/kepala/report' },
  { icon: <BookOpen size={20} />, label: 'Knowledge Center', href: '/kepala/knowledge-center' },
  { icon: <Bell size={20} />, label: 'Announcements', href: '/kepala/announcements' },
  { icon: <HelpCircle size={20} />, label: 'Help & FAQ', href: '/kepala/help' },
];

export default function KepalaSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/kepala') return pathname === '/kepala';
    return pathname.startsWith(href);
  };

  return (
    <aside className={styles.sidebar}>
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
