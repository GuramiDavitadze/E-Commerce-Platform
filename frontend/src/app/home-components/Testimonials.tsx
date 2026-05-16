import styles from '../home.module.scss';
 
const TESTIMONIALS = [
  {
    name: 'Sarah K.',
    text: 'Incredible selection and the shipping was faster than expected. Will definitely shop here again!',
    rating: 5,
    location: 'New York, NY',
  },
  {
    name: 'Marcus T.',
    text: 'The quality exceeded my expectations. Customer service was also super responsive when I had a question.',
    rating: 5,
    location: 'London, UK',
  },
  {
    name: 'Ayasha M.',
    text: "I love how easy it is to find exactly what I'm looking for. The category filters are a lifesaver.",
    rating: 5,
    location: 'Toronto, CA',
  },
];
 
export function Testimonials() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Happy customers</p>
            <h2 className={styles.sectionTitle}>What people are saying</h2>
          </div>
        </div>
 
        <div className={styles.testimonialGrid}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className={styles.testimonialCard}>
              <div className={styles.testimonialStars}>
                {'★'.repeat(t.rating)}
              </div>
              <p className={styles.testimonialText}>"{t.text}"</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <span className={styles.testimonialName}>{t.name}</span>
                  <span className={styles.testimonialLocation}>{t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
 