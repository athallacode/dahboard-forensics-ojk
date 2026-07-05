'use client';

import { useState } from 'react';
import { Microscope, FileUp, ListChecks, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { mockRequests } from '@/data/mock';
import type { ExaminationRequest } from '@/types';
import styles from './workspace.module.css';

export default function AssignedCasesPage() {
  const { user } = useAuth();
  const [activeWorkspace, setActiveWorkspace] = useState<ExaminationRequest | null>(null);

  // Fallback to name 'Putri Apriani' if user is missing (for mock reliability)
  const analystName = user?.name || 'Putri Apriani';
  const assignedCases = mockRequests.filter(r => r.assignedTo === analystName);

  return (
    <div className={styles.page}>
      
      {!activeWorkspace ? (
        <>
          <div className={styles.header}>
            <h1 className={styles.title}>Assigned Cases</h1>
            <p className={styles.subtitle}>Daftar kasus forensik yang ditugaskan kepada Anda</p>
          </div>

          <div className={styles.gridContainer}>
            {assignedCases.length > 0 ? (
              assignedCases.map((req, idx) => (
                <div key={req.id} className={`${styles.caseCard} animate-fadeInUp`} style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className={styles.cardHeader}>
                    <span className={styles.requestNo}>#{req.requestNo}</span>
                    <span className={`${styles.statusBadge} ${styles[req.status]}`}>
                      {req.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className={styles.useCaseTitle}>{req.useCase}</h3>
                  <p className={styles.description}>{req.description}</p>
                  
                  <div className={styles.metaInfo}>
                    <span>Priority: <strong>{req.priority.toUpperCase()}</strong></span>
                    <span>Deadline: <strong>{req.updatedAt}</strong></span>
                  </div>
                  
                  <button 
                    className={styles.processBtn}
                    onClick={() => setActiveWorkspace(req)}
                  >
                    <Microscope size={16} />
                    Process Case
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                Tidak ada kasus yang ditugaskan kepada Anda saat ini.
              </div>
            )}
          </div>
        </>
      ) : (
        /* Workspace Panel */
        <div className={styles.workspacePanel}>
          <div className={styles.panelHeader}>
            <div className={styles.headerTitles}>
              <h1 className={styles.title}>Investigation Workspace: #{activeWorkspace.requestNo}</h1>
              <p className={styles.subtitle}>{activeWorkspace.useCase}</p>
            </div>
            <button className={styles.backBtn} onClick={() => setActiveWorkspace(null)}>
              &larr; Back to Cases
            </button>
          </div>

          <div className={styles.workspaceLayout}>
            {/* Left Col: Details & Checklist */}
            <div className={styles.mainCol}>
              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}><ListChecks size={18} /> Standard Operating Procedures (SOP)</h3>
                
                <div className={styles.checklist}>
                  <label className={styles.checkItem}>
                    <input type="checkbox" className={styles.checkbox} />
                    <span className={styles.checkLabel}>1. Chain of Custody documentation completed</span>
                  </label>
                  <label className={styles.checkItem}>
                    <input type="checkbox" className={styles.checkbox} />
                    <span className={styles.checkLabel}>2. Storage media bit-stream image acquired</span>
                  </label>
                  <label className={styles.checkItem}>
                    <input type="checkbox" className={styles.checkbox} />
                    <span className={styles.checkLabel}>3. Hash integrity verification passed (SHA-256)</span>
                  </label>
                  <label className={styles.checkItem}>
                    <input type="checkbox" className={styles.checkbox} />
                    <span className={styles.checkLabel}>4. Log extraction and parsing completed</span>
                  </label>
                </div>
              </div>

              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}><FileUp size={18} /> Upload Forensic Findings</h3>
                
                <div className={styles.dropzone}>
                  <div className={styles.dropzoneIcon}>
                    <FileUp size={32} />
                  </div>
                  <p className={styles.dropText}>Drag & drop report files here</p>
                  <p className={styles.dropSub}>Support .pdf, .docx, .zip (Max 1GB)</p>
                  <button className={styles.browseBtn}>Browse Files</button>
                </div>
              </div>
            </div>

            {/* Right Col: Actions & Logs */}
            <div className={styles.sideCol}>
              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Update Status</h3>
                
                <select className={styles.statusSelect} defaultValue={activeWorkspace.status}>
                  <option value="pending">Pending</option>
                  <option value="on_progress">On Progress</option>
                  <option value="completed">Completed</option>
                </select>
                
                <button className={styles.updateBtn}>
                  <CheckCircle2 size={16} /> Save Changes
                </button>
                
                <div className={styles.auditLog}>
                  <h4>Immutable Audit Log</h4>
                  <div className={styles.logItem}>
                    <span className={styles.logTime}>{new Date().toISOString().split('T')[0]} 11:42</span>
                    <span className={styles.logAction}>Status changed to On Progress by {analystName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
