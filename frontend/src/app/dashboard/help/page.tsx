'use client';

import { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  MessageCircle,
  BookOpen,
  Shield,
  Mail,
  Phone,
} from 'lucide-react';
import styles from './help.module.css';

const faqItems = [
  {
    category: 'Umum',
    questions: [
      { q: 'Apa itu LPBTI OJK?', a: 'LPBTI (Laboratorium Pemeriksaan Berbasis Teknologi Informasi) adalah unit kerja OJK yang mendukung pemeriksaan dan validasi bukti elektronik dalam proses pengawasan dan pemeriksaan khusus sektor jasa keuangan.' },
      { q: 'Siapa yang bisa mengakses dashboard ini?', a: 'Dashboard ini hanya bisa diakses oleh karyawan internal OJK yang telah terdaftar dan memiliki akun aktif. Akses dibatasi melalui SSO dan Multi-Factor Authentication.' },
      { q: 'Bagaimana cara mengubah kata sandi?', a: 'Kata sandi dapat diubah melalui portal SSO instansi. Klik ikon profil di pojok kanan atas, lalu pilih "Pengaturan" untuk diarahkan ke portal SSO.' },
    ],
  },
  {
    category: 'Request & Pemeriksaan',
    questions: [
      { q: 'Bagaimana cara mengajukan request pemeriksaan baru?', a: 'Navigasi ke menu "Submit Request", isi formulir dengan lengkap termasuk use case, deskripsi pemeriksaan, prioritas, dan lampirkan dokumen pendukung jika ada. Setelah submit, request akan masuk ke antrian supervisor untuk persetujuan.' },
      { q: 'Berapa lama proses persetujuan request?', a: 'Proses persetujuan umumnya memakan waktu 1-3 hari kerja, tergantung beban kerja dan prioritas request. Request dengan prioritas "High" akan diproses lebih cepat.' },
      { q: 'Bagaimana cara melihat status request saya?', a: 'Buka menu "My Request" untuk melihat seluruh daftar request Anda beserta statusnya (Pending, On Progress, Completed, Rejected).' },
    ],
  },
  {
    category: 'Evidence & Dokumen',
    questions: [
      { q: 'Format file apa saja yang didukung untuk upload evidence?', a: 'Sistem mendukung berbagai format file termasuk disk image (.img, .dd), archive (.zip, .rar, .7z), dokumen (.pdf, .docx, .xlsx), email archive (.pst, .mbox), dan file gambar (.png, .jpg, .bmp). Batas ukuran per file adalah 50 GB.' },
      { q: 'Apakah file evidence yang sudah diupload bisa dihapus?', a: 'Tidak. Sistem menggunakan mekanisme write-once storage untuk memastikan integritas bukti digital. File yang sudah diupload tidak bisa dihapus atau dimodifikasi. Namun, Anda bisa mengupload versi baru dari file tersebut.' },
      { q: 'Bagaimana keamanan file evidence dijamin?', a: 'File evidence dienkripsi server-side menggunakan AES-256. Setiap akses dan perubahan dicatat dalam audit trail immutable. Checksum SHA-256 digunakan untuk memverifikasi integritas file.' },
    ],
  },
];

export default function HelpPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    const newSet = new Set(openItems);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setOpenItems(newSet);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Help & FAQ</h1>
        <p className={styles.subtitle}>Temukan jawaban atas pertanyaan Anda</p>
      </div>

      {/* Quick Links */}
      <div className={styles.quickLinks}>
        <div className={styles.quickLink}>
          <BookOpen size={24} />
          <h3>Panduan Pengguna</h3>
          <p>Pelajari cara menggunakan semua fitur dashboard</p>
        </div>
        <div className={styles.quickLink}>
          <Shield size={24} />
          <h3>Kebijakan Keamanan</h3>
          <p>Informasi tentang keamanan data dan privasi</p>
        </div>
        <div className={styles.quickLink}>
          <MessageCircle size={24} />
          <h3>Hubungi Support</h3>
          <p>Butuh bantuan lebih lanjut? Hubungi tim IT</p>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className={styles.faqSections}>
        {faqItems.map((section) => (
          <div key={section.category} className={styles.faqSection}>
            <h2 className={styles.sectionTitle}>{section.category}</h2>
            <div className={styles.faqList}>
              {section.questions.map((item, idx) => {
                const key = `${section.category}-${idx}`;
                const isOpen = openItems.has(key);
                return (
                  <div
                    key={key}
                    className={`${styles.faqItem} ${isOpen ? styles.open : ''}`}
                  >
                    <button className={styles.faqQuestion} onClick={() => toggleItem(key)}>
                      <HelpCircle size={18} className={styles.qIcon} />
                      <span>{item.q}</span>
                      <ChevronDown size={18} className={`${styles.chevron} ${isOpen ? styles.rotated : ''}`} />
                    </button>
                    {isOpen && (
                      <div className={styles.faqAnswer}>
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className={styles.contactCard}>
        <h3>Masih butuh bantuan?</h3>
        <p>Hubungi tim IT Support untuk bantuan lebih lanjut</p>
        <div className={styles.contactInfo}>
          <div className={styles.contactItem}>
            <Mail size={16} />
            <span>it-support@ojk.go.id</span>
          </div>
          <div className={styles.contactItem}>
            <Phone size={16} />
            <span>Ext. 5555</span>
          </div>
        </div>
      </div>
    </div>
  );
}
