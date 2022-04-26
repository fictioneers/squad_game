import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from "react"

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('score')) {
      localStorage.removeItem('userId');
      localStorage.removeItem('score');
      localStorage.removeItem('outOf');
      localStorage.removeItem('questionContent');
      localStorage.removeItem('questionId');
      localStorage.removeItem('startTime');
    } else if (localStorage.getItem('userId')) {
      router.push('/question');
    }
  }, [])

  const start = () => {
    router.push('/question');
  };

  return (
    <p className="description">
      <button onClick={start}>
        <Image src="/get_started.png" alt="Get Started!" width="434" height="100" />
      </button>
    </p>
  )
}
