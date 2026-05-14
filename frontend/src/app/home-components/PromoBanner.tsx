import Link from 'next/link';
import styles from '../home.module.scss';
 
export function PromoBanner() {
  return (
    <section className={styles.promo}>
      <div className={styles.promoInner}>
        <div className={styles.promoBg}>
          <div className={styles.promoShape} />
        </div>
        <div className={styles.promoContent}>
          <p className={styles.promoEyebrow}>Limited time offer</p>
          <h2 className={styles.promoTitle}>
            Get 20% off your
            <br />
            first order
          </h2>
          <p className={styles.promoSub}>
            Sign up for an account and use code{' '}
            <strong>WELCOME20</strong> at checkout.
          </p>
          <Link href="/register" className={styles.promoCta}>
            Create account
          </Link>
        </div>
        <div className={styles.promoVisual}>
          <div className={styles.promoTag}>
            <span className={styles.promoTagPercent}>20</span>
            <span className={styles.promoTagOff}>% OFF</span>
          </div>
        </div>
      </div>
    </section>
  );
}
 