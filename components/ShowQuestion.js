const ShowQuestion = ({answers, error, clickAnswer}) => (
  <>
    { error && (
      <p>{error}</p>
    )}
    {answers.map(a => (
      <span className={a.replace(' ','-') + " ingredient"} onClick={clickAnswer(a)} key={a} title={a}/>
    ))}
  </>
);

export default ShowQuestion;
