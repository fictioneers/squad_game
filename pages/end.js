import { useRouter } from 'next/router'

export default function End({ message }) {
  const router = useRouter();

  const tryAgainClicked = () => {
    localStorage.setItem('completed', JSON.stringify(true))
    router.push('/');
  }

  return (
    <>
      <div className="description">
        <p>{ message }</p>
        <button onClick={tryAgainClicked}>
          Try again!
        </button>
      </div>
    </>
  )
}
