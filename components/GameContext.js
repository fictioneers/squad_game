import { createContext, useState } from "react";

export const GameContext = createContext({
  goal: 0,
  setGoal: () => {},
  timeWindow: 0,
  setTimeWindow: () => {},
});

const GameProvider = ({ children }) => {
  const [goal, setGoal] = useState(0);
  const [timeWindow, setTimeWindow] = useState(0);

  const contextValue = {
    goal,
    setGoal,
    timeWindow,
    setTimeWindow,
  }

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};

export default GameProvider;
