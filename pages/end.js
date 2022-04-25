import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function End() {
  return (
    <>
      <h1 className={styles.title}>
        <Image src="/completed.png" alt="Congratulations!" width="544" height="111" />
      </h1>

      <p className={styles.description}>
        <button>
          <Image src="/try_again.png" alt="Try Again!" width="345" height="111" />
        </button>
      </p>
    </>
  )
}
