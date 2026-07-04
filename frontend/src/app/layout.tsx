import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'LPBTI OJK — Laboratorium Pemeriksaan Berbasis Teknologi Informasi',
  description:
    'Dashboard internal Laboratorium Pemeriksaan Berbasis Teknologi Informasi Otoritas Jasa Keuangan. Mendukung pemeriksaan dan validasi bukti elektronik dalam proses pengawasan sektor jasa keuangan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
