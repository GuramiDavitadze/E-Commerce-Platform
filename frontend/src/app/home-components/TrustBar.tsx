import styles from '../home.module.scss';
 
const TRUST_ITEMS = [
  { icon: '🚚', label: 'Free shipping',   sub: 'On orders over $50' },
  { icon: '↩️', label: 'Easy returns',    sub: '30-day return policy' },
  { icon: '🔒', label: 'Secure checkout', sub: 'SSL encrypted payments' },
  { icon: '💬', label: '24/7 support',    sub: "We're always here" },
];
 
export function TrustBar() {
  return (
    <div className={styles.trustBar}>
      <div className={styles.trustBarInner}>
        {TRUST_ITEMS.map((item) => (
          <div key={item.label} className={styles.trustItem}>
            <span className={styles.trustIcon}>{item.icon}</span>
            <div className={styles.trustText}>
              <span className={styles.trustLabel}>{item.label}</span>
              <span className={styles.trustSub}>{item.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}