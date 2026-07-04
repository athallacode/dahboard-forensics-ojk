'use client';

import { useState } from 'react';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  CalendarDays,
  MoreVertical,
  ArrowRight,
  Filter
} from 'lucide-react';
import styles from './kepala.module.css';

export default function KepalaDashboardPage() {
  const [sortBy, setSortBy] = useState('default');

  const assignments = [
    { no: 1, reqNo: 'REQ-2024-001', useCase: 'Pemeriksaan Perangkat Handphone', requester: 'John Doe', assignedTo: 'M. Rizky', status: 'In Progress', action: 'Details', difficulty: 'Tinggi', deadline: 2 },
    { no: 2, reqNo: 'REQ-2024-002', useCase: 'Validasi Dokumen Elektronik', requester: 'Jane Smith', assignedTo: 'Sarah J.', status: 'Pending', action: 'Details', difficulty: 'Rendah', deadline: 5 },
    { no: 3, reqNo: 'REQ-2024-003', useCase: 'Audit Sistem Informasi', requester: 'Bob Wilson', assignedTo: 'Alex M.', status: 'Completed', action: 'Details', difficulty: 'Sedang', deadline: 0 },
    { no: 4, reqNo: 'REQ-2024-004', useCase: 'Investigasi Transaksi Mencurigakan', requester: 'Alice Brown', assignedTo: '-', status: 'Unassigned', action: 'Assign', difficulty: 'Tinggi', deadline: 1 },
    { no: 5, reqNo: 'REQ-2024-005', useCase: 'Analisis Data Keuangan', requester: 'Charlie D.', assignedTo: '-', status: 'Unassigned', action: 'Assign', difficulty: 'Sedang', deadline: 7 },
  ];

  const sortedAssignments = [...assignments].sort((a, b) => {
    if (sortBy === 'difficulty') {
      const diffMap: Record<string, number> = { 'Tinggi': 3, 'Sedang': 2, 'Rendah': 1 };
      return diffMap[b.difficulty] - diffMap[a.difficulty];
    }
    if (sortBy === 'deadline') {
      if (a.deadline === 0) return 1;
      if (b.deadline === 0) return -1;
      return a.deadline - b.deadline;
    }
    return a.no - b.no;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Progress': return <span className={`${styles.badge} ${styles.badgeProgress}`}>In Progress</span>;
      case 'Pending': return <span className={`${styles.badge} ${styles.badgePending}`}>Pending Review</span>;
      case 'Completed': return <span className={`${styles.badge} ${styles.badgeCompleted}`}>Completed</span>;
      case 'Unassigned': return <span className={`${styles.badge} ${styles.badgeUnassigned}`}>Unassigned</span>;
      default: return <span className={styles.badge}>{status}</span>;
    }
  };

  return (
    <div className={styles.page}>
      
      {/* Modern Greeting Banner */}
      <div className={styles.banner}>
        <div className={styles.bannerDecor1}></div>
        <div className={styles.bannerDecor2}></div>
        <div className={styles.bannerContent}>
          <h1 className={styles.greeting}>
            <span className={styles.greetingText}>Selamat Datang, Kepala LPBTI!</span>
            <span className={styles.wave}>👋</span>
          </h1>
          <p className={styles.greetingSubtext}>
            Berikut adalah ringkasan operasional dan beban kerja tim hari ini.
          </p>
        </div>
      </div>

      {/* Vibrant Gradient Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.gradientBlue}`}>
          <div className={styles.statIconWrapper}>
            <ClipboardList className={styles.statIcon} size={28} />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>19</div>
            <div className={styles.statLabel}>Active Cases</div>
          </div>
        </div>
        
        <div className={`${styles.statCard} ${styles.gradientOrange}`}>
          <div className={styles.statIconWrapper}>
            <Clock className={styles.statIcon} size={28} />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>8</div>
            <div className={styles.statLabel}>Pending Review</div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.gradientGreen}`}>
          <div className={styles.statIconWrapper}>
            <CheckCircle2 className={styles.statIcon} size={28} />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>48</div>
            <div className={styles.statLabel}>Completed</div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.gradientPurple}`}>
          <div className={styles.statIconWrapper}>
            <CalendarDays className={styles.statIcon} size={28} />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>10<span className={styles.statUnit}>Days</span></div>
            <div className={styles.statLabel}>Avg. SLA</div>
          </div>
        </div>
      </div>

      {/* Sleek Table Section */}
      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <div>
            <h2 className={styles.tableTitle}>Recent Assignments</h2>
            <p className={styles.tableSubtitle}>Daftar penugasan kasus terbaru</p>
          </div>
          <div className={styles.tableControls}>
            <div className={styles.filterBox}>
              <Filter size={16} className={styles.filterIcon} />
              <select 
                className={styles.filterSelect} 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Urutan Default</option>
                <option value="difficulty">Prioritas Kesulitan (Tinggi - Rendah)</option>
                <option value="deadline">Deadline Terdekat</option>
              </select>
            </div>
            <button className={styles.viewAllBtn}>
              View All <ArrowRight size={16} />
            </button>
          </div>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Use Case</th>
                <th>Tingkat Kesulitan</th>
                <th>Deadline</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedAssignments.map((row) => (
                <tr key={row.no} className={styles.tableRow}>
                  <td className={styles.reqNo}>{row.reqNo}</td>
                  <td className={styles.useCaseCell}>{row.useCase}</td>
                  <td>
                    <span className={`${styles.diffBadge} ${styles['diff' + row.difficulty]}`}>
                      {row.difficulty}
                    </span>
                  </td>
                  <td>
                    {row.deadline === 0 ? (
                      <span className={styles.deadlineDone}>Selesai</span>
                    ) : (
                      <span className={row.deadline <= 2 ? styles.deadlineUrgent : styles.deadlineNormal}>
                        {row.deadline} Hari
                      </span>
                    )}
                  </td>
                  <td>
                    {row.assignedTo !== '-' ? (
                      <div className={styles.userCell}>
                        <div className={`${styles.avatarSm} ${styles.avatarAssignee}`}>{row.assignedTo.charAt(0)}</div>
                        <span className={styles.assigneeName}>{row.assignedTo}</span>
                      </div>
                    ) : (
                      <span className={styles.unassignedText}>-</span>
                    )}
                  </td>
                  <td>{getStatusBadge(row.status)}</td>
                  <td>
                    <div className={styles.actionCell}>
                      <button className={row.action === 'Assign' ? styles.actionBtnAssign : styles.actionBtn}>
                        {row.action}
                      </button>
                      <button className={styles.iconBtn}>
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
