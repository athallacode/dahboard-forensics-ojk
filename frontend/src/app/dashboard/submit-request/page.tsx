'use client';

import { useState } from 'react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Request Submitted successfully!');
  };

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
              <label className={styles.label}>Nama</label>
              <input className={styles.input} type="text" name="nama" value={formData.nama} onChange={handleChange} />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Jabatan</label>
              <input className={styles.input} type="text" name="jabatan" value={formData.jabatan} onChange={handleChange} />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>NIP</label>
              <input className={styles.input} type="text" name="nip" value={formData.nip} onChange={handleChange} />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Satuan Kerja</label>
              <input className={styles.input} type="text" name="satuanKerja" value={formData.satuanKerja} onChange={handleChange} />
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
                  <input 
                    type="radio" 
                    name="lingkup" 
                    value="baru" 
                    checked={formData.lingkup === 'baru'} 
                    onChange={handleChange} 
                    className={styles.radioInput}
                  />
                  Permohonan Baru
                </label>
                <label className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="lingkup" 
                    value="tambahan" 
                    checked={formData.lingkup === 'tambahan'} 
                    onChange={handleChange} 
                    className={styles.radioInput}
                  />
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
            <textarea 
              className={styles.textarea} 
              name="tambahanInformasi" 
              value={formData.tambahanInformasi} 
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* Section 3: Barang Bukti and Actions */}
        <div className={styles.bottomSection}>
          <div className={styles.section3Card}>
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
                <label className={styles.label}>Merk / Model</label>
                <input className={styles.input} type="text" name="merkModel" value={formData.merkModel} onChange={handleChange} />
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
                <label className={styles.label}>Nomor Seri</label>
                <input className={styles.input} type="text" name="nomorSeri" value={formData.nomorSeri} onChange={handleChange} />
              </div>
            </div>
          </div>
          
          <div className={styles.formActions}>
            <button type="submit" className={styles.btnPrimary}>Submit Request</button>
            <button type="button" className={styles.btnSecondary}>Save Draft</button>
          </div>
        </div>

      </form>
    </div>
  );
}
