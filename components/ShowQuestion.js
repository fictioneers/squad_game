const ShowQuestion = ({answers, error, clickAnswer}) => (
  <>
    { error && (
      <p className="coral-back">{error}</p>
    )}
    {answers.map(a => (
      <button onClick={clickAnswer(a)} key={a}>{a}</button>
    ))}
  </>
);

export default ShowQuestion;
