const Correct = ({continueClicked, answerImage}) => (
  <>
    <p>You were right!</p>
    <img src={answerImage} alt="Correct Pokemon!" />
    <button onClick={continueClicked}>Continue</button>
  </>
);

export default Correct;
