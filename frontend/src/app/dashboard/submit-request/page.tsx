'use client';

import { useState } from 'react';
import { Send, FileText, Smartphone, Laptop, HardDrive, PackageOpen } from 'lucide-react';
import styles from './submit-request.module.css';

export default function SubmitRequestPage() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadio = (val: string) => {
    setFormData((prev) => ({ ...prev, lingkup: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Request Submitted successfully!');
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Submit Forensics Request</h1>
          <p className={styles.subtitle}>Lengkapi informasi berikut untuk memulai proses analisa digital</p>
        </div>
      </div>

      <form className={styles.formContainer} onSubmit={handleSubmit}>
        
        {/* Section 1: Informasi Pemohon */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconBox}><FileText size={20} /></div>
            <h2 className={styles.cardTitle}>Informasi Pemohon</h2>
          </div>
          <div className={styles.grid}>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Nama Lengkap</label>
              <input className={styles.input} type="text" name="nama" placeholder="Masukkan nama lengkap" value={formData.nama} onChange={handleChange} />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>NIP</label>
              <input className={styles.input} type="text" name="nip" placeholder="Masukkan NIP" value={formData.nip} onChange={handleChange} />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Jabatan</label>
              <input className={styles.input} type="text" name="jabatan" placeholder="Masukkan jabatan" value={formData.jabatan} onChange={handleChange} />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Satuan Kerja</label>
              <input className={styles.input} type="text" name="satuanKerja" placeholder="Masukkan satuan kerja" value={formData.satuanKerja} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Section 2: Informasi Permohonan */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconBox}><PackageOpen size={20} /></div>
            <h2 className={styles.cardTitle}>Detail Permohonan</h2>
          </div>
          <div className={styles.grid}>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Lingkup Permohonan</label>
              <div className={styles.segmentedControl}>
                <div 
                  className={`${styles.segment} ${formData.lingkup === 'baru' ? styles.segmentActive : ''}`}
                  onClick={() => handleRadio('baru')}
                >
                  Permohonan Baru
                </div>
                <div 
                  className={`${styles.segment} ${formData.lingkup === 'tambahan' ? styles.segmentActive : ''}`}
                  onClick={() => handleRadio('tambahan')}
                >
                  Tambahan Lingkup
                </div>
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
          <div className={`${styles.inputWrapper} ${styles.mt4}`}>
            <label className={styles.label}>Tambahan Informasi</label>
            <textarea 
              className={styles.textarea} 
              name="tambahanInformasi" 
              rows={4} 
              placeholder="Berikan detail tambahan yang relevan dengan kasus..."
              value={formData.tambahanInformasi} 
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* Section 3: Barang Bukti */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconBox}><HardDrive size={20} /></div>
            <h2 className={styles.cardTitle}>Identitas Barang Bukti</h2>
          </div>
          <div className={styles.grid}>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Jenis Barang Bukti</label>
              <div className={styles.visualSelect}>
                {['Handphone', 'Laptop', 'Hard Disk'].map((type) => (
                  <div 
                    key={type}
                    className={`${styles.visualOption} ${formData.jenisBarangBukti === type ? styles.visualOptionActive : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, jenisBarangBukti: type }))}
                  >
                    {type === 'Handphone' && <Smartphone size={24} />}
                    {type === 'Laptop' && <Laptop size={24} />}
                    {type === 'Hard Disk' && <HardDrive size={24} />}
                    <span>{type}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.gridInner}>
              <div className={styles.inputWrapper}>
                <label className={styles.label}>Kondisi Barang Bukti</label>
                <select className={styles.select} name="kondisiBarangBukti" value={formData.kondisiBarangBukti} onChange={handleChange}>
                  <option>Terkunci</option>
                  <option>Terbuka</option>
                  <option>Rusak Fisik</option>
                </select>
              </div>
              <div className={styles.inputWrapper}>
                <label className={styles.label}>Merk / Model</label>
                <input className={styles.input} type="text" name="merkModel" placeholder="Misal: iPhone 14 Pro" value={formData.merkModel} onChange={handleChange} />
              </div>
              <div className={styles.inputWrapper}>
                <label className={styles.label}>Nomor Seri</label>
                <input className={styles.input} type="text" name="nomorSeri" placeholder="Masukkan nomor seri" value={formData.nomorSeri} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.formActions}>
          <button type="button" className={styles.btnSecondary}>Save as Draft</button>
          <button type="submit" className={styles.btnPrimary}>
            <span>Submit Request</span>
            <Send size={18} />
          </button>
        </div>

      </form>
    </div>
  );
}
