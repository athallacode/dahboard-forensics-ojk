'use client';

import { Settings2, ShieldCheck } from 'lucide-react';
import styles from './workload.module.css';

export default function WorkloadMonitoringPage() {
  const workloads = [
    { name: 'M. Rizky Ramadhan', role: 'Forensics Analyst', active: 3, inReview: 2, total: 6, capacity: 80, colorClass: styles.barBlue },
    { name: 'Putri Apriani', role: 'Forensics Analyst', active: 2, inReview: 2, total: 6, capacity: 72, colorClass: styles.barGreen },
    { name: 'Haniefah Muslimah', role: 'Forensics Analyst', active: 2, inReview: 2, total: 4, capacity: 67, colorClass: styles.barYellow },
  ];

  return (
    <div className={styles.page}>
      
      <h1 className={styles.title}>Selamat Datang, Kepala LPBTI!</h1>

      {/* Workload per Personel Table */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Workload per Personel</h2>
          <div className={styles.cardActions}>
            <button className={styles.filterBtn}>
              <Settings2 size={16} /> Filter
            </button>
            <a href="#" className={styles.viewAll}>View All</a>
          </div>
        </div>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Personel</th>
              <th>Role</th>
              <th>Active Cases</th>
              <th>In Review</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {workloads.map((person, idx) => (
              <tr key={idx}>
                <td>
                  <div className={styles.personName}>{person.name}</div>
                </td>
                <td className={styles.roleText}>{person.role}</td>
                <td className={styles.statNumber}>{person.active}</td>
                <td className={styles.statNumber}>{person.inReview}</td>
                <td className={styles.statNumber}>{person.total}</td>
                <td>
                  <button className={styles.btnDetails}>Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Workload Distribution */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Workload Distribution</h2>
          <div className={styles.cardActions}>
            <button className={styles.filterBtn}>
              <Settings2 size={16} /> Filter
            </button>
            <a href="#" className={styles.viewAll}>View All</a>
          </div>
        </div>
        
        <div className={styles.table}>
          <div className={styles.tableHead} style={{display: 'flex', color: 'var(--color-neutral-500)', fontSize: '13px', fontWeight: '500', paddingBottom: '16px', borderBottom: '1px solid var(--color-neutral-200)', marginBottom: '24px'}}>
            Personel
          </div>
          
          {workloads.map((person, idx) => (
            <div key={idx} className={styles.distributionRow}>
              <div className={styles.progressBarContainer}>
                <div 
                  className={`${styles.progressBar} ${person.colorClass}`} 
                  style={{ width: `${person.capacity}%` }}
                >
                  {person.name}
                </div>
              </div>
              <div className={styles.percentText}>{person.capacity}%</div>
              <button className={styles.btnDetails}>Details</button>
            </div>
          ))}
        </div>
      </div>

      {/* Security Addition: Live SIEM Feed */}
      <div className={styles.siemBox}>
        <div className={styles.siemHeader}>
          <ShieldCheck size={16} /> Live SIEM Security Feed
        </div>
        <p className={styles.siemLog}><span className={styles.siemTimestamp}>[11:14:02]</span> Analyst accessed Evidence #1755</p>
        <p className={styles.siemLog}><span className={styles.siemTimestamp}>[11:14:05]</span> Data export initiated by User ID: 9482</p>
        <p className={styles.siemLog}><span className={styles.siemTimestamp}>[11:14:12]</span> Integrity check passed for File System #A12</p>
      </div>

    </div>
  );
}
