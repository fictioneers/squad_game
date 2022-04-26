import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'

export default function End() {
  const router = useRouter();

  const tryAgainClicked = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('score');
    localStorage.removeItem('outOf');
    router.push('/');
  }

  return (
    <>
      <h1 className={styles.title}>
        <Image src="/completed.png" alt="Congratulations!" width="544" height="111" />
      </h1>

      <p className={styles.description}>
        You scored {localStorage.getItem('score')} out of {localStorage.getItem('outOf')}!
      </p>

      <button onClick={tryAgainClicked}>
          <Image src="/try_again.png" alt="Try Again!" width="345" height="111" />
      </button>
    </>
  )
}
