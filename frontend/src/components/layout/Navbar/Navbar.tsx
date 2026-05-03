import Link from "next/link"
import styles from './Navbar.module.scss'
const Navbar = () => {
  return (
      <nav className={styles.navbar}>
          <div className={styles.container}>
              <Link href="/" className={styles.logo}>
                  E-Commerce
              </Link>
              <ul className={styles.links}>
                  <li>
                    <Link href="/products">Products</Link>
                  </li>
                  <li>
                    <Link href="/login">Login</Link>
                  </li>
                  <li>
                    <Link href="/register">Register</Link>
                  </li>
                  
              </ul>
        </div>
    </nav>
  )
}

export default Navbar