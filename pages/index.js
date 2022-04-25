import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
  <>
    <h1 className={styles.title}>
      <Image src="/title.png" alt="Who's That Pokemon?" width="710" height="92" />
    </h1>

    <p className={styles.description}>
      <button>
        <Image src="/get_started.png" alt="Get Started!" width="434" height="100" />
      </button>
    </p>
  </>
  )
}
