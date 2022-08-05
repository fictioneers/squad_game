import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Loading from '../components/Loading'
import End from './end'
import Correct from '../components/Correct'
import ShowQuestion from '../components/ShowQuestion'

export default function Question() {
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

  const saveIngredients = (ingredients) => {
    setIngredients(ingredients);
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
  }

  useEffect(() => {
    const getUser = async () => {
      const response = await (await fetch("/api/start")).json();
      localStorage.setItem("userId", response.userId);
      setUserId(response.userId);
      saveQuestion(response.questionId);
      saveIngredients(response.ingredients);
      setScreen('question');
    }
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      getUser();
    } else {
      setUserId(storedUserId);
      setQuestionId(localStorage.getItem('questionId'));
      setIngredients(JSON.parse(localStorage.getItem('ingredients')));
      setScreen('question');
    }
  }, []);

  const handleAnswer = (response) => {
    if (response.result == 'completed') {
      setMessage(response.message)
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
