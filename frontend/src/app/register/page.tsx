'use client';
 
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore, useIsAuthenticated } from '@/store/authStore';
import { ApiClientError } from '@/lib/api';
import styles from './register.module.scss';
 
interface FormState {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
}
 
export default function RegisterPage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const { register, isLoading, error, clearError } = useAuthStore();
 
  const [form, setForm] = useState<FormState>({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<FormState>>({});
 
  useEffect(() => {
    if (isAuthenticated) router.replace('/');
  }, [isAuthenticated, router]);
 
  const validate = (): Partial<FormState> => {
    const errors: Partial<FormState> = {};
    if (!form.fullname.trim()) errors.fullname = 'Full name is required';
    else if (form.fullname.trim().length < 2)
      errors.fullname = 'Name must be at least 2 characters';
 
    if (!form.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errors.email = 'Invalid email address';
 
    if (!form.password) errors.password = 'Password is required';
    else if (form.password.length < 6)
      errors.password = 'Password must be at least 6 characters';
 
    if (!form.confirmPassword)
      errors.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword)
      errors.confirmPassword = 'Passwords do not match';
 
    return errors;
  };
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof FormState]) {
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
      await register({
        fullname: form.fullname.trim(),
        email: form.email,
        password: form.password,
      });
      router.push('/');
    } catch (err) {
      if (err instanceof ApiClientError && err.errors) {
        const mapped: Partial<FormState> = {};
        for (const [key, msgs] of Object.entries(err.errors)) {
          mapped[key as keyof FormState] = msgs[0];
        }
        setFieldErrors(mapped);
      }
    }
  };
 
  const fields: Array<{
    name: keyof FormState;
    label: string;
    type: string;
    placeholder: string;
    autoComplete: string;
  }> = [
    {
      name: 'fullname',
      label: 'Full name',
      type: 'text',
      placeholder: 'Jane Smith',
      autoComplete: 'name',
    },
    {
      name: 'email',
      label: 'Email address',
      type: 'email',
      placeholder: 'you@example.com',
      autoComplete: 'email',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: '6+ characters',
      autoComplete: 'new-password',
    },
    {
      name: 'confirmPassword',
      label: 'Confirm password',
      type: 'password',
      placeholder: '••••••••',
      autoComplete: 'new-password',
    },
  ];
 
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Back to home
          </Link>
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.subtitle}>
            Join us and start shopping today
          </p>
        </div>
 
        {error && (
          <div className={styles.errorBanner} role="alert">
            {error}
          </div>
        )}
 
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {fields.map((field) => (
            <div key={field.name} className={styles.field}>
              <label htmlFor={field.name} className={styles.label}>
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                value={form[field.name]}
                onChange={handleChange}
                className={`${styles.input} ${fieldErrors[field.name] ? styles.inputError : ''}`}
                placeholder={field.placeholder}
                disabled={isLoading}
              />
              {fieldErrors[field.name] && (
                <span className={styles.fieldError}>
                  {fieldErrors[field.name]}
                </span>
              )}
            </div>
          ))}
 
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                Creating account…
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>
 
        <p className={styles.footer}>
          Already have an account?{' '}
          <Link href="/login" className={styles.footerLink}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}