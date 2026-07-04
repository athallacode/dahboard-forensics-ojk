'use client';

import { Activity, Users, ChevronRight, UserCircle2 } from 'lucide-react';
import styles from './workload.module.css';

export default function WorkloadMonitoringPage() {
  const workloads = [
    { name: 'M. Rizky', role: 'Analis Utama', active: 5, inReview: 2, total: 7, capacity: 85 },
    { name: 'Sarah J.', role: 'Analis Madya', active: 4, inReview: 3, total: 7, capacity: 70 },
    { name: 'Alex M.', role: 'Spesialis IT', active: 6, inReview: 1, total: 7, capacity: 90 },
    { name: 'Budi S.', role: 'Analis Pertama', active: 3, inReview: 4, total: 7, capacity: 60 },
    { name: 'Diana P.', role: 'Spesialis IT', active: 4, inReview: 2, total: 6, capacity: 45 },
  ];

  const getCapacityTheme = (capacity: number) => {
    if (capacity >= 80) return { bg: '#FEE2E2', fill: 'linear-gradient(90deg, #EF4444, #B91C1C)', text: '#B91C1C', label: 'High' };
    if (capacity >= 60) return { bg: '#FEF3C7', fill: 'linear-gradient(90deg, #F59E0B, #D97706)', text: '#D97706', label: 'Medium' };
    return { bg: '#D1FAE5', fill: 'linear-gradient(90deg, #10B981, #047857)', text: '#047857', label: 'Low' };
  };

  return (
    <div className={styles.page}>
      
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Workload Monitoring</h1>
          <p className={styles.subtitle}>Pantau kapasitas dan beban tugas setiap personel laboratorium</p>
        </div>
      </div>

      <div className={styles.contentGrid}>
        
        {/* Left/Top: Workload Distribution */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconBox}><Activity size={20} /></div>
            <h2 className={styles.cardTitle}>Workload Distribution</h2>
          </div>
          
          <div className={styles.distributionContainer}>
            {workloads.map((person, idx) => {
              const theme = getCapacityTheme(person.capacity);
              return (
                <div key={idx} className={styles.distRow}>
                  <div className={styles.distInfo}>
                    <div className={styles.personelCol}>
                      <div className={styles.avatarSm}>{person.name.charAt(0)}</div>
                      <span className={styles.distName}>{person.name}</span>
                    </div>
                    <div className={styles.capacityLabel}>
                      <span className={styles.capacityPercent}>{person.capacity}%</span>
                      <span 
                        className={styles.capacityBadge}
                        style={{ backgroundColor: theme.bg, color: theme.text }}
                      >
                        {theme.label}
                      </span>
                    </div>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{
                        width: `${person.capacity}%`,
                        background: theme.fill,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right/Bottom: Workload Table */}
        <div className={`${styles.card} ${styles.tableCard}`}>
          <div className={styles.cardHeader}>
            <div className={`${styles.iconBox} ${styles.iconBoxBlue}`}><Users size={20} /></div>
            <h2 className={styles.cardTitle}>Detailed Assignment</h2>
          </div>
          
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Personel</th>
                  <th>Role</th>
                  <th>Active</th>
                  <th>Review</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {workloads.map((person, idx) => (
                  <tr key={idx} className={styles.tableRow}>
                    <td>
                      <div className={styles.personelCol}>
                        <UserCircle2 size={24} className={styles.userIcon} />
                        <span className={styles.personName}>{person.name}</span>
                      </div>
                    </td>
                    <td className={styles.roleText}>{person.role}</td>
                    <td><span className={styles.numBadge}>{person.active}</span></td>
                    <td><span className={styles.numBadge}>{person.inReview}</span></td>
                    <td><span className={`${styles.numBadge} ${styles.numBadgeTotal}`}>{person.total}</span></td>
                    <td>
                      <button className={styles.actionBtn}>
                        Details <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
