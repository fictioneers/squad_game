import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import Loading from '../components/Loading';

export default function Home() {
  const router = useRouter();
  const [message, setMessage] = useState();

  useEffect(() => {
    if (localStorage.getItem('userId')) {
      router.push('/question');
      return;
    }
    const getUser = async () => {
      const response = await (await fetch("/api/start")).json();
      localStorage.setItem("userId", response.userId);
      localStorage.setItem('questionId', response.questionId);
      localStorage.setItem('ingredients', JSON.stringify(response.ingredients));
      setMessage(response.message);
    }
    getUser();
  }, [])

  const start = () => {
    router.push('/question');
  };

  if (!message) {
    return <Loading />
  }

  return (
    <div className="description">
      <p>{message}</p>
      <button onClick={start}>
        Start
      </button>
    </div>
  )
}
