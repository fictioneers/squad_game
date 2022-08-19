const Correct = ({ continueClicked, message }) => (
  <>
    <div className="description">
        <p>{message}</p>
        <button onClick={continueClicked}>Continue</button>
    </div>
  </>
);

export default Correct;
