import Link from 'next/link'
import styles from './Footer.module.scss'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <span className={styles.logo}>E-Commerce</span>
        <ul className={styles.links}>
          <li><Link href='/products'>Products</Link></li>
          <li><Link href='/login'>Login</Link></li>
          <li><Link href='/register'>Register</Link></li>
        </ul>
        <p className={styles.copyright}>© 2026 E-Commerce. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer