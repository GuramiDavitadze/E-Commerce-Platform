'use client';
 
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProduct } from '@/hooks/useProducts';
import { useProductComments, useCreateComment } from '@/hooks/useComments';
import { useCartStore } from '@/store/cartStore';
import { useUser, useIsAuthenticated } from '@/store/authStore';
import type { Comment } from '@/types';
import styles from './product.module.scss';
 
export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
 
  const { data: productData, isLoading, isError } = useProduct(id);
  const { data: commentsData } = useProductComments(id);
  const createComment = useCreateComment();
  const addItem = useCartStore((s) => s.addItem);
 
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviewForm, setReviewForm] = useState({ text: '', rating: 5 });
  const [reviewError, setReviewError] = useState('');
 
  const product = productData?.data;
  const comments = commentsData?.data ?? [];
 
  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
 
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    if (!reviewForm.text.trim()) {
      setReviewError('Please write a review');
      return;
    }
    try {
      await createComment.mutateAsync({
        product_id: id,
        text: reviewForm.text,
        rating: reviewForm.rating,
      });
      setReviewForm({ text: '', rating: 5 });
    } catch (err: any) {
      setReviewError(err?.message || 'Failed to submit review');
    }
  };
 
  const avgRating =
    comments.length > 0
      ? comments.reduce((sum, c) => sum + c.rating, 0) / comments.length
      : 0;
 
  if (isLoading) return <ProductSkeleton />;
 
  if (isError || !product) {
    return (
      <div className={styles.errorPage}>
        <h2>Product not found</h2>
        <Link href="/products" className={styles.backLink}>
          ← Back to products
        </Link>
      </div>
    );
  }
 
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <span>/</span>
          <Link href="/products" className={styles.breadcrumbLink}>Products</Link>
          <span>/</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </nav>
 
        {/* Product */}
        <div className={styles.product}>
          {/* Image */}
          <div className={styles.imageWrap}>
            {product.image ? (
              <img src={product.image} alt={product.name} className={styles.image} />
            ) : (
              <div className={styles.imagePlaceholder}>No image</div>
            )}
          </div>
 
          {/* Info */}
          <div className={styles.info}>
            {product.category && (
              <span className={styles.category}>{product.category.content}</span>
            )}
            <h1 className={styles.name}>{product.name}</h1>
 
            {/* Rating summary */}
            {comments.length > 0 && (
              <div className={styles.ratingRow}>
                <Stars rating={avgRating} />
                <span className={styles.ratingText}>
                  {avgRating.toFixed(1)} ({comments.length} review{comments.length !== 1 ? 's' : ''})
                </span>
              </div>
            )}
 
            <p className={styles.price}>${Number(product.price).toFixed(2)}</p>
            <p className={styles.description}>{product.description}</p>
 
            {/* Stock */}
            <div className={styles.stock}>
              {product.quantity > 0 ? (
                <span className={styles.inStock}>
                  ✓ In stock ({product.quantity} available)
                </span>
              ) : (
                <span className={styles.outOfStock}>✗ Out of stock</span>
              )}
            </div>
 
            {/* Quantity + Add to cart */}
            {product.quantity > 0 && (
              <div className={styles.actions}>
                <div className={styles.qtyControl}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                  >
                    −
                  </button>
                  <span className={styles.qtyValue}>{qty}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQty((q) => Math.min(product.quantity, q + 1))}
                    disabled={qty >= product.quantity}
                  >
                    +
                  </button>
                </div>
                <button
                  className={`${styles.addBtn} ${added ? styles.addedBtn : ''}`}
                  onClick={handleAddToCart}
                  disabled={added}
                >
                  {added ? '✓ Added to cart' : 'Add to cart'}
                </button>
              </div>
            )}
 
            <Link href="/cart" className={styles.viewCartLink}>
              View cart →
            </Link>
          </div>
        </div>
 
        {/* Reviews */}
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
                onChange={(e) =>
                  setReviewForm((f) => ({ ...f, text: e.target.value }))
                }
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
      </div>
    </div>
  );
}
 
// ─── Sub-components ───────────────────────────────────────────────────────────
 
function Stars({ rating }: { rating: number }) {
  return (
    <span className={styles.stars} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? styles.starFilled : styles.starEmpty}>
          ★
        </span>
      ))}
    </span>
  );
}
 
function CommentCard({ comment }: { comment: Comment }) {
  return (
    <div className={styles.comment}>
      <div className={styles.commentHeader}>
        <div className={styles.commentAvatar}>
          {comment.author?.fullname?.charAt(0).toUpperCase() ?? '?'}
        </div>
        <div className={styles.commentMeta}>
          <span className={styles.commentAuthor}>
            {comment.author?.fullname ?? 'Anonymous'}
          </span>
          <span className={styles.commentDate}>
            {new Date(comment.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        <Stars rating={comment.rating} />
      </div>
      <p className={styles.commentText}>{comment.text}</p>
    </div>
  );
}
 
function ProductSkeleton() {
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