'use client';
 
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useIsAdmin, useIsAuthenticated, useHasHydrated } from '@/store/authStore';
import styles from './layout.module.scss';
 
const NAV_ITEMS = [
  { href: '/admin',            label: 'Overview',   icon: '◈' },
  { href: '/admin/products',   label: 'Products',   icon: '🛍' },
  { href: '/admin/orders',     label: 'Orders',     icon: '📦' },
  { href: '/admin/categories', label: 'Categories', icon: '🗂' },
  { href: '/admin/users',      label: 'Users',      icon: '👥' },
];
 
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const isAuthenticated = useIsAuthenticated();
    const isAdmin = useIsAdmin();
    const hasHydrated = useHasHydrated();
 
    useEffect(() => {
        if (!hasHydrated) return;
        if (!isAuthenticated) router.replace('/login');
        else if (!isAdmin) router.replace('/');
    }, [hasHydrated, isAuthenticated, isAdmin, router]);
 
    if (!hasHydrated || !isAdmin) {
        return (
            <div className={styles.loading}>
                <div className={styles.loadingSpinner} />
            </div>
        );
    }
 
    const isActive = (href: string) =>
        href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
 
    return (
        <div className={styles.shell}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <span className={styles.sidebarLogo}>⚙</span>
                    <div>
                        <p className={styles.sidebarTitle}>Admin</p>
                        <p className={styles.sidebarSub}>Dashboard</p>
                    </div>
                </div>
 
                <nav className={styles.nav}>
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${isActive(item.href) ? styles.navItemActive : ''}`}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>
 
                <div className={styles.sidebarFooter}>
                    <Link href="/" className={styles.backToSite}>
                        ← Back to site
                    </Link>
                </div>
            </aside>
 
            {/* Main content */}
            <main className={styles.main}>
                {children}
            </main>
        </div>
    )
};