import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function End() {
  const router = useRouter();
  const [score, setScore] = useState(null);
  const [outOf, setOutOf] = useState(null);

  useEffect(() => {
    setScore(localStorage.getItem('score'));
    setOutOf(localStorage.getItem('outOf'));
  }, []);

  const tryAgainClicked = () => {
    router.push('/');
  }

  if (!score || !outOf) {
    return (
      <p>Loading...</p>
    )
  }

  return (
    <>
      <h1 className="title">
        <Image src="/completed.png" alt="Congratulations!" width="544" height="111" />
      </h1>

      <p className="description">
        You scored {score} out of {outOf}!
      </p>

      <button onClick={tryAgainClicked}>
          <Image src="/try_again.png" alt="Try Again!" width="345" height="111" />
      </button>
    </>
  )
}
