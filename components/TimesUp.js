import Image from 'next/image'
import { useRouter } from 'next/router'

const TimesUp = () => {
  const router = useRouter();

  const tryAgainClicked = () => {
    localStorage.setItem('score', 0);
    localStorage.setItem('outOf', 0);
    router.push('/');
  }

  return (
  <>
    <Image src="/times_up.png" alt="Times Up!" width="328" height="107" />
    <button onClick={tryAgainClicked}>Try Again</button>
  </>
  )
};

export default TimesUp;
