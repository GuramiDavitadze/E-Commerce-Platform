import styles from '../order.module.scss';
 
export function OrderSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={`${styles.skeletonBlock} ${styles.skeletonTitle}`} />
      <div className={`${styles.skeletonBlock} ${styles.skeletonProgress}`} />
      <div className={styles.skeletonLayout}>
        <div className={styles.skeletonLeft}>
          <div className={`${styles.skeletonBlock} ${styles.skeletonCard}`} />
        </div>
        <div className={styles.skeletonRight}>
          <div className={`${styles.skeletonBlock} ${styles.skeletonSidebar}`} />
          <div className={`${styles.skeletonBlock} ${styles.skeletonSidebarSm}`} />
        </div>
      </div>
    </div>
  );
}