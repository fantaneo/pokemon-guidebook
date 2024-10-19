import React, { createContext, useState, useContext } from "react";

const StatsFilterContext = createContext();

export const useStatsFilterContext = () => {
  const context = useContext(StatsFilterContext);
  if (context === undefined) {
    throw new Error(
      "useStatsFilterContext must be used within a StatsFilterProvider"
    );
  }
  return context;
};

export const StatsFilterProvider = ({ children }) => {
  const [attackFilter, setAttackFilter] = useState(0);

  return (
    <StatsFilterContext.Provider value={{ attackFilter, setAttackFilter }}>
      {children}
    </StatsFilterContext.Provider>
  );
};
