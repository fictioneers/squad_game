import { useRouter } from 'next/router'
import { useEffect } from 'react';

export default function End({ message }) {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('userId');
    localStorage.removeItem('ingredients');
    localStorage.removeItem('questionId');
    localStorage.setItem('started', false);
  }, []);

  const tryAgainClicked = () => {
    router.push('/');
  }

  return (
    <>
      <div className="description">
        <p>{ message }</p>
        <button onClick={tryAgainClicked}>
          More tea!
        </button>
      </div>
    </>
  )
}
