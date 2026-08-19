# OJK Digital Forensics Dashboard (LPBTI)

Aplikasi Web Dashboard Forensik Digital yang dirancang khusus untuk mengelola, melacak, dan memantau kegiatan investigasi serta analisis forensik digital di lingkungan **Otoritas Jasa Keuangan (OJK)**. Aplikasi ini dibangun dengan performa tinggi menggunakan **Next.js App Router**, **TypeScript**, dan desain antarmuka modern menggunakan **Vanilla CSS Modules** (tanpa utility CSS framework) agar tetap ringan, fleksibel, dan memiliki visual yang premium.

---

## 🚀 Fitur Utama

Aplikasi ini mencakup modul-modul penting berikut:

1. **Dashboard & Overview**: Statistik ringkas terkait status kasus forensik, beban kerja analis, dan grafik analisis data terbaru menggunakan Chart.js.
2. **Case Assignment**: Modul penugasan kasus forensik secara efisien kepada para analis digital forensik yang tersedia.
3. **Analis Workspace**: Ruang kerja digital khusus analis untuk melakukan analisis kasus, mencatat temuan, dan mengunggah dokumen terkait.
4. **Evidence Tracker**: Pencatatan dan pelacakan barang bukti digital secara terstruktur guna menjaga integritas *chain of custody*.
5. **Workload Monitoring**: Memantau kapasitas beban kerja dan ketersediaan dari masing-masing personil analis secara real-time.
6. **Report & Report Review**: Pembuatan draf laporan forensik dan proses peninjauan (review) dokumen laporan investigasi sebelum disetujui.
7. **Submit & My Request**: Formulir pengajuan investigasi forensik baru bagi pihak pemohon beserta status pelacakan permintaan mereka secara dinamis.
8. **Knowledge Center**: Pusat pengetahuan dan repositori dokumen panduan, referensi hukum, serta SOP terkait forensik digital.
9. **Role-Based Access Control (RBAC)**: Pembatasan akses halaman berdasarkan peran pengguna (seperti Analis, Kepala Tim/Supervisor, Pemohon) yang dilengkapi dengan proteksi halaman `access-denied`.

---

## 🛠️ Teknologi & Dependensi

Proyek ini dibangun menggunakan stack modern:
- **Framework**: [Next.js (v16.2.x)](https://nextjs.org/) (App Router)
- **Library UI**: [React (v19)](https://react.dev/)
- **Bahasa Pemrograman**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS Modules (CSS Murni dengan cakupan lokal per komponen)
- **Visualisasi Grafik**: [Chart.js](https://www.chartjs.org/) & [React ChartJS 2](https://react-chartjs-2.js.org/)
- **Icon Pack**: [Lucide React](https://lucide.dev/)

---

## 💻 Cara Menjalankan Proyek

Pastikan Anda telah menginstal **Node.js** (rekomendasi versi LTS terbaru) di komputer Anda sebelum memulai.

### 1. Kloning Repositori & Masuk ke Folder Project
```bash
git clone https://github.com/athallacode/dahboard-forensics-ojk.git
cd dahboard-forensics-ojk/vanilla-css/frontend
```

### 2. Instalasi Dependensi
Instal semua package/library yang dibutuhkan:
```bash
npm install
```

### 3. Jalankan Mode Development (Lokal)
Jalankan server pengembangan lokal:
```bash
npm run dev
```
Setelah berhasil berjalan, buka browser Anda dan akses:
- **Local**: `http://localhost:3000`

---

## 📦 Build untuk Production

Untuk melakukan build aplikasi ke mode produksi agar performa lebih optimal:

1. **Build Aplikasi:**
   ```bash
   npm run build
   ```
2. **Jalankan Aplikasi Mode Production:**
   ```bash
   npm run start
   ```

---

## 📂 Struktur Direktori Utama

```text
frontend/
├── public/                 # Aset statis (logo, gambar, dll.)
├── src/
│   ├── app/                # Next.js App Router Pages
│   │   ├── login/          # Halaman Login
│   │   ├── dashboard/      # Semua sub-halaman dashboard (analis, case, dll.)
│   │   └── access-denied/  # Halaman proteksi akses
│   ├── components/         # Komponen UI Reusable (Sidebar, Topbar, dll.)
│   ├── context/            # AuthContext & State Management Global
│   ├── data/               # Mock data untuk visualisasi & simulasi data
│   └── types/              # Deklarasi tipe TypeScript global
├── package.json            # Daftar dependensi & script proyek
└── tsconfig.json           # Konfigurasi TypeScript
```
