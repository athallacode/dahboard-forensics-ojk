'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Search,
  LogOut,
  Settings,
  User,
  ChevronDown,
  Moon,
  Sun,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';
import styles from './Topbar.module.css';

export default function Topbar() {
  const { user, logout, switchRole } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const roleName = (role: string) => {
    switch (role) {
      case 'staf_pemeriksa': return 'Pemohon';
      case 'supervisor': return 'Kepala Lab';
      case 'manajer_teknis': return 'Manajer Teknis';
      case 'analis_lab': return 'SFD';
      default: return role;
    }
  };

  const notifications = [
    { id: 1, text: 'Request #5665 memerlukan review', time: '5 menit lalu', unread: true },
    { id: 2, text: 'Dokumen baru diunggah ke Evidence Tracker', time: '1 jam lalu', unread: true },
    { id: 3, text: 'Laporan Q2 2026 siap diunduh', time: '3 jam lalu', unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className={styles.topbar}>
      {/* Search */}
      <div className={styles.searchContainer}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Cari request, dokumen, atau file..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
          id="global-search"
        />
      </div>

      {/* Right Section */}
      <div className={styles.rightSection}>
        {/* Role Switcher (dev only) */}
        <div className={styles.roleSwitcher}>
          <select
            value={user?.role || 'staf_pemeriksa'}
            onChange={(e) => switchRole(e.target.value as UserRole)}
            className={styles.roleSelect}
            id="role-switcher"
            title="Switch role (demo)"
          >
            <option value="staf_pemeriksa">Pemohon (Staf Pemeriksa)</option>
            <option value="supervisor">Kepala Lab (Supervisor)</option>
            <option value="manajer_teknis">Manajer Teknis</option>
            <option value="analis_lab">SFD (Spesialis Forensik Digital)</option>
          </select>
        </div>

        {/* Notifications */}
        <div className={styles.notifContainer} ref={notifRef}>
          <button
            className={styles.iconBtn}
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifikasi"
            id="notifications-btn"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className={styles.badge}>{unreadCount}</span>
            )}
          </button>
          {showNotifications && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <h4>Notifikasi</h4>
                <button className={styles.markAllRead}>Tandai semua dibaca</button>
              </div>
              <ul className={styles.notifList}>
                {notifications.map((n) => (
                  <li key={n.id} className={`${styles.notifItem} ${n.unread ? styles.unread : ''}`}>
                    <p className={styles.notifText}>{n.text}</p>
                    <span className={styles.notifTime}>{n.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className={styles.userMenuContainer} ref={userMenuRef}>
          <button
            className={styles.userBtn}
            onClick={() => setShowUserMenu(!showUserMenu)}
            id="user-menu-btn"
          >
            <div className={styles.userAvatar}>
              {user?.name.charAt(0) || 'U'}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name.split(' ').slice(0, 2).join(' ') || 'User'}</span>
              <span className={styles.userRole}>{roleName(user?.role || '')}</span>
            </div>
            <ChevronDown size={16} className={`${styles.chevron} ${showUserMenu ? styles.rotated : ''}`} />
          </button>

          {showUserMenu && (
            <div className={styles.dropdown}>
              <Link href="/dashboard" className={styles.dropdownItem}>
                <User size={16} />
                <span>Profil Saya</span>
              </Link>
              <Link href="/dashboard" className={styles.dropdownItem}>
                <Settings size={16} />
                <span>Pengaturan</span>
              </Link>
              <div className={styles.dropdownDivider} />
              <button className={styles.dropdownItem} onClick={handleLogout}>
                <LogOut size={16} />
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function Link({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  const router = useRouter();
  return (
    <button className={className} onClick={() => router.push(href)}>
      {children}
    </button>
  );
}
