'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan kata sandi wajib diisi.');
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const success = await login(email, password);
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Email atau kata sandi salah.');
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.page}>
      {/* Left Panel — Branding */}
      <div className={styles.leftPanel}>
        <div className={styles.leftContent}>
          <div className={styles.brandSection}>
            <h1 className={styles.brandTitle}>LPBTI OJK</h1>
            <h2 className={styles.brandSubtitle}>
              Laboratorium Pemeriksaan Berbasis<br />
              Teknologi Informasi OJK
            </h2>
            <div className={styles.taglineBox}>
              <span>Specialized Digital Evidence Support Capability</span>
            </div>
          </div>
          <div className={styles.descriptionWrapper}>
            <p className={styles.description}>
              Mendukung pemeriksaan dan validasi bukti elektronik dalam<br />
              proses pengawasan dan pemeriksaan khusus sektor<br />
              jasa keuangan.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <div className={styles.logoSection}>
            <img
              src="/images/ojk-logo.png"
              alt="OJK - Otoritas Jasa Keuangan"
              className={styles.logo}
            />
          </div>

          <div className={styles.welcomeSection}>
            <h2 className={styles.welcomeTitle}>
              <span className={styles.textDark}>Selamat </span>
              <span className={styles.textMaroon}>Datang</span>
            </h2>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <div className={styles.errorBox}>
                <span>{error}</span>
              </div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                id="email"
                type="email"
                placeholder="email@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                autoComplete="email"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Kata Sandi</label>
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="*******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <Eye size={18} strokeWidth={1.5} /> : <EyeOff size={18} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            <div className={styles.optionsRow}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#" className={styles.forgotLink}>Lupa Kata Sandi ?</a>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
              id="login-submit-btn"
            >
              {isLoading ? (
                <span className={styles.spinner} />
              ) : (
                'Masuk'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
