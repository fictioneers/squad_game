import { useContext, useEffect, useState } from 'react';
import { GameContext } from './GameContext';
import Loading from './Loading';

const BossStatus = () => {
  const { goal, timeWindow } = useContext(GameContext);
  const [ currentCompleted, setCurrentCompleted ] = useState(null);

  useEffect(() => {
    const getCurrentCompleted = async () => {
      const response = await (await fetch(`/api/read_completed?period=${timeWindow * 1000}`)).json();
      setCurrentCompleted(response.completed);
    };
    if (timeWindow > 0) {
      getCurrentCompleted();
    }
  }, [timeWindow]);

  if (goal < 1 || timeWindow < 1 || currentCompleted === null) {
    return <Loading />;
  }
  return (
    <div className="description">
        {goal <= currentCompleted && <div className="boss boss-happy"><p>The boss is happy :) </p></div>}
        {goal > currentCompleted && <div className="boss boss-angry"><p>The boss is angry :( </p></div>}
    </div>
  );
}

export default BossStatus