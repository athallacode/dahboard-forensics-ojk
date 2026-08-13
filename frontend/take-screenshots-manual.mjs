/**
 * Screenshot RINCI per langkah (32 gambar) untuk User Manual LPBTI OJK.
 * Hasil: docs/screenshots-manual/manual-01..32.png
 *
 * Cara pakai:
 *   Terminal 1: cd frontend && npm run dev   (biarkan jalan)
 *   Terminal 2: cd frontend && node take-screenshots-manual.mjs
 *
 * Memakai Google Chrome terpasang (channel: 'chrome') — tidak perlu playwright install.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'screenshots-manual');
mkdirSync(OUT, { recursive: true });
const BASE = 'http://localhost:3000';

// Pakai browser yang sudah terpasang (Chrome, lalu Edge) — tidak perlu download Chromium.
// Atau set env CHROME_BIN ke path chromium (dipakai di lingkungan Linux/CI).
let browser;
if (process.env.CHROME_BIN) {
  browser = await chromium.launch({
    executablePath: process.env.CHROME_BIN,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });
  console.log(`Menggunakan browser: ${process.env.CHROME_BIN}`);
}
if (!browser) for (const channel of ['chrome', 'msedge']) {
  try {
    browser = await chromium.launch({ channel });
    console.log(`Menggunakan browser: ${channel}`);
    break;
  } catch {
    console.log(`${channel} tidak ditemukan, mencoba berikutnya...`);
  }
}
if (!browser) {
  console.error('Chrome/Edge tidak ditemukan di komputer ini.');
  process.exit(1);
}
const page = await browser.newPage({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 1, // scale 1 agar ukuran file kecil (hemat disk)
});
page.on('dialog', (d) => d.accept());

// Selalu tangkap seukuran layar (16:10) — BUKAN full page — supaya semua
// gambar di manual seragam bentuknya dan layout Word tetap rapi.
const shot = async (name) => {
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, name) });
  console.log('  ✔', name);
};

// Navigasi via sidebar (client-side) — reload menghapus sesi login
const nav = async (href) => {
  await page.locator(`a[href="${href}"]`).first().click();
  await page.waitForTimeout(2500);
};

const switchRole = async (role) => {
  await page.selectOption('#role-switcher', role);
  await page.waitForTimeout(1200);
};

const tryClick = async (name) => {
  for (const loc of [
    page.getByRole('button', { name, exact: false }),
    page.getByRole('tab', { name, exact: false }),
    page.getByText(name, { exact: false }),
  ]) {
    try {
      await loc.first().click({ timeout: 3000 });
      await page.waitForTimeout(900);
      return true;
    } catch { /* coba locator berikutnya */ }
  }
  console.log(`  ⚠ "${name}" tidak ditemukan — dilewati`);
  return false;
};

/* ============ 1. LOGIN & OTP ============ */
console.log('Bab 1: Login & OTP');
await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await shot('manual-01-halaman-login.png', false);

await page.fill('#email', 'rizky.ramadhan@ojk.go.id');
await page.fill('#password', 'password123');
await shot('manual-02-login-terisi.png', false);
await page.click('#login-submit-btn');
await page.waitForSelector('input[maxlength="1"]', { timeout: 10000 });
const otp = page.locator('input[maxlength="1"]');
for (let i = 0; i < 6; i++) await otp.nth(i).fill(String(i + 1));
await shot('manual-03-kode-otp.png', false);
await page.getByRole('button', { name: 'Verifikasi' }).click();
await page.waitForURL('**/dashboard', { timeout: 15000 });
await page.waitForTimeout(2500);

/* ============ 2. PEMOHON ============ */
console.log('Bab 2: Pemohon');
await switchRole('staf_pemeriksa');
await shot('manual-04-dashboard-pemohon.png');

await nav('/dashboard/my-request');
await shot('manual-05-my-request.png');

await nav('/dashboard/submit-request');
await shot('manual-06-form-kosong.png');

// Isi form
await page.fill('input[name="nama"]', 'M. Rizky Ramadhan');
await page.fill('input[name="jabatan"]', 'Staf Pemeriksa');
await page.fill('input[name="nip"]', '198705122010121002');
await page.fill('input[name="satuanKerja"]', 'Departemen Pengawasan Perbankan');
await page.fill('textarea[name="tambahanInformasi"]', 'HP tersangka ditemukan dalam kondisi menyala dan terkunci. Mohon prioritas pemeriksaan pesan WhatsApp periode Januari–Maret 2026.');
await page.fill('input[name="merkModel"]', 'Samsung Galaxy A52');
await page.fill('input[name="nomorSeri"]', 'SN-8937492XA');
await shot('manual-07-form-terisi.png');

// Upload Berita Acara (PDF dummy dibuat di memori)
await page.setInputFiles('input[accept=".pdf"]', {
  name: 'berita-acara-penyerahan.pdf',
  mimeType: 'application/pdf',
  buffer: Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\n%%EOF'),
});
await page.waitForTimeout(1800); // tunggu hash SHA-256 selesai dihitung
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); // perlihatkan area upload + tombol submit
await shot('manual-08-dokumen-terunggah.png');

await page.getByRole('button', { name: 'Submit Request' }).click();
await page.waitForTimeout(1200);
await shot('manual-09-submit-sukses.png', false);

