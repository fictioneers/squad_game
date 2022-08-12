const Correct = ({ continueClicked, message }) => (
  <>
    <p>{message}</p>
    <button onClick={continueClicked}>Continue</button>
  </>
);

export default Correct;
