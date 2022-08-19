const ShowQuestion = ({answers, error, clickAnswer}) => (
  <>
    { error && (
      <p>{error}</p>
    )}
    <div className="ingredients-table">
        {answers.map(a => (
        <span className={a.replace(' ','-') + " ingredient"} onClick={clickAnswer(a)} key={a} title={a}/>
        ))}
    </div>
  </>
);

export default ShowQuestion;
