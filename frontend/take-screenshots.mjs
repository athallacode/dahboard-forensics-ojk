/**
 * Auto-screenshot 13 halaman aplikasi LPBTI OJK untuk laporan.
 * Hasil: docs/screenshots/gambar-01..13.png (sesuai Lampiran laporan).
 *
 * Cara pakai:
 *   Terminal 1: cd frontend && npm run dev   (biarkan jalan)
 *   Terminal 2: cd frontend && node take-screenshots.mjs
 *
 * Catatan: memakai Google Chrome yang sudah terpasang (channel: 'chrome'),
 * jadi TIDAK perlu `npx playwright install`.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Script ada di frontend/, output ke ../docs/screenshots
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'screenshots');
mkdirSync(OUT, { recursive: true });
const BASE = 'http://localhost:3000';

const browser = await chromium.launch({ channel: 'chrome' }); // pakai Chrome terpasang
const page = await browser.newPage({
  viewport: { width: 1600, height: 900 },
  deviceScaleFactor: 2, // hasil tajam untuk dokumen
});
page.on('dialog', (d) => d.accept()); // auto-OK dialog confirm/alert bawaan browser

const shot = async (name, fullPage = true) => {
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, name), fullPage });
  console.log('  ✔', name);
};

// Navigasi HARUS via klik sidebar (client-side); reload akan menghapus sesi login (auth in-memory)
const nav = async (href) => {
  await page.locator(`a[href="${href}"]`).first().click();
  await page.waitForTimeout(2500); // beri waktu compile route (mode dev)
};

const switchRole = async (role) => {
  await page.selectOption('#role-switcher', role);
  await page.waitForTimeout(1200);
};

// Klik best-effort: kalau elemen tidak ketemu, lanjut saja (screenshot tetap diambil)
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
  console.log(`  ⚠ tombol "${name}" tidak ditemukan — dilewati`);
  return false;
};

console.log('1-2. Login & OTP');
await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await shot('gambar-01-login.png', false);
await page.fill('#email', 'rizky.ramadhan@ojk.go.id');
await page.fill('#password', 'password123');
await page.click('#login-submit-btn');
await page.waitForSelector('input[maxlength="1"]', { timeout: 10000 });
await shot('gambar-02-otp.png', false);
const otp = page.locator('input[maxlength="1"]');
for (let i = 0; i < 6; i++) await otp.nth(i).fill(String(i + 1));
await page.getByRole('button', { name: 'Verifikasi' }).click();
await page.waitForURL('**/dashboard', { timeout: 15000 });
await page.waitForTimeout(2500);

console.log('3-6. Role: Pemohon');
await switchRole('staf_pemeriksa');
await shot('gambar-03-dashboard-pemohon.png');
await nav('/dashboard/submit-request');
await shot('gambar-04-submit-request.png');
await nav('/dashboard/evidence-tracker');
await shot('gambar-05-evidence-tracker.png');
await nav('/dashboard/report');
await shot('gambar-06-report-pemohon.png');

console.log('7-10. Role: Kepala Lab');
await nav('/dashboard');
await switchRole('supervisor');
await shot('gambar-07-dashboard-supervisor.png');
await nav('/dashboard/case-assignment');
await tryClick('Siap Ditugaskan');
await tryClick('Assign');
await shot('gambar-08-case-assignment.png');
await nav('/dashboard/workload-monitoring');
await shot('gambar-09-workload.png');
await nav('/dashboard/report-review');
await shot('gambar-10-approval.png');

console.log('11-12. Role: Analis');
await nav('/dashboard');
await switchRole('analis_lab');
await nav('/dashboard/analis-workspace');
await shot('gambar-11-analis-list.png');
await tryClick('Open');
await shot('gambar-12-analis-detail.png');

console.log('13. Knowledge Center');
await nav('/dashboard/knowledge-center');
await tryClick('Detail');
await shot('gambar-13-knowledge-center.png');

await browser.close();
console.log(`\nSelesai! 13 screenshot tersimpan di: ${OUT}`);
console.log('Buka ulang Laporan-LPBTI-OJK-Formal.doc — semua gambar akan muncul otomatis.');
