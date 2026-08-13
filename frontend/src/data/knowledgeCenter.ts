export const useCases = [
  {
    id: 'uc1',
    title: 'Pemeriksaan Perangkat Handphone',
    description: 'Analisis dan ekstraksi data dari perangkat mobile (iOS & Android) untuk mencari bukti percakapan, lokasi, dan dokumen transaksi.',
    supervisoryContext: 'Sering digunakan untuk kasus penipuan nasabah (phishing/social engineering) atau komunikasi internal tidak sah.',
    potensiPemanfaatan: 'Mendapatkan log panggilan terhapus, chat WhatsApp, dan aplikasi pihak ketiga.',
    addedValue: 'Memperkuat bukti niat (mens rea) dalam pelanggaran kode etik atau fraud eksternal.',
    sektorRelevan: ['Perbankan', 'Pasar Modal', 'Asuransi', 'IAKD']
  },
  {
    id: 'uc2',
    title: 'Pemeriksaan Perangkat Komputer',
    description: 'Akuisisi forensik disk image bit-by-bit dan analisis sistem operasi, registry, serta file system (Windows, macOS, Linux).',
    supervisoryContext: 'Investigasi kebocoran data, manipulasi laporan keuangan di PC kantor, atau penggunaan alat peretas internal.',
    potensiPemanfaatan: 'Pemulihan dokumen terhapus, analisis timeline eksekusi aplikasi, analisis artefak USB.',
    addedValue: 'Menelusuri jejak akses dokumen konfidensial secara kronologis.',
    sektorRelevan: ['Perbankan', 'Pasar Modal']
  },
  {
    id: 'uc3',
    title: 'Pemeriksaan Komunikasi Digital',
    description: 'Parsing dan analisis log server email, arsip Exchange (PST/OST), serta platform kolaborasi perusahaan.',
    supervisoryContext: 'Mengungkap kolusi antar entitas jasa keuangan, insider trading, atau manipulasi pasar.',
    potensiPemanfaatan: 'Recovery email yang dihapus permanen dari sisi klien, analisis metadata header email.',
    addedValue: 'Pembuktian komunikasi rahasia sebelum transaksi pasar yang mencurigakan.',
    sektorRelevan: ['Pasar Modal', 'IAKD']
  },
  {
    id: 'uc4',
    title: 'Validasi Dokumen Elektronik',
    description: 'Verifikasi integritas file, analisis metadata file PDF/Office, dan pengecekan otentikasi Tanda Tangan Elektronik.',
    supervisoryContext: 'Pembuktian pemalsuan polis asuransi, adendum kredit, atau dokumen pendaftaran penyelenggara Fintech.',
    potensiPemanfaatan: 'Deteksi tanggal modifikasi dokumen, jejak printer, pemalsuan stempel digital.',
    addedValue: 'Membedakan antara dokumen asli dan yang telah dimanipulasi pasca penandatanganan.',
    sektorRelevan: ['Asuransi', 'Perbankan', 'IAKD']
  }
];

export const services = [
  {
    id: 'sv1',
    title: 'Digital Evidence Extraction',
    description: 'Layanan akuisisi data dari berbagai sumber perangkat elektronik menggunakan standar forensik internasional yang menjamin integritas (chain of custody).',
    deliverables: [
      'Raw Disk Image (E01/DD)',
      'Laporan Akuisisi (Hash MD5/SHA256)',
      'Dokumentasi Fotografi Perangkat'
    ],
    sla: '3-7 Hari Kerja'
  },
  {
    id: 'sv2',
    title: 'Data Recovery & Parsing',
    description: 'Pemulihan data yang terhapus secara sengaja maupun tidak sengaja, dari perangkat yang diformat atau mengalami kerusakan ringan secara logikal.',
    deliverables: [
      'Direktori file terpulihkan',
      'Laporan daftar file (CSV)',
      'Analisis struktur data rusak'
    ],
    sla: '7-14 Hari Kerja'
  },
  {
    id: 'sv3',
    title: 'Digital Signature Validation',
    description: 'Pengecekan validitas dan rantai sertifikat (Certification Authority) pada dokumen elektronik sesuai standar UU ITE Indonesia.',
    deliverables: [
      'Sertifikat Validasi Digital',
      'Detail Metadata Penandatangan',
      'Log Audit Perubahan File'
    ],
    sla: '1-3 Hari Kerja'
  },
  {
    id: 'sv4',
    title: 'Consulting & Advisory',
    description: 'Bimbingan teknis terkait mitigasi insiden siber, penyusunan SOP pengamanan bukti digital, serta telaah aspek teknologi dalam kasus hukum (Saksi Ahli).',
    deliverables: [
      'Dokumen Rekomendasi Mitigasi',
      'Revisi SOP Internal',
      'Keterangan Ahli (Tertulis/Lisan)'
    ],
    sla: 'Tentative (sesuai kompleksitas)'
  }
];

export const resources = [
  {
    id: 'rs1',
    title: 'Form Berita Acara Penyerahan Barang Bukti',
    type: 'DOCX',
    size: '124 KB'
  },
  {
    id: 'rs2',
    title: 'Pedoman Penanganan HP Terkunci di Lapangan',
    type: 'PDF',
    size: '2.4 MB'
  },
  {
    id: 'rs3',
    title: 'Video Edukasi: Pengemasan Barang Bukti Bebas Statis',
    type: 'VIDEO',
    size: '145 MB'
  },
  {
    id: 'rs4',
    title: 'Ringkasan Regulasi Forensik (UU ITE & POJK)',
    type: 'PDF',
    size: '800 KB'
  }
];

export const guidelines = [
  {
    id: 'gl1',
    title: 'Syarat Penyerahan Bukti Fisik',
    steps: [
      'Perangkat harus dalam keadaan mati (powered off) kecuali diperintahkan sebaliknya oleh ahli.',
      'Dimasukkan ke dalam tas anti-statis (Faraday bag) jika perangkat masih hidup untuk mencegah remote wipe.',
      'Disegel dengan stiker tamper-evident yang ditandatangani oleh pemohon dan saksi.',
      'Sertakan catatan PIN/Password/Pattern kunci layar jika diketahui pada lampiran terpisah.'
    ]
  },
  {
    id: 'gl2',
    title: 'SLA per Jenis Layanan Forensik',
    steps: [
      'Pemeriksaan Perangkat Handphone: Estimasi 10 Hari Kerja (tergantung tingkat enkripsi dan ukuran storage).',
      'Pemeriksaan Komputer/Laptop: Estimasi 14 Hari Kerja per perangkat.',
      'Validasi Dokumen Elektronik / Tanda Tangan: Estimasi 3 Hari Kerja per dokumen.',
      'SLA dapat berubah apabila diperlukan metode ekstraksi fisik (chip-off) atau bruteforce mandiri.'
    ]
  },
  {
    id: 'gl3',
    title: 'Etika & Kerahasiaan Data (Code of Conduct)',
    steps: [
      'Analis hanya mengekstraksi dan membaca data yang relevan dengan lingkup permohonan surat tugas.',
      'Penyimpanan bukti digital diletakkan pada Cold Storage (brankas vault) berlapis tanpa akses internet.',
      'Setiap akses ke raw data akan tercatat secara otomatis ke dalam sistem Immutable Log SIEM OJK.',
      'Tidak diperkenankan menggandakan bukti digital keluar dari lingkungan laboratorium tanpa otorisasi tertulis.'
    ]
  }
];
