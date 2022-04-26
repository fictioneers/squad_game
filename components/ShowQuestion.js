const ShowQuestion = ({questionContent, error, clickAnswer, clickSkip}) => (
  <>
    <img src={questionContent.image} alt="Mystery Pokemon" />
    { error && (
      <p className="coral-back">{error}</p>
    )}
    {questionContent.answers.map(a => (
      <button onClick={clickAnswer(a)} key={a}>{a}</button>
    ))}
    <button onClick={clickSkip} className="coral-back">Skip</button>
  </>
);

export default ShowQuestion;