await nav('/dashboard/evidence-tracker');
// Pemohon kini mode baca saja — tombol Upload Evidence pindah ke role analis (Bab 4).
await shot('manual-10-evidence-tracker.png');
await page.locator('button[title="Riwayat Versi"]').first().click();
await page.waitForTimeout(900);
await shot('manual-12-riwayat-evidence.png', false);
await page.mouse.click(20, 450); // klik area gelap untuk menutup modal
await page.waitForTimeout(600);

await nav('/dashboard/report');
await shot('manual-13-report-pemohon.png');

/* ============ 3. KEPALA LAB ============ */
console.log('Bab 3: Kepala Lab');
await nav('/dashboard');
await switchRole('supervisor');
await shot('manual-14-dashboard-supervisor.png');

await nav('/dashboard/case-assignment');
await shot('manual-15-tab-menunggu-verifikasi.png');

// Intake: konfirmasi serah terima barang bukti fisik (wajib sebelum Verify)
await page.getByRole('button', { name: 'Terima Fisik' }).first().click();
await page.waitForTimeout(600);
await page.locator('input[type="checkbox"]').first().check(); // centang pernyataan nomor seri cocok
await page.fill('input[placeholder="Petugas Lab yang menerima..."]', 'Siti Nurhaliza');
await page.fill('input[placeholder="Contoh: SEAL-2026-0142"]', 'SEAL-2026-0142');
await shot('manual-33-intake-fisik.png', false);
await page.getByRole('button', { name: 'Catat Serah Terima' }).click();
await page.waitForTimeout(700);

await page.getByRole('button', { name: 'Verify' }).first().click();
await shot('manual-16-setelah-verify.png', false); // toast masih tampil
await page.getByRole('button', { name: 'Reject' }).first().click();
await page.waitForTimeout(700);
await page.fill('textarea[placeholder="Alasan penolakan..."]', 'Berita acara belum ditandatangani pejabat berwenang. Mohon lengkapi dan ajukan ulang.');
await shot('manual-17-modal-tolak.png', false);
await page.getByRole('button', { name: 'Batal' }).click();
await page.waitForTimeout(500);

await tryClick('Siap Ditugaskan');
await shot('manual-18-tab-siap-ditugaskan.png');
await page.getByRole('button', { name: 'Assign' }).first().click();
await page.waitForTimeout(900);
await shot('manual-19-drawer-penugasan.png', false);
await page.getByText('Putri Apriani').first().click();
await page.selectOption('select:has(option[value="High"])', 'High');
await page.fill('input[type="date"]', '2026-07-31');
await shot('manual-20-penugasan-terisi.png', false);
await page.getByRole('button', { name: 'Tugaskan Analis' }).click();
await shot('manual-21-penugasan-berhasil.png', false); // toast

await nav('/dashboard/workload-monitoring');
await shot('manual-22-workload-monitoring.png');

await nav('/dashboard/report-review');
await shot('manual-23-approval-laporan.png');
await page.getByRole('button', { name: 'Approve' }).first().click();
await shot('manual-24-laporan-approved.png');
await page.getByRole('button', { name: 'Reject' }).first().click();
await page.waitForTimeout(700);
await page.fill('textarea[placeholder="Catatan revisi..."]', 'Bagian analisis artefak WhatsApp perlu dilengkapi tangkapan layar bukti percakapan.');
await shot('manual-25-modal-revisi.png', false);
await page.getByRole('button', { name: 'Batal' }).click();
await page.waitForTimeout(500);

/* ============ 4. ANALIS ============ */
console.log('Bab 4: Analis');
await nav('/dashboard');
await switchRole('analis_lab');

// Upload hasil akuisisi (tombol Upload Evidence kini milik analis)
await nav('/dashboard/evidence-tracker');
await tryClick('Upload Evidence');
await shot('manual-11-upload-evidence.png');
await tryClick('Upload Evidence'); // tutup panel

await nav('/dashboard/analis-workspace');
await shot('manual-26-daftar-kasus-analis.png');

await page.getByRole('button', { name: 'Open' }).first().click();
await page.waitForTimeout(1200);
await shot('manual-27-workspace-detail.png');

// Centang seluruh SOP checklist + lampirkan laporan
const checks = page.locator('input[type="checkbox"]');
const total = await checks.count();
for (let i = 0; i < total; i++) await checks.nth(i).check();
await page.getByText('Klik atau Drag & drop Laporan').click(); // lampirkan file (mock)
// Ubah status & tambah catatan internal
await page.selectOption('select:has(option[value="Analisis Selesai"])', 'Analisis Selesai');
await page.fill('textarea[placeholder="Ketik catatan baru di sini..."]', 'Imaging selesai, hash cocok. Draft laporan siap direview.');
await page.getByRole('button', { name: 'Tambah Catatan' }).click();
await page.waitForTimeout(600);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); // perlihatkan checklist penuh + catatan
await shot('manual-28-checklist-selesai.png');

await page.getByRole('button', { name: 'Submit for Review' }).click();
await page.waitForTimeout(900);
await shot('manual-29-submit-review.png');

/* ============ 5. MENU UMUM ============ */
console.log('Bab 5: Menu umum');
await nav('/dashboard/knowledge-center');
await page.locator('h3').first().click(); // buka detail use case pertama
await page.waitForTimeout(700);
await shot('manual-30-knowledge-center.png');

await nav('/dashboard/announcements');
await shot('manual-31-announcements.png');

await nav('/dashboard/help');
await shot('manual-32-help-faq.png');

await browser.close();
console.log(`\nSelesai! 32 screenshot tersimpan di: ${OUT}`);
console.log('Buka User-Manual-LPBTI-OJK.doc — semua gambar akan muncul otomatis.');
