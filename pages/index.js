import Image from 'next/image'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter();
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
