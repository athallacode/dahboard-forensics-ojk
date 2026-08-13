'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './login.module.css';

export default function LoginPage() {
  const [step, setStep] = useState<'login' | 'mfa'>('login');
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // MFA State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { login, verifyOtp } = useAuth();
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
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
      setStep('mfa'); // Move to MFA step instead of dashboard directly
    } else {
      setError('Email atau kata sandi salah.');
    }

    setIsLoading(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Masukkan 6 digit kode OTP.');
      return;
    }
    
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const verified = await verifyOtp(code);
    if (verified) {
      router.push('/dashboard');
    } else {
      setError('Kode OTP tidak valid. Silakan coba lagi.');
      setIsLoading(false);
    }
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

      {/* Right Panel — Forms */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <div className={styles.logoSection}>
            <img
              src="/images/ojk-logo.png"
              alt="OJK - Otoritas Jasa Keuangan"
              className={styles.logo}
            />
          </div>

          {step === 'login' ? (
            <>
              <div className={styles.welcomeSection}>
                <h2 className={styles.welcomeTitle}>
                  <span className={styles.textDark}>Selamat </span>
                  <span className={styles.textMaroon}>Datang</span>
                </h2>
              </div>

              <form onSubmit={handleLoginSubmit} className={styles.form}>
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
                  {isLoading ? <span className={styles.spinner} /> : 'Masuk'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className={styles.welcomeSection}>
                <h2 className={styles.welcomeTitle}>
                  <span className={styles.textDark}>Verifikasi </span>
                  <span className={styles.textMaroon}>Dua Langkah</span>
                </h2>
                <p className={styles.mfaSubtitle}>Masukkan 6 digit kode yang dikirimkan ke perangkat Anda.</p>
              </div>

              <form onSubmit={handleMfaSubmit} className={styles.form}>
                {error && (
                  <div className={styles.errorBox}>
                    <span>{error}</span>
                  </div>
                )}
                
                <div className={styles.otpContainer}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { inputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={styles.otpInput}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isLoading}
                >
                  {isLoading ? <span className={styles.spinner} /> : 'Verifikasi'}
                </button>
                
                <div className={styles.resendBox}>
                  <button type="button" className={styles.resendLink}>Kirim ulang kode</button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
