/**
 * Runner screenshot TERSEGMEN — untuk lingkungan yang membatasi durasi proses.
 * Pakai: CHROME_BIN=/path/chrome node take-shots-seg.mjs <nomor-segmen 1..8>
 * Hasil sama persis dengan take-screenshots-manual.mjs, hanya dipecah.
 */
import { chromium } from 'playwright';
import path from 'path';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';

const SEG = String(process.argv[2] || '1');
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'screenshots-manual');
mkdirSync(OUT, { recursive: true });
const BASE = 'http://localhost:3000';

const launchOpts = process.env.CHROME_BIN
  ? { executablePath: process.env.CHROME_BIN, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] }
  : { channel: 'chrome' };
const browser = await chromium.launch(launchOpts);
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
page.on('dialog', (d) => d.accept());

const shot = async (name) => {
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, name) });
  console.log('  ✔', name);
};
const nav = async (href, ms = 1600) => {
  await page.locator(`a[href="${href}"]`).first().click();
  await page.waitForTimeout(ms);
};
const switchRole = async (role) => {
  await page.selectOption('#role-switcher', role);
  await page.waitForTimeout(1000);
};
const tryClick = async (name) => {
  for (const loc of [
    page.getByRole('button', { name, exact: false }),
    page.getByRole('tab', { name, exact: false }),
    page.getByText(name, { exact: false }),
  ]) {
    try { await loc.first().click({ timeout: 2500 }); await page.waitForTimeout(700); return true; } catch {}
  }
  console.log(`  ⚠ "${name}" tidak ditemukan`);
  return false;
};

// Login cepat (tanpa shot kecuali segmen 1)
const doLogin = async (withShots = false) => {
  await page.goto(`${BASE}/login`, { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  if (withShots) await shot('manual-01-halaman-login.png');
  await page.fill('#email', 'rizky.ramadhan@ojk.go.id');
  await page.fill('#password', 'password123');
  if (withShots) await shot('manual-02-login-terisi.png');
  await page.click('#login-submit-btn');
  await page.waitForSelector('input[maxlength="1"]', { timeout: 10000 });
  const otp = page.locator('input[maxlength="1"]');
  for (let i = 0; i < 6; i++) await otp.nth(i).fill(String(i + 1));
  if (withShots) await shot('manual-03-kode-otp.png');
  await page.getByRole('button', { name: 'Verifikasi' }).click();
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  await page.waitForTimeout(1500);
};

// Intake + Verify tanpa shot (prasyarat segmen 5)
const intakeVerify = async () => {
  await page.getByRole('button', { name: 'Terima Fisik' }).first().click();
  await page.waitForTimeout(500);
  await page.locator('input[type="checkbox"]').first().check();
  await page.fill('input[placeholder="Petugas Lab yang menerima..."]', 'Siti Nurhaliza');
  await page.fill('input[placeholder="Contoh: SEAL-2026-0142"]', 'SEAL-2026-0142');
  await page.getByRole('button', { name: 'Catat Serah Terima' }).click();
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'Verify' }).first().click();
  await page.waitForTimeout(800);
};

console.log('Segmen', SEG);

if (SEG === '1') {
  await doLogin(true);
  await switchRole('staf_pemeriksa');
  await shot('manual-04-dashboard-pemohon.png');
  await nav('/dashboard/my-request');
  await shot('manual-05-my-request.png');
}

if (SEG === '2') {
  await doLogin();
  await switchRole('staf_pemeriksa');
  await nav('/dashboard/submit-request');
  await shot('manual-06-form-kosong.png');
  await page.fill('input[name="nama"]', 'M. Rizky Ramadhan');
  await page.fill('input[name="jabatan"]', 'Staf Pemeriksa');
  await page.fill('input[name="nip"]', '198705122010121002');
  await page.fill('input[name="satuanKerja"]', 'Departemen Pengawasan Perbankan');
  await page.fill('textarea[name="tambahanInformasi"]', 'HP tersangka ditemukan dalam kondisi menyala dan terkunci. Mohon prioritas pemeriksaan pesan WhatsApp periode Januari sampai Maret 2026.');
  await page.fill('input[name="merkModel"]', 'Samsung Galaxy A52');
  await page.fill('input[name="nomorSeri"]', 'SN-8937492XA');
  await shot('manual-07-form-terisi.png');
  await page.setInputFiles('input[accept=".pdf"]', {
    name: 'berita-acara-penyerahan.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\n%%EOF'),
  });
  await page.waitForTimeout(1800);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await shot('manual-08-dokumen-terunggah.png');
  await page.getByRole('button', { name: 'Submit Request' }).click();
  await page.waitForTimeout(1200);
  await shot('manual-09-submit-sukses.png');
}

