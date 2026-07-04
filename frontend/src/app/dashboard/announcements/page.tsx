'use client';

import { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Info,
  Calendar,
  User,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { mockAnnouncements } from '@/data/mock';
import styles from './announcements.module.css';

export default function AnnouncementsPage() {
  const { hasPermission } = useAuth();
  const [filter, setFilter] = useState<'all' | 'urgent' | 'normal'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filter === 'all'
    ? mockAnnouncements
    : mockAnnouncements.filter((a) => a.priority === filter);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Announcements</h1>
          <p className={styles.subtitle}>Pengumuman dan informasi internal</p>
        </div>
        {hasPermission('announcements.create') && (
          <button className={styles.createBtn} id="create-announcement-btn">
            <Plus size={16} />
            <span>Buat Pengumuman</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        <button
          className={`${styles.tab} ${filter === 'all' ? styles.activeTab : ''}`}
          onClick={() => setFilter('all')}
        >
          <Bell size={16} />
          Semua ({mockAnnouncements.length})
        </button>
        <button
          className={`${styles.tab} ${filter === 'urgent' ? styles.activeTab : ''}`}
          onClick={() => setFilter('urgent')}
        >
          <AlertTriangle size={16} />
          Urgent ({mockAnnouncements.filter((a) => a.priority === 'urgent').length})
        </button>
        <button
          className={`${styles.tab} ${filter === 'normal' ? styles.activeTab : ''}`}
          onClick={() => setFilter('normal')}
        >
          <Info size={16} />
          Normal ({mockAnnouncements.filter((a) => a.priority === 'normal').length})
        </button>
      </div>

      {/* Announcements List */}
      <div className={styles.list}>
        {filtered.map((ann, index) => (
          <div
            key={ann.id}
            className={`${styles.card} ${ann.priority === 'urgent' ? styles.urgentCard : ''} ${!ann.isRead ? styles.unread : ''} animate-fadeInUp`}
            style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
            onClick={() => setExpandedId(expandedId === ann.id ? null : ann.id)}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardLeft}>
                <div className={`${styles.priorityDot} ${styles[ann.priority]}`} />
                <div className={styles.cardInfo}>
                  <div className={styles.cardTitleRow}>
                    {ann.priority === 'urgent' && (
                      <span className={styles.urgentBadge}>
                        <AlertTriangle size={12} />
                        URGENT
                      </span>
                    )}
                    {!ann.isRead && <span className={styles.newBadge}>New</span>}
                    <h3 className={styles.cardTitle}>{ann.title}</h3>
                  </div>
                  <div className={styles.cardMeta}>
                    <span><Calendar size={12} /> {ann.createdAt}</span>
                    <span><User size={12} /> {ann.author}</span>
                  </div>
                </div>
              </div>
              <ChevronRight
                size={18}
                className={`${styles.chevron} ${expandedId === ann.id ? styles.expanded : ''}`}
              />
            </div>

            {expandedId === ann.id && (
              <div className={styles.cardBody}>
                <p>{ann.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className={styles.emptyState}>
          <Bell size={48} strokeWidth={1} />
          <h3>Tidak ada pengumuman</h3>
        </div>
      )}
    </div>
  );
}
