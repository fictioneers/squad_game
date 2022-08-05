import { useRouter } from 'next/router'

export default function End({ message }) {
  const router = useRouter();

  const tryAgainClicked = () => {
    localStorage.setItem('completed', JSON.stringify(true))
    router.push('/');
  }

  return (
    <>
      <h1 className="title">
        { message }
      </h1>

      <button onClick={tryAgainClicked}>
          Try again!
      </button>
    </>
  )
}