if (SEG === '3') {
  await doLogin();
  await switchRole('staf_pemeriksa');
  await nav('/dashboard/evidence-tracker');
  await shot('manual-10-evidence-tracker.png');
  await page.locator('button[title="Riwayat Versi"]').first().click();
  await page.waitForTimeout(800);
  await shot('manual-12-riwayat-evidence.png');
  await page.mouse.click(20, 450);
  await page.waitForTimeout(500);
  await nav('/dashboard/report');
  await shot('manual-13-report-pemohon.png');
}

if (SEG === '4') {
  await doLogin();
  await switchRole('supervisor');
  await shot('manual-14-dashboard-supervisor.png');
  await nav('/dashboard/case-assignment');
  await shot('manual-15-tab-menunggu-verifikasi.png');
  await page.getByRole('button', { name: 'Terima Fisik' }).first().click();
  await page.waitForTimeout(500);
  await page.locator('input[type="checkbox"]').first().check();
  await page.fill('input[placeholder="Petugas Lab yang menerima..."]', 'Siti Nurhaliza');
  await page.fill('input[placeholder="Contoh: SEAL-2026-0142"]', 'SEAL-2026-0142');
  await shot('manual-33-intake-fisik.png');
  await page.getByRole('button', { name: 'Catat Serah Terima' }).click();
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'Verify' }).first().click();
  await shot('manual-16-setelah-verify.png');
  await page.getByRole('button', { name: 'Reject' }).first().click();
  await page.waitForTimeout(600);
  await page.fill('textarea[placeholder="Alasan penolakan..."]', 'Berita acara belum ditandatangani pejabat berwenang. Mohon lengkapi dan ajukan ulang.');
  await shot('manual-17-modal-tolak.png');
  await page.getByRole('button', { name: 'Batal' }).click();
}

if (SEG === '5') {
  await doLogin();
  await switchRole('supervisor');
  await nav('/dashboard/case-assignment');
  await intakeVerify();
  await tryClick('Siap Ditugaskan');
  await shot('manual-18-tab-siap-ditugaskan.png');
  await page.getByRole('button', { name: 'Assign' }).first().click();
  await page.waitForTimeout(800);
  await shot('manual-19-drawer-penugasan.png');
  await page.getByText('Putri Apriani').first().click();
  await page.selectOption('select:has(option[value="High"])', 'High');
  await page.fill('input[type="date"]', '2026-07-31');
  await shot('manual-20-penugasan-terisi.png');
  await page.getByRole('button', { name: 'Tugaskan Analis' }).click();
  await shot('manual-21-penugasan-berhasil.png');
}

if (SEG === '6') {
  await doLogin();
  await switchRole('supervisor');
  await nav('/dashboard/workload-monitoring');
  await shot('manual-22-workload-monitoring.png');
  await nav('/dashboard/report-review');
  await shot('manual-23-approval-laporan.png');
  await page.getByRole('button', { name: 'Approve' }).first().click();
  await shot('manual-24-laporan-approved.png');
  await page.getByRole('button', { name: 'Reject' }).first().click();
  await page.waitForTimeout(600);
  await page.fill('textarea[placeholder="Catatan revisi..."]', 'Bagian analisis artefak WhatsApp perlu dilengkapi tangkapan layar bukti percakapan.');
  await shot('manual-25-modal-revisi.png');
  await page.getByRole('button', { name: 'Batal' }).click();
}

if (SEG === '7') {
  await doLogin();
  await switchRole('analis_lab');
  await nav('/dashboard/evidence-tracker');
  await tryClick('Upload Evidence');
  await shot('manual-11-upload-evidence.png');
  await tryClick('Upload Evidence');
  await nav('/dashboard/analis-workspace');
  await shot('manual-26-daftar-kasus-analis.png');
  await page.getByRole('button', { name: 'Open' }).first().click();
  await page.waitForTimeout(1000);
  await shot('manual-27-workspace-detail.png');
  const checks = page.locator('input[type="checkbox"]');
  const total = await checks.count();
  for (let i = 0; i < total; i++) await checks.nth(i).check();
  await page.getByText('Klik atau Drag & drop Laporan').click();
  await page.selectOption('select:has(option[value="Analisis Selesai"])', 'Analisis Selesai');
  await page.fill('textarea[placeholder="Ketik catatan baru di sini..."]', 'Imaging selesai, hash cocok. Draft laporan siap direview.');
  await page.getByRole('button', { name: 'Tambah Catatan' }).click();
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await shot('manual-28-checklist-selesai.png');
  await page.getByRole('button', { name: 'Submit for Review' }).click();
  await page.waitForTimeout(800);
  await shot('manual-29-submit-review.png');
}

if (SEG === '8') {
  await doLogin();
  await switchRole('staf_pemeriksa');
  await nav('/dashboard/knowledge-center');
  await page.locator('h3').first().click();
  await page.waitForTimeout(600);
  await shot('manual-30-knowledge-center.png');
  await nav('/dashboard/announcements');
  await shot('manual-31-announcements.png');
  await nav('/dashboard/help');
  await shot('manual-32-help-faq.png');
}

await browser.close();
console.log('Segmen', SEG, 'selesai.');
