import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Question() {
  const router = useRouter();
  const [ userId, setUserId ] = useState("");
  const [ questionContent, setQuestionContent ] = useState(null);
  const [ questionId, setQuestionId ] = useState(null);
  const [ screen, setScreen ] = useState("loading");
  const [ answerImage, setAnswerImage ] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        const response = await (await fetch("/api/start")).json();
        localStorage.setItem("userId", response.userId);
        setUserId(response.userId);
        setQuestionContent(response.question);
        setQuestionId(response.questionId);
        setScreen('question');
      }
    }
    getUser();
  }, []);

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
      if (response.result == 'completed') {
        localStorage.setItem("score", response.correct);
        localStorage.setItem("outOf", response.correct + response.incorrect);
        router.push('/end');
        return;
      }
      setScreen(response.result);
      setQuestionContent(response.question);
      setQuestionId(response.questionId);
      if (response.result == 'correct') {
        setAnswerImage(response.answerImage)
      }
    }
  };

  const continueClicked = () => setScreen('question');

  if (screen == 'loading') {
    return (
      <>
        <p className={styles.description}>
            Loading...
        </p>
      </>
    );
  } else if (screen == 'question') {
    return (
      <>
        <img src={questionContent.image} alt="Mystery Pokemon" />
        {questionContent.answers.map(a => (
          <button onClick={clickAnswer(a)} key={a}>{a}</button>
        ))}
      </>
    );
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
