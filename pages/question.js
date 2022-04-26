import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Question() {
  const router = useRouter();
  const [ userId, setUserId ] = useState("");
  const [ questionContent, setQuestionContent ] = useState(null);
  const [ questionId, setQuestionId ] = useState(null);
  const [ screen, setScreen ] = useState("loading");
  const [ answerImage, setAnswerImage ] = useState(null);
  const [ error, setError ] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const response = await (await fetch("/api/start")).json();
      localStorage.setItem("userId", response.userId);
      setUserId(response.userId);
      setQuestionContent(response.question);
      setQuestionId(response.questionId);
      setScreen('question');
      localStorage.setItem('questionContent', JSON.stringify(response.question));
      localStorage.setItem('questionId', response.questionId);
    }
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      getUser();
    } else {
      setUserId(storedUserId);
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
    }
    setScreen(response.result);
    setQuestionContent(response.question);
    setQuestionId(response.questionId);
    localStorage.setItem('questionContent', JSON.stringify(response.question));
    localStorage.setItem('questionId', response.questionId);
    if (response.result == 'correct') {
      setAnswerImage(response.answerImage)
    }
  };

  const clickAnswer = answer => {
    return async () => {
      setScreen('loading');
      const response = await (await fetch("/api/answer", {
        method: "POST",
        body: JSON.stringify({
            userId,
            questionId,
            answer,
        })
      })).json();
      handleAnswer(response);
    }
  };

  const clickSkip = async () => {
    setScreen('loading');
    const response = await fetch("/api/skip", {
      method: "POST",
      body: JSON.stringify({
          userId,
          questionId,
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
    return (
      <p className="description">
          Loading...
      </p>
    );
  } else if (screen == 'question') {
    return (
      <>
        <img src={questionContent.image} alt="Mystery Pokemon" />
        { error && (
          <p>{error}</p>
        )}
        {questionContent.answers.map(a => (
          <button onClick={clickAnswer(a)} key={a}>{a}</button>
        ))}
        <button onClick={clickSkip}>Skip</button>
      </>
    );
  } else if (screen == 'skipped') {
    return (
      <>
        <p>Question skipped!</p>
        <button onClick={continueClicked}>Continue</button>
      </>
    )
  } else if (screen == 'incorrect') {
    return (
      <>
        <p>You were wrong!</p>
        <button onClick={continueClicked}>Continue</button>
      </>
    );
  } else {
    return (
      <>
        <p>You were right!</p>
        <img src={answerImage} alt="Correct Pokemon!" />
        <button onClick={continueClicked}>Continue</button>
      </>
    );
  }
}
