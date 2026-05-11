'use client';
 
import { Fragment, useState } from 'react';
import { useAdminUsers, useToggleUserActive, useChangeUserRole } from '@/hooks/useAdmin';
import { useUser } from '@/store/authStore';
import type { User } from '@/types';
import styles from './users.module.scss';
 
type RoleFilter = 'ALL' | 'ADMIN' | 'CUSTOMER';
type StatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';
 
export default function AdminUsersPage() {
  const currentUser  = useUser();
  const { data, isLoading, isError, refetch } = useAdminUsers();
  const toggleActive = useToggleUserActive();
  const changeRole   = useChangeUserRole();
 
  const [search, setSearch]           = useState('');
  const [roleFilter, setRoleFilter]   = useState<RoleFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [confirmModal, setConfirmModal] = useState<{
    type: 'role' | 'status';
    user: User;
  } | null>(null);
 
  const users = data?.data ?? [];
 
  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.fullname.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleFilter === 'ALL'   || u.role === roleFilter;
    const matchStatus = statusFilter === 'ALL' || (statusFilter === 'ACTIVE' ? u.isActive : !u.isActive);
    return matchSearch && matchRole && matchStatus;
  });
 
  const totalAdmins    = users.filter((u) => u.role === 'ADMIN').length;
  const totalCustomers = users.filter((u) => u.role === 'CUSTOMER').length;
  const totalActive    = users.filter((u) => u.isActive).length;
  const totalInactive  = users.filter((u) => !u.isActive).length;
 
  const handleConfirm = async () => {
    if (!confirmModal) return;
    const { type, user } = confirmModal;
    if (type === 'status') {
      await toggleActive.mutateAsync({ id: user.id, isActive: !user.isActive });
    } else {
      await changeRole.mutateAsync({ id: user.id, role: user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN' });
    }
    setConfirmModal(null);
  };
 
  const isPending = toggleActive.isPending || changeRole.isPending;
 
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Users</h1>
          <p className={styles.subtitle}>{users.length} total users</p>
        </div>
      </div>
 
      {/* Stats */}
      <div className={styles.statsRow}>
        {[
          { label: 'Total',     value: users.length,    color: '' },
          { label: 'Admins',    value: totalAdmins,     color: styles.statAccent },
          { label: 'Customers', value: totalCustomers,  color: '' },
          { label: 'Active',    value: totalActive,     color: styles.statGreen },
          { label: 'Inactive',  value: totalInactive,   color: totalInactive > 0 ? styles.statRed : '' },
        ].map((s, i, arr) => (
          <Fragment key={i}>
            <div key={s.label} className={`${styles.stat} ${s.color}`}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
            {i < arr.length - 1 && <div key={`div-${i}`} className={styles.statDivider} />}
          </Fragment>
        ))}
      </div>
 
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            className={styles.searchInput}
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button className={styles.searchClear} onClick={() => setSearch('')}>✕</button>}
        </div>
 
        <div className={styles.filters}>
          {/* Role tabs */}
          <div className={styles.filterGroup}>
            {(['ALL', 'ADMIN', 'CUSTOMER'] as RoleFilter[]).map((r) => (
              <button
                key={r}
                className={`${styles.filterBtn} ${roleFilter === r ? styles.filterBtnActive : ''}`}
                onClick={() => setRoleFilter(r)}
              >
                {r === 'ALL' ? 'All roles' : r.charAt(0) + r.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
 
          {/* Status tabs */}
          <div className={styles.filterGroup}>
            {(['ALL', 'ACTIVE', 'INACTIVE'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                className={`${styles.filterBtn} ${statusFilter === s ? styles.filterBtnActive : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s === 'ALL' ? 'All statuses' : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
 
        <span className={styles.resultCount}>{filtered.length} results</span>
      </div>
 
      {/* Loading */}
      {isLoading && (
        <div className={styles.tableWrap}>
          <div className={styles.skeletonList}>
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className={styles.skeletonRow} />)}
          </div>
        </div>
      )}
 
      {/* Error */}
      {isError && (
        <div className={styles.errorState}>
          <span>⚠️</span>
          <p>Failed to load users.</p>
          <button className={styles.retryBtn} onClick={() => refetch()}>Try again</button>
        </div>
      )}
 
      {/* Empty */}
      {!isLoading && !isError && filtered.length === 0 && (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>👥</span>
          <p className={styles.emptyTitle}>No users found</p>
          <p className={styles.emptyText}>Try adjusting your search or filters</p>
        </div>
      )}
 
      {/* Table */}
      {!isLoading && !isError && filtered.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const isSelf = user.id === currentUser?.id;
                return (
                  <tr key={user.id} className={!user.isActive ? styles.rowInactive : ''}>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.avatar}>
                          {user.image
                            ? <img src={user.image} alt={user.fullname} />
                            : <span>{user.fullname.charAt(0).toUpperCase()}</span>}
                        </div>
                        <div className={styles.userInfo}>
                          <div className={styles.userNameRow}>
                            <span className={styles.userName}>{user.fullname}</span>
                            {isSelf && <span className={styles.selfTag}>You</span>}
                          </div>
                          <span className={styles.userEmail}>{user.email}</span>
                        </div>
                      </div>
                    </td>
 
                    <td>
                      <span className={`${styles.roleBadge} ${user.role === 'ADMIN' ? styles.roleAdmin : styles.roleCustomer}`}>
                        {user.role === 'ADMIN' ? '⚙ Admin' : '👤 Customer'}
                      </span>
                    </td>
 
                    <td>
                      <span className={`${styles.statusDot} ${user.isActive ? styles.statusActive : styles.statusInactive}`}>
                        {user.isActive ? '● Active' : '○ Inactive'}
                      </span>
                    </td>
 
                    <td className={styles.cellMuted}>
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </td>
 
                    <td>
                      {isSelf ? (
                        <span className={styles.selfNote}>Cannot edit yourself</span>
                      ) : (
                        <div className={styles.actionBtns}>
                          <button
                            className={user.isActive ? styles.deactivateBtn : styles.activateBtn}
                            onClick={() => setConfirmModal({ type: 'status', user })}
                            disabled={isPending}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            className={styles.roleBtn}
                            onClick={() => setConfirmModal({ type: 'role', user })}
                            disabled={isPending}
                          >
                            Make {user.role === 'ADMIN' ? 'Customer' : 'Admin'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
 
      {/* Confirm modal */}
      {confirmModal && (
        <div className={styles.overlay} onClick={() => setConfirmModal(null)}>
          <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmIcon}>
              {confirmModal.type === 'role' ? '🔄' : confirmModal.user.isActive ? '🚫' : '✅'}
            </div>
            <h3 className={styles.confirmTitle}>
              {confirmModal.type === 'role'
                ? `Make ${confirmModal.user.role === 'ADMIN' ? 'Customer' : 'Admin'}?`
                : confirmModal.user.isActive ? 'Deactivate user?' : 'Activate user?'}
            </h3>
            <p className={styles.confirmText}>
              {confirmModal.type === 'role' ? (
                <>
                  <strong>{confirmModal.user.fullname}</strong> will be changed from{' '}
                  <strong>{confirmModal.user.role}</strong> to{' '}
                  <strong>{confirmModal.user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN'}</strong>.
                  {confirmModal.user.role === 'CUSTOMER' && ' They will gain full admin access.'}
                </>
              ) : confirmModal.user.isActive ? (
                <>
                  <strong>{confirmModal.user.fullname}</strong> will be deactivated and
                  will no longer be able to log in.
                </>
              ) : (
                <>
                  <strong>{confirmModal.user.fullname}</strong> will be reactivated and
                  can log in again.
                </>
              )}
            </p>
            <div className={styles.confirmBtns}>
              <button className={styles.confirmCancel} onClick={() => setConfirmModal(null)} disabled={isPending}>
                Cancel
              </button>
              <button
                className={confirmModal.type === 'status' && confirmModal.user.isActive
                  ? styles.confirmDanger
                  : styles.confirmPrimary}
                onClick={handleConfirm}
                disabled={isPending}
              >
                {isPending
                  ? <><span className={styles.spinner} /> Saving…</>
                  : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}