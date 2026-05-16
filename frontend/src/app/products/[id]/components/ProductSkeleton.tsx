import styles from '../product.module.scss';
 
export function ProductSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.product}>
          <div className={`${styles.imageWrap} ${styles.skeletonBlock}`} />
          <div className={styles.info}>
            {[120, 280, 80, 200, 60, 160].map((w, i) => (
              <div
                key={i}
                className={styles.skeletonBlock}
                style={{ width: w, height: i === 2 ? 36 : 20, borderRadius: 6, marginBottom: 12 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
 