'use client';

import { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  UserPlus,
  X,
  AlertCircle,
  Package,
  PackageCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './case-assignment.module.css';

// Mock Data Types
// Intake = catatan serah terima barang bukti FISIK di Lab.
// Menjadi entri pertama chain of custody; Verify terkunci sebelum intake tercatat.
type Intake = {
  receivedBy: string;
  sealNo: string;
  condition: string;
  serialMatch: boolean;
  receivedAt: string;
};

type RequestRow = {
  id: string;
  requestNo: string;
  useCase: string;
  requester: string;
  date: string;
  serialNo: string; // no. seri yang diisi pemohon di form — dicocokkan dengan fisik saat intake
  status: 'unverified' | 'verified';
  intake?: Intake;
};

const initialRequests: RequestRow[] = [
  { id: '1', requestNo: 'REQ-2026-001', useCase: 'Pemeriksaan HP Tersangka Penipuan', requester: 'Departemen Penyidikan', date: '04 Juli 2026', serialNo: 'SN-8937492XA', status: 'unverified' },
  { id: '2', requestNo: 'REQ-2026-002', useCase: 'Akuisisi Data Server Keuangan', requester: 'Departemen Pengawasan', date: '04 Juli 2026', serialNo: 'SRV-2201-BX7', status: 'unverified' },
  { id: '3', requestNo: 'REQ-2026-003', useCase: 'Analisis Log Aplikasi Internal', requester: 'Tim Audit Internal', date: '05 Juli 2026', serialNo: 'APP-LOG-0093', status: 'unverified' },
];

const analysts = [
  { id: 'a1', name: 'Putri Apriani', workload: 72 },
  { id: 'a3', name: 'Haniefah Muslimah', workload: 67 },
];

export default function CaseAssignmentPage() {
  const { user } = useAuth();
  // Pembagian kewenangan (ISO/IEC 17025):
  // - SFD (analis_lab)  : mencatat serah terima fisik (intake) saat jaga loket
  // - Kepala Lab        : Verify / Reject permohonan (setelah intake tercatat)
  // - Manajer Teknis    : menugaskan kasus terverifikasi ke SFD
  const isSupervisor = user?.role === 'supervisor';
  const isTechManager = user?.role === 'manajer_teknis';
  const [activeTab, setActiveTab] = useState<'unverified' | 'verified'>(
    user?.role === 'manajer_teknis' ? 'verified' : 'unverified'
  );
  const [requests, setRequests] = useState<RequestRow[]>(initialRequests);
  
  // Modals / Drawers State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestRow | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAnalyst, setSelectedAnalyst] = useState<string>('');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState('');

  // Intake (konfirmasi serah terima barang bukti fisik)
  const [intakeModalOpen, setIntakeModalOpen] = useState(false);
  const [intakeReceiver, setIntakeReceiver] = useState('');
  const [intakeSeal, setIntakeSeal] = useState('');
  const [intakeCondition, setIntakeCondition] = useState('Baik (Tersegel)');
  const [intakeSerialMatch, setIntakeSerialMatch] = useState(false);

  const [toastMessage, setToastMessage] = useState('');

  // Derived Data
  const currentData = requests.filter(r => r.status === activeTab);

  const handleVerify = (id: string) => {
    const req = requests.find(r => r.id === id);
    if (!req?.intake) return; // Verify terkunci sampai barang fisik diterima & cocok
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'verified' } : r));
    showToast('Permohonan berhasil diverifikasi.');
  };

  const handleIntakeClick = (req: RequestRow) => {
    setSelectedRequest(req);
    setIntakeReceiver(user?.name ?? ''); // penerima default: user yang sedang login
    setIntakeSeal('');
    setIntakeCondition('Baik (Tersegel)');
    setIntakeSerialMatch(false);
    setIntakeModalOpen(true);
  };

  const submitIntake = () => {
    if (!selectedRequest || !intakeSerialMatch || !intakeReceiver.trim() || !intakeSeal.trim()) return;
    const intake: Intake = {
      receivedBy: intakeReceiver.trim(),
      sealNo: intakeSeal.trim(),
      condition: intakeCondition,
      serialMatch: true,
      receivedAt: new Date().toLocaleString('id-ID'),
    };
    setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, intake } : r));
    setIntakeModalOpen(false);
    showToast('Serah terima barang bukti tercatat (entri pertama chain of custody).');
  };

  const handleRejectClick = (req: RequestRow) => {
    setSelectedRequest(req);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const submitReject = () => {
    if (!selectedRequest) return;
    setRequests(prev => prev.filter(r => r.id !== selectedRequest.id));
    setRejectModalOpen(false);
    showToast('Permohonan telah ditolak.');
  };

  const handleAssignClick = (req: RequestRow) => {
    setSelectedRequest(req);
    setSelectedAnalyst('');
    setPriority('Medium');
    setDeadline('');
    setDrawerOpen(true);
  };

  const submitAssignment = () => {
    if (!selectedRequest || !selectedAnalyst || !deadline) return;
    setRequests(prev => prev.filter(r => r.id !== selectedRequest.id));
    setDrawerOpen(false);
    showToast('Kasus berhasil ditugaskan ke analis.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className={styles.page}>
      
      {toastMessage && (
        <div className={styles.toast}>
          <CheckCircle size={16} /> {toastMessage}
        </div>
      )}

      <div className={styles.header}>
        <h1 className={styles.title}>
          {isSupervisor ? 'Verifikasi Permohonan' : isTechManager ? 'Penugasan Kasus' : 'Penerimaan Barang Bukti'}
        </h1>
        <p className={styles.subtitle}>
          {isSupervisor
            ? 'Verifikasi permohonan masuk. Penugasan ke SFD dilakukan Manajer Teknis.'
            : isTechManager
            ? 'Tugaskan permohonan terverifikasi kepada Spesialis Forensik Digital sesuai beban kerja.'
            : 'Catat serah terima barang bukti fisik dari pemohon. Verifikasi tetap dilakukan Kepala Lab.'}
        </p>
      </div>

      {/* Tabs — SFD hanya antrean penerimaan; Manajer Teknis fokus penugasan */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'unverified' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('unverified')}
        >
          {isSupervisor ? 'Menunggu Verifikasi' : isTechManager ? 'Belum Terverifikasi' : 'Menunggu Penerimaan'}
        </button>
        {(isSupervisor || isTechManager) && (
          <button
            className={`${styles.tabBtn} ${activeTab === 'verified' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('verified')}
          >
            Siap Ditugaskan
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Request No.</th>
                <th>Use Case</th>
                <th>Requester</th>
                <th>Tanggal</th>
                <th>Barang Bukti Fisik</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? currentData.map((req, idx) => (
                <tr key={req.id}>
                  <td className={styles.rowNum}>{String(idx + 1).padStart(2, '0')}</td>
                  <td><span className={styles.requestNo}>{req.requestNo}</span></td>
                  <td className={styles.useCaseCell}>{req.useCase}</td>
                  <td className={styles.requesterCell}>{req.requester}</td>
                  <td className={styles.dateCell}>{req.date}</td>
                  <td>
                    {req.intake ? (
                      <span className={styles.physOk} title={`Diterima oleh ${req.intake.receivedBy} — segel ${req.intake.sealNo}`}>
                        <PackageCheck size={13} /> Diterima &amp; cocok
                      </span>
                    ) : (
                      <span className={styles.physPending}>
                        <Package size={13} /> Belum diterima
                      </span>
                    )}
                  </td>
                  <td>
                    {activeTab === 'unverified' ? (
                      <div className={styles.actionGroup}>
                        {!req.intake && !isTechManager && (
                          <button className={styles.intakeBtn} onClick={() => handleIntakeClick(req)}>
                            <Package size={14} /> Terima Fisik
                          </button>
                        )}
                        {isSupervisor ? (
                          <>
                            <button
                              className={styles.verifyBtn}
                              onClick={() => handleVerify(req.id)}
                              disabled={!req.intake}
                              title={req.intake ? 'Verifikasi permohonan' : 'Terkunci: barang bukti fisik belum diterima'}
                            >
                              <CheckCircle size={14} /> Verify
                            </button>
                            <button className={styles.rejectBtn} onClick={() => handleRejectClick(req)}>
                              <XCircle size={14} /> Reject
                            </button>
                          </>
                        ) : isTechManager ? (
                          <span className={styles.waitNote}>
                            {req.intake ? 'Menunggu verifikasi Kepala Lab' : 'Barang bukti belum diterima'}
                          </span>
                        ) : (
                          req.intake && <span className={styles.waitNote}>Menunggu verifikasi Kepala Lab</span>
                        )}
                      </div>
                    ) : isTechManager ? (
                      <button className={styles.assignBtn} onClick={() => handleAssignClick(req)}>
                        <UserPlus size={14} /> Assign
                      </button>
                    ) : (
                      <span className={styles.waitNote}>Menunggu penugasan Manajer Teknis</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    Tidak ada data pada tab ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Tolak Permohonan</h3>
            <p className={styles.modalSubtitle}>Sertakan alasan penolakan untuk dikirimkan ke pemohon.</p>
            <textarea 
              className={styles.textarea} 
              rows={4} 
              placeholder="Alasan penolakan..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setRejectModalOpen(false)}>Batal</button>
              <button 
                className={styles.confirmRejectBtn} 
                onClick={submitReject}
                disabled={!rejectReason.trim()}
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Intake Modal — konfirmasi serah terima barang bukti fisik */}
      {intakeModalOpen && selectedRequest && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: 460 }}>
            <h3 className={styles.modalTitle}>Konfirmasi Serah Terima Barang Bukti</h3>
            <p className={styles.modalSubtitle}>
              #{selectedRequest.requestNo} — {selectedRequest.useCase}
            </p>

            <div className={styles.serialBox}>
              <span className={styles.serialLabel}>No. Seri menurut formulir pemohon</span>
              <span className={styles.serialValue}>{selectedRequest.serialNo}</span>
            </div>

            <label className={styles.checkRow}>
              <input
                type="checkbox"
                checked={intakeSerialMatch}
                onChange={(e) => setIntakeSerialMatch(e.target.checked)}
              />
              <span>Nomor seri <b>cocok</b> dengan barang fisik yang diterima</span>
            </label>

            <div className={styles.formGroup}>
              <label className={styles.label}>Nama Penerima</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Petugas Lab yang menerima..."
                value={intakeReceiver}
                onChange={(e) => setIntakeReceiver(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Nomor Label / Segel Bukti</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Contoh: SEAL-2026-0142"
                value={intakeSeal}
                onChange={(e) => setIntakeSeal(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Kondisi Saat Diterima</label>
              <select
                className={styles.select}
                value={intakeCondition}
                onChange={(e) => setIntakeCondition(e.target.value)}
              >
                <option>Baik (Tersegel)</option>
                <option>Baik (Tidak Tersegel)</option>
                <option>Rusak Ringan</option>
                <option>Rusak Berat</option>
              </select>
            </div>

            <p className={styles.intakeNote}>
              <AlertCircle size={13} /> Waktu terima dicatat otomatis dan menjadi entri pertama chain of custody.
            </p>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setIntakeModalOpen(false)}>Batal</button>
              <button
                className={styles.confirmIntakeBtn}
                onClick={submitIntake}
                disabled={!intakeSerialMatch || !intakeReceiver.trim() || !intakeSeal.trim()}
              >
                Catat Serah Terima
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Drawer */}
      {drawerOpen && (
        <div className={styles.drawerOverlay} onClick={() => setDrawerOpen(false)}>
          <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>Penugasan Kasus</h2>
              <button className={styles.closeBtn} onClick={() => setDrawerOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.drawerBody}>
              <div className={styles.requestSummary}>
                <span className={styles.reqBadge}>#{selectedRequest?.requestNo}</span>
                <h4>{selectedRequest?.useCase}</h4>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Pilih Analis Forensik</label>
                <div className={styles.analystList}>
                  {analysts.map(analyst => {
                    let wClass = styles.loadNormal;
                    if(analyst.workload > 75) wClass = styles.loadHigh;
                    else if(analyst.workload > 60) wClass = styles.loadMedium;

                    return (
                      <div 
                        key={analyst.id} 
                        className={`${styles.analystCard} ${selectedAnalyst === analyst.id ? styles.selectedAnalyst : ''}`}
                        onClick={() => setSelectedAnalyst(analyst.id)}
                      >
                        <div className={styles.analystTop}>
                          <span className={styles.analystName}>{analyst.name}</span>
                          <span className={styles.analystLoad}>{analyst.workload}% Load</span>
                        </div>
                        <div className={styles.progressTrack}>
                          <div className={`${styles.progressBar} ${wClass}`} style={{ width: `${analyst.workload}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Prioritas (SLA)</label>
                <select className={styles.select} value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Deadline</label>
                <input 
                  type="date" 
                  className={styles.input} 
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                />
              </div>

            </div>

            <div className={styles.drawerFooter}>
              <button 
                className={styles.submitAssignBtn} 
                onClick={submitAssignment}
                disabled={!selectedAnalyst || !deadline}
              >
                Tugaskan Analis
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
