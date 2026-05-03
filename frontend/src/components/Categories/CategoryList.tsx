import Link from 'next/link'
import styles from './CategoryList.module.scss'

const categories = [
  { id: 1, name: 'Electronics', slug: 'electronics' },
  { id: 2, name: 'Clothing', slug: 'clothing' },
  { id: 3, name: 'Accessories', slug: 'accessories' },
  { id: 4, name: 'Books', slug: 'books' },
  { id: 5, name: 'Sports', slug: 'sports' },
  { id: 6, name: 'Home & Garden', slug: 'home-garden' },
]

const CategoryList = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Shop by Category</h2>
      <div className={styles.grid}>
        {categories.map((category) => (
          <Link
            href={`/products/category/${category.slug}`}
            key={category.id}
            className={styles.card}
          >
            <span className={styles.name}>{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CategoryList