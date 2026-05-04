'use client';
 
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useUser } from '@/store/authStore';
import { api, uploadFile, ApiClientError } from '@/lib/api';
import type { AuthResponse } from '@/types';
import styles from './profile.module.scss';
 
export default function ProfilePage() {
  const router = useRouter();
  const user = useUser();
  const fetchMe = useAuthStore((s) => s.fetchMe);
 
  const [tab, setTab] = useState<'profile' | 'password'>('profile');
 
  // Profile form
  const [profileForm, setProfileForm] = useState({
    fullname: user?.fullname ?? '',
    email: user?.email ?? '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
 
  // Password form
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
 
  // Avatar
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
 
  useEffect(() => {
    if (!user) router.replace('/login');
  }, [user, router]);
 
  useEffect(() => {
    if (user) setProfileForm({ fullname: user.fullname, email: user.email });
  }, [user]);
 
  if (!user) return null;
 
  // ── Profile save ──────────────────────────────────────────────────────────
 
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      await api.put('/users/profile', {
        fullname: profileForm.fullname,
        email: profileForm.email,
      });
      await fetchMe();
      setProfileMsg({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : 'Update failed';
      setProfileMsg({ type: 'error', text: msg });
    } finally {
      setProfileSaving(false);
    }
  };
 
  // ── Password change ───────────────────────────────────────────────────────
 
  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwMsg({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    setPwSaving(true);
    try {
      await api.put('/users/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwMsg({ type: 'success', text: 'Password changed successfully' });
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : 'Failed to change password';
      setPwMsg({ type: 'error', text: msg });
    } finally {
      setPwSaving(false);
    }
  };
 
  // ── Avatar upload ─────────────────────────────────────────────────────────
 
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      await uploadFile('/users/profile/image', formData, 'PATCH');
      await fetchMe();
    } catch {
      // silently handle
    } finally {
      setAvatarUploading(false);
    }
  };
 
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>
              {user.image ? (
                <img src={user.image} alt={user.fullname} />
              ) : (
                <span>{user.fullname.charAt(0).toUpperCase()}</span>
              )}
              {avatarUploading && <div className={styles.avatarOverlay}><span className={styles.spinner} /></div>}
            </div>
            <button
              className={styles.avatarEditBtn}
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              title="Change photo"
            >
              ✎
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </div>
          <div className={styles.headerInfo}>
            <h1 className={styles.headerName}>{user.fullname}</h1>
            <p className={styles.headerEmail}>{user.email}</p>
            <span className={`${styles.roleBadge} ${user.role === 'ADMIN' ? styles.adminBadge : ''}`}>
              {user.role}
            </span>
          </div>
        </div>
 
        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'profile' ? styles.tabActive : ''}`}
            onClick={() => setTab('profile')}
          >
            Profile details
          </button>
          <button
            className={`${styles.tab} ${tab === 'password' ? styles.tabActive : ''}`}
            onClick={() => setTab('password')}
          >
            Change password
          </button>
        </div>
 
        {/* Tab content */}
        <div className={styles.card}>
          {tab === 'profile' && (
            <form onSubmit={handleProfileSave} className={styles.form}>
              {profileMsg && (
                <div className={`${styles.msg} ${profileMsg.type === 'success' ? styles.msgSuccess : styles.msgError}`}>
                  {profileMsg.text}
                </div>
              )}
              <div className={styles.field}>
                <label className={styles.label}>Full name</label>
                <input
                  className={styles.input}
                  value={profileForm.fullname}
                  onChange={(e) => setProfileForm((f) => ({ ...f, fullname: e.target.value }))}
                  disabled={profileSaving}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email address</label>
                <input
                  type="email"
                  className={styles.input}
                  value={profileForm.email}
                  onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
                  disabled={profileSaving}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Member since</label>
                <input
                  className={styles.input}
                  value={new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  disabled
                />
              </div>
              <button className={styles.saveBtn} type="submit" disabled={profileSaving}>
                {profileSaving ? 'Saving…' : 'Save changes'}
              </button>
            </form>
          )}
 
          {tab === 'password' && (
            <form onSubmit={handlePasswordSave} className={styles.form}>
              {pwMsg && (
                <div className={`${styles.msg} ${pwMsg.type === 'success' ? styles.msgSuccess : styles.msgError}`}>
                  {pwMsg.text}
                </div>
              )}
              {[
                { name: 'currentPassword', label: 'Current password', autocomplete: 'current-password' },
                { name: 'newPassword', label: 'New password', autocomplete: 'new-password' },
                { name: 'confirmPassword', label: 'Confirm new password', autocomplete: 'new-password' },
              ].map((f) => (
                <div key={f.name} className={styles.field}>
                  <label className={styles.label}>{f.label}</label>
                  <input
                    type="password"
                    className={styles.input}
                    autoComplete={f.autocomplete}
                    value={pwForm[f.name as keyof typeof pwForm]}
                    onChange={(e) => setPwForm((prev) => ({ ...prev, [f.name]: e.target.value }))}
                    disabled={pwSaving}
                  />
                </div>
              ))}
              <button className={styles.saveBtn} type="submit" disabled={pwSaving}>
                {pwSaving ? 'Changing…' : 'Change password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}