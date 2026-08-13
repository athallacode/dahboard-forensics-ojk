'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Microscope, 
  ArrowLeft, 
  FileUp, 
  ShieldCheck,
  Plus,
  Clock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { mockRequests } from '@/data/mock';
import type { ExaminationRequest } from '@/types';
import styles from './analis-workspace.module.css';

function AnalisWorkspaceContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  
  const [activeCase, setActiveCase] = useState<ExaminationRequest | null>(null);
  
  // Checklist State
  const [checklist, setChecklist] = useState([
    { id: 1, label: 'Verifikasi segel & chain of custody', checked: false },
    { id: 2, label: 'Dokumentasi kondisi fisik barang bukti', checked: false },
    { id: 3, label: 'Akuisisi / imaging (write-blocked)', checked: false },
    { id: 4, label: 'Verifikasi hash image (SHA-256)', checked: false },
    { id: 5, label: 'Analisis artefak', checked: false },
    { id: 6, label: 'Penyusunan draft laporan', checked: false },
  ]);

  const [hasFile, setHasFile] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Status Log State
  const [statusValue, setStatusValue] = useState('Mulai Analisis');
  const [logs, setLogs] = useState([
    { id: 1, action: 'Kasus Ditugaskan (Assigned)', date: '01/07/2026, 09:00:00' }
  ]);
  
  // Notes State
  const [notes, setNotes] = useState([
    { id: 1, author: 'Putri Apriani', date: '02/07/2026, 10:15:00', text: 'Barang bukti diterima dalam keadaan tersegel dengan baik.' }
  ]);
  const [newNote, setNewNote] = useState('');

  const analystName = user?.name || 'Putri Apriani';
  const assignedCases = mockRequests.filter(r => r.assignedTo === analystName);

  // Initialize from searchParams if provided
  useEffect(() => {
    const reqId = searchParams.get('requestId');
    if (reqId) {
      const found = assignedCases.find(c => c.id === reqId);
      if (found) setActiveCase(found);
    }
  }, [searchParams, assignedCases]);

  const toggleChecklist = (id: number) => {
    if (isSubmitted) return;
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const completedChecks = checklist.filter(c => c.checked).length;
  const isAllChecked = completedChecks === checklist.length;
  
  const handleSubmitReport = () => {
    if (!isAllChecked || !hasFile) return;
    setIsSubmitted(true);
    addLog('Laporan Hasil disubmit untuk Review (Status: Pending Review)');
  };

  const addLog = (action: string) => {
    const newLog = {
      id: Date.now(),
      action,
      date: new Date().toLocaleString('id-ID')
    };
    setLogs(prev => [...prev, newLog]);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setStatusValue(val);
    addLog(`Status diubah menjadi: ${val}`);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotes(prev => [...prev, {
      id: Date.now(),
      author: analystName,
      date: new Date().toLocaleString('id-ID'),
      text: newNote.trim()
    }]);
    setNewNote('');
  };

  if (activeCase) {
    // STATE B: INVESTIGATION WORKSPACE
    return (
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => setActiveCase(null)}>
          <ArrowLeft size={16} /> Kembali ke daftar kasus
        </button>

        {/* Header Card */}
        <div className={styles.headerCard}>
          <div className={styles.headerTop}>
            <div className={styles.titleGroup}>
              <span className={styles.requestNo}>#{activeCase.requestNo}</span>
              <h1 className={styles.useCase}>{activeCase.useCase}</h1>
            </div>
            <span className={`${styles.priorityPill} ${styles[activeCase.priority]}`}>
              {activeCase.priority.toUpperCase()}
            </span>
          </div>
          <div className={styles.headerBottom}>
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Requester Unit</span>
              <span className={styles.infoValue}>{activeCase.division}</span>
            </div>
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Barang Bukti (Summary)</span>
              <span className={styles.infoValue}>Mobile Device, Samsung A52, SN: 8937492, Kondisi: Baik (Tersegel)</span>
            </div>
          </div>
        </div>

        <div className={styles.grid2Col}>
          {/* LEFT COLUMN */}
          <div className={styles.leftCol}>
            {/* SOP Checklist */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>SOP Checklist Forensik</h2>
                <span className={styles.progressText}>{completedChecks} of {checklist.length} completed</span>
              </div>
              
              <div className={styles.progressTrack}>
                <div 
                  className={styles.progressBar} 
                  style={{ width: `${(completedChecks / checklist.length) * 100}%` }} 
                />
              </div>

              <div className={styles.checklist}>
                {checklist.map(item => (
                  <label key={item.id} className={`${styles.checkItem} ${isSubmitted ? styles.disabled : ''}`}>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox}
                      checked={item.checked}
                      onChange={() => toggleChecklist(item.id)}
                      disabled={isSubmitted}
                    />
                    <span className={styles.checkLabel}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Upload Laporan */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Upload Laporan Hasil</h2>
              
              <div 
                className={`${styles.dropzone} ${hasFile ? styles.hasFile : ''} ${isSubmitted ? styles.disabled : ''}`}
                onClick={() => !isSubmitted && setHasFile(true)}
              >
                <FileUp size={32} className={styles.dropIcon} />
                {hasFile ? (
                  <p className={styles.dropText}>draft_laporan_forensik.pdf attached</p>
                ) : (
                  <>
                    <p className={styles.dropText}>Klik atau Drag & drop Laporan (.pdf)</p>
                    <p className={styles.dropSubText}>Maksimal ukuran file 100MB</p>
                  </>
                )}
              </div>

              <button 
                className={styles.submitReportBtn}
                disabled={!isAllChecked || !hasFile || isSubmitted}
                onClick={handleSubmitReport}
              >
                {isSubmitted ? 'Telah Disubmit untuk Review' : 'Submit for Review'}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className={styles.rightCol}>
            {/* Status Updater */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Status Updater</h2>
              <select 
                className={styles.statusSelect}
                value={statusValue}
                onChange={handleStatusChange}
                disabled={isSubmitted}
              >
                <option value="Menunggu Diperiksa">Menunggu Diperiksa</option>
                <option value="Mulai Analisis">Mulai Analisis</option>
                <option value="Menunggu Data Tambahan">Menunggu Data Tambahan</option>
                <option value="Analisis Selesai">Analisis Selesai</option>
              </select>

              <div className={styles.logContainer}>
                {logs.map(log => (
                  <div key={log.id} className={styles.logRow}>
                    <div className={styles.logContent}>
                      <span className={styles.logDate}>{log.date}</span>
                      <p className={styles.logAction}>{log.action}</p>
                    </div>
                    <div className={styles.immutableBadge}>
                      <ShieldCheck size={12} /> Immutable Log
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Catatan Internal */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Catatan Internal</h2>
                <span className={styles.subtitleSmall}>Hanya terlihat oleh Analis & Kepala Lab</span>
              </div>
              
              <div className={styles.notesContainer}>
                {notes.map(note => (
                  <div key={note.id} className={styles.noteItem}>
                    <div className={styles.noteHeader}>
                      <span className={styles.noteAuthor}>{note.author}</span>
                      <span className={styles.noteDate}>
                        <Clock size={12} /> {note.date}
                      </span>
                    </div>
                    <p className={styles.noteText}>{note.text}</p>
                  </div>
                ))}
              </div>

              {!isSubmitted && (
                <div className={styles.addNoteBox}>
                  <textarea 
                    className={styles.noteTextarea}
                    placeholder="Ketik catatan baru di sini..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                  />
                  <button className={styles.addNoteBtn} onClick={handleAddNote}>
                    <Plus size={16} /> Tambah Catatan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STATE A: MY ASSIGNED CASES (Default)
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Analis Workspace</h1>
        <p className={styles.pageSubtitle}>Kasus yang ditugaskan kepada Anda</p>
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Request No.</th>
                <th>Use Case</th>
                <th>Requester</th>
                <th>Deadline (SLA)</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignedCases.length > 0 ? assignedCases.map((req, idx) => (
                <tr key={req.id}>
                  <td className={styles.rowNum}>{String(idx + 1).padStart(2, '0')}</td>
                  <td><span className={styles.requestNo}>{req.requestNo}</span></td>
                  <td className={styles.useCaseCell}>{req.useCase}</td>
                  <td className={styles.requesterCell}>{req.division}</td>
                  <td className={styles.deadlineCell}>{req.updatedAt}</td>
                  <td>
                    <span className={`${styles.priorityPill} ${styles[req.priority]}`}>
                      {req.priority.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className={styles.statusGroup}>
                      <span className={`${styles.statusDot} ${styles[req.status]}`} />
                      <span className={styles.statusText}>{req.status.replace('_', ' ').toUpperCase()}</span>
                    </div>
                  </td>
                  <td>
                    <button 
                      className={styles.openBtn}
                      onClick={() => setActiveCase(req)}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className={styles.emptyState}>
                    Tidak ada kasus yang ditugaskan kepada Anda saat ini.
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

export default function AnalisWorkspacePage() {
  return (
    <Suspense fallback={<div>Loading workspace...</div>}>
      <AnalisWorkspaceContent />
    </Suspense>
  );
}
