import Image from 'next/image'
import CategoryList from '@/components/Categories/CategoryList'
import styles from './Hero.module.scss'

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.categories}>
        <CategoryList />
      </div>
      <div className={styles.banner}>
        <Image
          src='/images/banner.jpg'
          alt='Banner'
          fill
          style={{ objectFit: 'cover', borderRadius: '12px' }}
        />
      </div>
    </section>
  )
}

export default Hero