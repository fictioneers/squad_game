import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from "react";
import Loading from '../components/Loading';
import { GameContext } from '../components/GameContext';

export default function Home() {
  const { setGoal, setTimeWindow } = useContext(GameContext);
  const router = useRouter();
  const [message, setMessage] = useState();

  const setGoalAndTimeWindow = (goal, timeWindow) => {
    localStorage.setItem('goal', goal);
    localStorage.setItem('timeWindow', timeWindow);
    setGoal(goal);
    setTimeWindow(timeWindow);
  }

  useEffect(() => {
    if (localStorage.getItem('userId') && localStorage.getItem('started')) {
      router.push('/question');
      return;
    }
    const getUser = async () => {
      const response = await (await fetch("/api/start")).json();
      localStorage.setItem("userId", response.userId);
      localStorage.setItem('questionId', response.questionId);
      localStorage.setItem('ingredients', JSON.stringify(response.ingredients));
      setGoalAndTimeWindow(response.goal, response.timeWindow);
      setMessage(response.message.replace("\n", "<br/><br/>"));
    };
    getUser();
  }, [])

  const start = () => {
    localStorage.setItem('started', true);
    router.push('/question');
  };

  if (!message) {
    return <Loading />
  }

  return (
    <div className="description">
      <p dangerouslySetInnerHTML={{ __html: message }}></p>
      <button onClick={start}>
        Start
      </button>
    </div>
  )
}
