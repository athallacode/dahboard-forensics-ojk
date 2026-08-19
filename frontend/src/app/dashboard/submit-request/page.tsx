'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, FileText, X, CheckCircle2 } from 'lucide-react';
import styles from './submit-request.module.css';

type UploadedFile = {
  id: string;
  name: string;
  size: number;
  hash: string;
  isComputing: boolean;
};

export default function SubmitRequestPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    nama: '',
    jabatan: '',
    nip: '',
    satuanKerja: '',
    lingkup: 'baru',
    jenisLayanan: 'Pengecekan komunikasi elektronik',
    tambahanInformasi: '',
    jenisBarangBukti: 'Handphone',
    merkModel: '',
    kondisiBarangBukti: 'Terkunci',
    nomorSeri: '',
  });

  const [beritaAcara, setBeritaAcara] = useState<UploadedFile | null>(null);
  const [dukungan, setDukungan] = useState<UploadedFile[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedRequestNo, setGeneratedRequestNo] = useState('');

  const baInputRef = useRef<HTMLInputElement>(null);
  const dukunganInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    const requiredText = [
      formData.nama, formData.jabatan, formData.nip, formData.satuanKerja, 
      formData.merkModel, formData.nomorSeri
    ].every(val => val.trim().length > 0);
    
    return requiredText && beritaAcara !== null;
  };

  const handleFileUpload = (type: 'ba' | 'dukungan', files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach((file) => {
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        hash: 'computing…',
        isComputing: true
      };

      if (type === 'ba') {
        setBeritaAcara(newFile);
      } else {
        setDukungan(prev => [...prev, newFile]);
      }

      // Simulate Hash computation
      setTimeout(() => {
        const mockHash = Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
        if (type === 'ba') {
          setBeritaAcara(prev => prev?.id === newFile.id ? { ...prev, hash: mockHash, isComputing: false } : prev);
        } else {
          setDukungan(prev => prev.map(f => f.id === newFile.id ? { ...f, hash: mockHash, isComputing: false } : f));
        }
      }, 1000);
    });
  };

  const removeFile = (type: 'ba' | 'dukungan', id: string) => {
    if (type === 'ba') {
      setBeritaAcara(null);
      if (baInputRef.current) baInputRef.current.value = '';
    } else {
      setDukungan(prev => prev.filter(f => f.id !== id));
      if (dukunganInputRef.current) dukunganInputRef.current.value = '';
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderFileItem = (file: UploadedFile, type: 'ba' | 'dukungan') => (
    <div key={file.id} className={styles.fileItem}>
      <div className={styles.fileInfo}>
        <FileText size={20} className={styles.fileIcon} />
        <div className={styles.fileDetails}>
          <span className={styles.fileName}>{file.name}</span>
          <div className={styles.fileMeta}>
            <span>{formatSize(file.size)}</span>
            <span>•</span>
            <span className={`${styles.hashBadge} ${file.isComputing ? styles.computing : styles.done}`}>
              SHA-256: {file.isComputing ? 'computing…' : file.hash.substring(0, 16) + '...'}
            </span>
          </div>
        </div>
      </div>
      <button type="button" className={styles.removeBtn} onClick={() => removeFile(type, file.id)}>
        <X size={16} />
      </button>
    </div>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    // Simulate Submission
    const reqNo = `REQ-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2,'0')}-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedRequestNo(reqNo);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className={styles.page} style={{ textAlign: 'center', paddingTop: '60px' }}>
        <CheckCircle2 size={64} color="#16a34a" style={{ margin: '0 auto 24px' }} />
        <h1 className={styles.title}>Request Submitted!</h1>
        <p className={styles.subtitle} style={{ marginBottom: '24px' }}>
          Permohonan layanan forensik Anda telah disubmit. <b>Segera serahkan barang bukti fisik ke Admin Lab</b> beserta nomor referensi ini:
        </p>
        <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace', background: '#f1f5f9', padding: '12px 24px', display: 'inline-block', borderRadius: '8px', color: '#0f172a', marginBottom: '24px' }}>
          {generatedRequestNo}
        </div>
        <p className={styles.subtitle}>
          Silakan lacak status permohonan Anda di menu <a onClick={() => router.push('/dashboard/evidence-tracker')} style={{ color: '#a02020', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>Evidence Tracker</a>.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Submit Forensics Request</h1>
        <p className={styles.subtitle}>Lengkapi informasi berikut untuk mengajukan permohonan layanan</p>
      </div>

      <form className={styles.formContainer} onSubmit={handleSubmit}>
        
        {/* Section 1: Informasi Pemohon */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>1. Informasi Pemohon</h2>
          </div>
          <div className={styles.grid}>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Nama <span className={styles.asterisk}>*</span></label>
              <input className={styles.input} type="text" name="nama" value={formData.nama} onChange={handleChange} required />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Jabatan <span className={styles.asterisk}>*</span></label>
              <input className={styles.input} type="text" name="jabatan" value={formData.jabatan} onChange={handleChange} required />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>NIP <span className={styles.asterisk}>*</span></label>
              <input className={styles.input} type="text" name="nip" value={formData.nip} onChange={handleChange} required />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Satuan Kerja <span className={styles.asterisk}>*</span></label>
              <input className={styles.input} type="text" name="satuanKerja" value={formData.satuanKerja} onChange={handleChange} required />
            </div>
          </div>
        </div>

        {/* Section 2: Informasi Permohonan */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>2. Informasi Permohonan</h2>
          </div>
          <div className={styles.grid}>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Lingkup Permohonan</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input type="radio" name="lingkup" value="baru" checked={formData.lingkup === 'baru'} onChange={handleChange} className={styles.radioInput} />
                  Permohonan Baru
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="lingkup" value="tambahan" checked={formData.lingkup === 'tambahan'} onChange={handleChange} className={styles.radioInput} />
                  Tambahan Lingkup
                </label>
              </div>
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Jenis Layanan</label>
              <select className={styles.select} name="jenisLayanan" value={formData.jenisLayanan} onChange={handleChange}>
                <option>Pengecekan komunikasi elektronik</option>
                <option>Pemeriksaan perangkat komputer</option>
                <option>Validasi dokumen elektronik</option>
              </select>
            </div>
          </div>
          <div className={`${styles.inputWrapper} ${styles.mt3}`}>
            <label className={styles.label}>Tambahan Informasi</label>
            <textarea className={styles.textarea} name="tambahanInformasi" value={formData.tambahanInformasi} onChange={handleChange} />
          </div>
        </div>

        {/* Section 3 & 4 Layout */}
        <div className={styles.bottomSection}>
          <div className={styles.leftCol}>
            {/* Section 3: Identitas Barang Bukti */}
            <div className={styles.sectionCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>3. Identitas Barang Bukti</h2>
              </div>
              <div className={styles.grid}>
                <div className={styles.inputWrapper}>
                  <label className={styles.label}>Jenis Barang Bukti</label>
                  <select className={styles.select} name="jenisBarangBukti" value={formData.jenisBarangBukti} onChange={handleChange}>
                    <option>Handphone</option>
                    <option>Laptop</option>
                    <option>Hard Disk</option>
                  </select>
                </div>
                <div className={styles.inputWrapper}>
                  <label className={styles.label}>Merk / Model <span className={styles.asterisk}>*</span></label>
                  <input className={styles.input} type="text" name="merkModel" value={formData.merkModel} onChange={handleChange} required />
                </div>
                <div className={styles.inputWrapper}>
                  <label className={styles.label}>Kondisi Barang Bukti</label>
                  <select className={styles.select} name="kondisiBarangBukti" value={formData.kondisiBarangBukti} onChange={handleChange}>
                    <option>Terkunci</option>
                    <option>Terbuka</option>
                    <option>Rusak Fisik</option>
                  </select>
                </div>
                <div className={styles.inputWrapper}>
                  <label className={styles.label}>Nomor Seri <span className={styles.asterisk}>*</span></label>
                  <input className={styles.input} type="text" name="nomorSeri" value={formData.nomorSeri} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* Section 4: Upload Dokumen */}
            <div className={styles.sectionCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>4. Upload Dokumen</h2>
              </div>

              {/* Upload Slot A */}
              <div className={styles.uploadSlot}>
                <div className={styles.uploadHeader}>
                  <span className={styles.uploadTitle}>
                    Berita Acara Penyerahan Barang Bukti <span className={styles.asterisk}>*</span>
                  </span>
                  <span className={styles.templateLink}>Download template formulir</span>
                </div>
                <p className={styles.uploadHelper}>Wajib. Formulir resmi yang telah ditandatangani. (.pdf, max 10MB)</p>
                
                {!beritaAcara ? (
                  <div className={styles.dropzone} onClick={() => baInputRef.current?.click()}>
                    <UploadCloud size={24} className={styles.uploadIcon} />
                    <p className={styles.dropzoneText}>Klik atau Drag & Drop file ke sini</p>
                    <p className={styles.dropzoneSubtext}>Hanya file PDF</p>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      className={styles.hiddenInput} 
                      ref={baInputRef}
                      onChange={(e) => handleFileUpload('ba', e.target.files)}
                    />
                  </div>
                ) : (
                  <div className={styles.fileList}>
                    {renderFileItem(beritaAcara, 'ba')}
                  </div>
                )}
              </div>

              {/* Upload Slot B */}
              <div className={styles.uploadSlot}>
                <div className={styles.uploadHeader}>
                  <span className={styles.uploadTitle}>Dokumen Pendukung</span>
                </div>
                {/* BUKAN untuk file bukti asli. Barang bukti diserahkan secara fisik;
                    akuisisi/ekstraksi dilakukan personel Lab demi chain of custody. */}
                <p className={styles.uploadHelper}>Opsional. Dokumen administratif: foto serah terima barang bukti, surat tugas, atau lampiran administrasi lain. (Max 10MB/file)</p>

                <div className={styles.dropzone} onClick={() => dukunganInputRef.current?.click()}>
                  <UploadCloud size={24} className={styles.uploadIcon} />
                  <p className={styles.dropzoneText}>Klik atau Drag & Drop file ke sini</p>
                  <p className={styles.dropzoneSubtext}>.pdf, .jpg, .png, .docx</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.docx"
                    className={styles.hiddenInput} 
                    ref={dukunganInputRef}
                    onChange={(e) => handleFileUpload('dukungan', e.target.files)}
                  />
                </div>
                
                {dukungan.length > 0 && (
                  <div className={styles.fileList}>
                    {dukungan.map(file => renderFileItem(file, 'dukungan'))}
                  </div>
                )}
              </div>

            </div>
          </div>
          
          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.btnPrimary}
              disabled={!isFormValid()}
            >
              Submit Request
            </button>
            <button type="button" className={styles.btnSecondary}>Save Draft</button>
          </div>
        </div>

      </form>
    </div>
  );
}
