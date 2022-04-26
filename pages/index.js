import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter();
  const start = () => {
    router.push('/question');
  };

  return (
    <p className={styles.description}>
      <button onClick={start}>
        <Image src="/get_started.png" alt="Get Started!" width="434" height="100" />
      </button>
    </p>
  )
}
