import { useEffect, useState, useContext } from 'react';
import Loading from '../components/Loading';
import End from '../components/end';
import Correct from '../components/Correct';
import ShowQuestion from '../components/ShowQuestion';
import { useRouter } from 'next/router';
import { GameContext } from '../components/GameContext';

export default function Question() {
  const { setGoal, setTimeWindow } = useContext(GameContext);
  const router = useRouter();
  const [ userId, setUserId ] = useState("");
  const [ questionId, setQuestionId ] = useState(null);
  const [ ingredients, setIngredients ] = useState(null);
  const [ screen, setScreen ] = useState("loading");
  const [ error, setError ] = useState(null);
  const [ message, setMessage] = useState('');

  const saveQuestion = (questionId) => {
    setQuestionId(questionId);
    localStorage.setItem('questionId', questionId);
  }

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      router.push("/");
    } else {
      setUserId(storedUserId);
      setQuestionId(localStorage.getItem('questionId'));
      setIngredients(JSON.parse(localStorage.getItem('ingredients')));
      setScreen('question');
      setGoal(localStorage.getItem('goal'));
      setTimeWindow(localStorage.getItem('timeWindow'));
    }
  }, []);

  const handleAnswer = (response) => {
    if (response.result == 'completed') {
      setMessage(response.message);
    }
    setScreen(response.result);
    saveQuestion(response.questionId);
  };

  const clickAnswer = answer => {
    return async () => {
      setScreen('loading');
      const response = await fetch("/api/answer", {
        method: "POST",
        body: JSON.stringify({
            userId,
            questionId,
            answer,
        })
      });
      if (response.status == 200) {
        const responseJson = await response.json();
        handleAnswer(responseJson);
      } else {
        setError("Something went wrong!");
        setScreen("question");
      }
    }
  };

  const continueClicked = () => setScreen('question');

  if (screen == 'loading') {
    return (<Loading />);
  } else if (screen == 'question') {
    return (
      <ShowQuestion
        answers={ingredients}
        error={error}
        clickAnswer={clickAnswer} />
    );
  } else if (screen == 'completed') {
    return (<End message={message} />);
  } else {
    return (
      <Correct continueClicked={continueClicked} />
    );
  }
}
