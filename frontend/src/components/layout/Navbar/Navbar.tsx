'use client';
 
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore, useUser, useIsAdmin } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import styles from './Navbar.module.scss';
 
function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUser();
  const isAdmin = useIsAdmin();
  const logout = useAuthStore((s) => s.logout);
  const totalItems = useCartStore((s) => s.totalItems());
 
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };
 
  const isActive = (href: string) => pathname === href;
 
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoDot} />
          Shop
        </Link>
 
        {/* Center links */}
        <ul className={styles.links}>
          <li>
            <Link
              href="/products"
              className={`${styles.link} ${isActive('/products') ? styles.active : ''}`}
            >
              Products
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link
                href="/admin"
                className={`${styles.link} ${isActive('/admin') ? styles.active : ''}`}
              >
                Admin
              </Link>
            </li>
          )}
        </ul>
 
        {/* Right side */}
        <div className={styles.actions}>
          {user ? (
            <>
              {/* Cart */}
              <Link href="/cart" className={styles.cartBtn} aria-label="Cart">
                <CartIcon />
                {totalItems > 0 && (
                  <span className={styles.cartBadge}>{totalItems}</span>
                )}
              </Link>
 
              {/* User menu */}
              <div className={styles.userMenu}>
                <button className={styles.avatar} aria-label="User menu">
                  {user.image ? (
                    <img src={user.image} alt={user.fullname} />
                  ) : (
                    <span>{user.fullname.charAt(0).toUpperCase()}</span>
                  )}
                </button>
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <span className={styles.dropdownName}>{user.fullname}</span>
                    <span className={styles.dropdownEmail}>{user.email}</span>
                  </div>
                  <div className={styles.dropdownDivider} />
                  <Link href="/profile" className={styles.dropdownItem}>
                    Profile
                  </Link>
                  <Link href="/orders" className={styles.dropdownItem}>
                    My Orders
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className={styles.dropdownItem}>
                      Admin Dashboard
                    </Link>
                  )}
                  <div className={styles.dropdownDivider} />
                  <button
                    className={`${styles.dropdownItem} ${styles.dropdownLogout}`}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`${styles.link} ${isActive('/login') ? styles.active : ''}`}
              >
                Login
              </Link>
              <Link href="/register" className={styles.registerBtn}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
export default Navbar
function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}