'use client';
 
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore, useIsAuthenticated } from '@/store/authStore';
import { ApiClientError } from '@/lib/api';
import styles from './login.module.scss';
 
export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const { login, isLoading, error, clearError } = useAuthStore();
 
  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
 
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);
 
  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errors.email = 'Invalid email address';
    if (!form.password) errors.password = 'Password is required';
    return errors;
  };
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    clearError();
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    try {
      await login(form);
      router.push('/');
    } catch (err) {
      if (err instanceof ApiClientError && err.errors) {
        const mapped: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(err.errors)) {
          mapped[key] = msgs[0];
        }
        setFieldErrors(mapped);
      }
    }
  };
 
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Back to home
          </Link>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to your account to continue</p>
        </div>
 
        {/* Global error */}
        {error && (
          <div className={styles.errorBanner} role="alert">
            {error}
          </div>
        )}
 
        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              value={form.email}
              onChange={handleChange}
              className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
              placeholder="you@example.com"
              disabled={isLoading}
            />
            {fieldErrors.email && (
              <span className={styles.fieldError}>{fieldErrors.email}</span>
            )}
          </div>
 
          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              className={`${styles.input} ${fieldErrors.password ? styles.inputError : ''}`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            {fieldErrors.password && (
              <span className={styles.fieldError}>{fieldErrors.password}</span>
            )}
          </div>
 
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
 
        {/* Footer */}
        <p className={styles.footer}>
          Don&apos;t have an account?{' '}
          <Link href="/register" className={styles.footerLink}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}