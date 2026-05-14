
'use client';
 
import { useState } from 'react';
import styles from '../home.module.scss';
 
export function NewsletterSection() {
  const [email, setEmail]       = useState('');
  const [submitted, setSubmitted] = useState(false);
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };
 
  return (
    <section className={styles.newsletter}>
      <div className={styles.newsletterInner}>
        <div className={styles.newsletterContent}>
          <h2 className={styles.newsletterTitle}>Stay in the loop</h2>
          <p className={styles.newsletterSub}>
            Get new arrivals, exclusive deals, and style tips delivered to your inbox.
          </p>
        </div>
 
        {submitted ? (
          <div className={styles.newsletterSuccess}>
            <span>✓</span> Thanks! You're on the list.
          </div>
        ) : (
          <form className={styles.newsletterForm} onSubmit={handleSubmit}>
            <input
              type="email"
              className={styles.newsletterInput}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className={styles.newsletterBtn}>
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
 