'use client';

import { Settings2, ShieldCheck, Download } from 'lucide-react';
import styles from './workload.module.css';

export default function WorkloadMonitoringPage() {
  const workloads = [
    { name: 'M. Rizky Ramadhan', role: 'Forensics Analyst', active: 3, inReview: 2, total: 6, capacity: 80, colorClass: styles.barBlue },
    { name: 'Putri Apriani', role: 'Forensics Analyst', active: 2, inReview: 2, total: 6, capacity: 72, colorClass: styles.barGreen },
    { name: 'Haniefah Muslimah', role: 'Forensics Analyst', active: 2, inReview: 2, total: 4, capacity: 67, colorClass: styles.barYellow },
  ];

  return (
    <div className={styles.page}>
      
      <div className={styles.header}>
        <h1 className={styles.title}>Workload Monitoring</h1>
        <p className={styles.subtitle}>Pantau beban kerja analis lab dan distribusi kasus</p>
      </div>

      {/* Workload per Personel Table */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Workload per Personel</h2>
          <div className={styles.cardActions}>
            <button className={styles.filterBtn}>
              <Settings2 size={16} /> Filter
            </button>
            <button className={styles.viewAllBtn}>
              <Download size={16} /> Export
            </button>
          </div>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Personel</th>
                <th>Role</th>
                <th>Active Cases</th>
                <th>In Review</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {workloads.map((person, idx) => (
                <tr key={idx} className="animate-fadeInUp" style={{ animationDelay: `${idx * 100}ms` }}>
                  <td>
                    <div className={styles.personInfo}>
                      <div className={styles.avatar}>{person.name.charAt(0)}</div>
                      <span className={styles.personName}>{person.name}</span>
                    </div>
                  </td>
                  <td className={styles.roleText}>{person.role}</td>
                  <td><span className={styles.statNumber}>{person.active}</span></td>
                  <td><span className={styles.statNumber}>{person.inReview}</span></td>
                  <td><span className={styles.statNumber}>{person.total}</span></td>
                  <td>
                    <button className={styles.btnDetails}>Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Workload Distribution */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Workload Distribution</h2>
        </div>
        
        <div className={styles.distributionContainer}>
          <div className={styles.distributionHeader}>
            <span>Personel</span>
            <span>Capacity</span>
          </div>
          
          <div className={styles.distributionList}>
            {workloads.map((person, idx) => (
              <div key={idx} className={styles.distributionRow} style={{ animationDelay: `${(idx + 3) * 100}ms` }}>
                <div className={styles.progressBarContainer}>
                  <div className={styles.progressLabel}>{person.name}</div>
                  <div className={styles.progressTrack}>
                    <div 
                      className={`${styles.progressBar} ${person.colorClass}`} 
                      style={{ width: `${person.capacity}%` }}
                    />
                  </div>
                </div>
                <div className={styles.percentBox}>
                  <span className={styles.percentText}>{person.capacity}%</span>
                  <button className={styles.btnDetails}>Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Addition: Live SIEM Feed */}
      <div className={styles.siemBox}>
        <div className={styles.siemHeader}>
          <ShieldCheck size={18} /> 
          <h3>Live SIEM Security Feed</h3>
          <span className={styles.pulseIndicator}></span>
        </div>
        <div className={styles.siemLogs}>
          <p className={styles.siemLog}><span className={styles.siemTimestamp}>[11:14:02]</span> Analyst accessed Evidence #1755</p>
          <p className={styles.siemLog}><span className={styles.siemTimestamp}>[11:14:05]</span> Data export initiated by User ID: 9482</p>
          <p className={styles.siemLog}><span className={styles.siemTimestamp}>[11:14:12]</span> Integrity check passed for File System #A12</p>
        </div>
      </div>

    </div>
  );
}
