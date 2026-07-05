'use client';

import { useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { mockRequests } from '@/data/mock';
import styles from './case-assignment.module.css';

export default function CaseAssignmentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  const pendingRequests = mockRequests.filter(r => r.status === 'pending');

  const handleAssign = (requestId: string) => {
    const analyst = assignments[requestId];
    if (analyst) {
      alert(`Request #${requestId} has been assigned to ${analyst}`);
    } else {
      alert('Please select an analyst first.');
    }
  };

  const handleAnalystChange = (requestId: string, analyst: string) => {
    setAssignments(prev => ({ ...prev, [requestId]: analyst }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Case Assignment</h1>
        <p className={styles.subtitle}>Tugaskan permintaan pemeriksaan baru kepada analis lab</p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Cari berdasarkan nomor request atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Request No.</th>
                <th>Use Case & Priority</th>
                <th>Request Date</th>
                <th>Assign To</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((req, idx) => (
                <tr key={req.id} className="animate-fadeInUp" style={{ animationDelay: `${idx * 100}ms` }}>
                  <td><span className={styles.requestNo}>{req.requestNo}</span></td>
                  <td>
                    <div className={styles.useCaseInfo}>
                      <span className={styles.useCaseTitle}>{req.useCase}</span>
                      <span className={`${styles.priorityBadge} ${styles[req.priority]}`}>
                        {req.priority.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className={styles.dateCell}>{req.requestDate}</td>
                  <td>
                    <select 
                      className={styles.analystSelect}
                      value={assignments[req.id] || ''}
                      onChange={(e) => handleAnalystChange(req.id, e.target.value)}
                    >
                      <option value="" disabled>Pilih Analis...</option>
                      <option value="M. Rizky Ramadhan">M. Rizky Ramadhan</option>
                      <option value="Putri Apriani">Putri Apriani</option>
                      <option value="Haniefah Muslimah">Haniefah Muslimah</option>
                    </select>
                  </td>
                  <td>
                    <button 
                      className={styles.assignBtn}
                      onClick={() => handleAssign(req.id)}
                      disabled={!assignments[req.id]}
                    >
                      <UserPlus size={16} />
                      Assign Case
                    </button>
                  </td>
                </tr>
              ))}
              {pendingRequests.length === 0 && (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>
                    Tidak ada request pending.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
