'use client';
 
import { useState } from 'react';
import Link from 'next/link';
import { useCreateComment } from '@/hooks/useComments';
import { useIsAuthenticated } from '@/store/authStore';
import type { Comment } from '@/types';
import { CommentCard } from './CommentCard';
import { Stars } from './Stars';
import styles from '../product.module.scss';
 
interface ReviewSectionProps {
  productId: string;
  comments: Comment[];
  avgRating: number;
}
 
export function ReviewSection({ productId, comments, avgRating }: ReviewSectionProps) {
  const isAuthenticated = useIsAuthenticated();
  const createComment   = useCreateComment();
 
  const [reviewForm, setReviewForm] = useState({ text: '', rating: 5 });
  const [reviewError, setReviewError] = useState('');
 
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    if (!reviewForm.text.trim()) {
      setReviewError('Please write a review');
      return;
    }
    try {
      await createComment.mutateAsync({
        product_id: productId,
        text: reviewForm.text,
        rating: reviewForm.rating,
      });
      setReviewForm({ text: '', rating: 5 });
    } catch (err: any) {
      setReviewError(err?.message || 'Failed to submit review');
    }
  };
 
  return (
    <section className={styles.reviews}>
      <h2 className={styles.reviewsTitle}>
        Reviews
        {comments.length > 0 && (
          <span className={styles.reviewsCount}>{comments.length}</span>
        )}
      </h2>
 
      {/* Write a review */}
      {isAuthenticated ? (
        <form className={styles.reviewForm} onSubmit={handleReviewSubmit}>
          <h3 className={styles.reviewFormTitle}>Write a review</h3>
 
          <div className={styles.ratingPicker}>
            <span className={styles.ratingPickerLabel}>Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`${styles.starBtn} ${star <= reviewForm.rating ? styles.starActive : ''}`}
                onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}
              >
                ★
              </button>
            ))}
          </div>
 
          <textarea
            className={styles.reviewTextarea}
            placeholder="Share your experience with this product…"
            value={reviewForm.text}
            onChange={(e) => setReviewForm((f) => ({ ...f, text: e.target.value }))}
            rows={4}
            disabled={createComment.isPending}
          />
 
          {reviewError && (
            <span className={styles.reviewError}>{reviewError}</span>
          )}
 
          <button
            type="submit"
            className={styles.reviewSubmitBtn}
            disabled={createComment.isPending}
          >
            {createComment.isPending ? 'Submitting…' : 'Submit review'}
          </button>
        </form>
      ) : (
        <p className={styles.loginPrompt}>
          <Link href="/login">Sign in</Link> to leave a review.
          (Only verified purchasers may review.)
        </p>
      )}
 
      {/* Comment list */}
      {comments.length === 0 ? (
        <p className={styles.noReviews}>No reviews yet. Be the first!</p>
      ) : (
        <div className={styles.commentList}>
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </section>
  );
}