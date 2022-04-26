import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Loading from '../components/Loading'
import Skipped from '../components/Skipped'
import Incorrect from '../components/Incorrect'
import Correct from '../components/Correct'
import TimesUp from '../components/TimesUp'
import ShowQuestion from '../components/ShowQuestion'

export default function Question() {
  const router = useRouter();
  const [ userId, setUserId ] = useState("");
  const [ questionContent, setQuestionContent ] = useState(null);
  const [ questionId, setQuestionId ] = useState(null);
  const [ screen, setScreen ] = useState("loading");
  const [ answerImage, setAnswerImage ] = useState(null);
  const [ error, setError ] = useState(null);
  const [ startTime, setStartTime ] = useState(null);

  const saveQuestion = (questionContent, questionId) => {
    setQuestionContent(questionContent);
    setQuestionId(questionId);
    localStorage.setItem('questionContent', JSON.stringify(questionContent));
    localStorage.setItem('questionId', questionId);
  }

  useEffect(() => {
    const getUser = async () => {
      const response = await (await fetch("/api/start")).json();
      localStorage.setItem("userId", response.userId);
      localStorage.setItem("startTime", JSON.stringify(response.startTime))
      setStartTime(response.startTime)
      setUserId(response.userId);
      saveQuestion(response.question, response.questionId);
      setScreen('question');
    }
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      getUser();
    } else {
      setUserId(storedUserId);
      setStartTime(JSON.parse(localStorage.getItem('startTime')));
      setQuestionContent(JSON.parse(localStorage.getItem('questionContent')));
      setQuestionId(localStorage.getItem('questionId'));
      setScreen('question');
    }
  }, []);

  const handleAnswer = (response) => {
    if (response.result == 'completed') {
      localStorage.setItem("score", response.correct);
      localStorage.setItem("outOf", response.correct + response.incorrect);
      router.push('/end');
      return;
    } else if (response.result == 'timeout') {
      setScreen(response.result);
      return;
    }
    setScreen(response.result);
    saveQuestion(response.question, response.questionId);
    if (response.result == 'correct') {
      setAnswerImage(response.answerImage)
    }
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
            startTime,
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

  const clickSkip = async () => {
    setScreen('loading');
    const response = await fetch("/api/skip", {
      method: "POST",
      body: JSON.stringify({
          userId,
          questionId,
          startTime,
      })
    });
    if (response.status == 200) {
      const responseJson = await response.json();
      handleAnswer(responseJson);
    } else if (response.status == 400) {
      setError("Sorry, you've used all your skips!");
      setScreen("question");
    } else {
      setError("Something went wrong!");
      setScreen("question");
    }
  };

  const continueClicked = () => setScreen('question');

  if (screen == 'loading') {
    return (<Loading />);
  } else if (screen == 'question') {
    return (
      <ShowQuestion 
        questionContent={questionContent}
        error={error}
        clickAnswer={clickAnswer}
        clickSkip={clickSkip} />
    );
  } else if (screen == 'skipped') {
    return (<Skipped continueClicked={continueClicked} />)
  } else if (screen == 'incorrect') {
    return (<Incorrect continueClicked={continueClicked} />);
  } else if (screen == 'timeout') {
    return (<TimesUp />);
  } else {
    return (
      <Correct continueClicked={continueClicked} answerImage={answerImage} />
    );
  }
}
