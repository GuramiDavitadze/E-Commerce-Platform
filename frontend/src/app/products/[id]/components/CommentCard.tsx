import type { Comment } from '@/types';
import { Stars } from './Stars';
import styles from '../product.module.scss';
 
export function CommentCard({ comment }: { comment: Comment }) {
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
 