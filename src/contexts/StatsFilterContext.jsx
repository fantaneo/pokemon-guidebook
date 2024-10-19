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
  const [statsFilter, setStatsFilter] = useState({
    hp: 0,
    attack: 0,
    defense: 0,
    specialAttack: 0, // キャメルケースに変更
    specialDefense: 0, // キャメルケースに変更
    speed: 0,
  });

  const updateStatFilter = (stat, value) => {
    setStatsFilter((prev) => ({ ...prev, [stat]: value }));
  };

  // フィルターをリセットする関数を追加
  const resetStatsFilter = () => {
    setStatsFilter({
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
    });
  };

  return (
    <StatsFilterContext.Provider
      value={{ statsFilter, updateStatFilter, resetStatsFilter }}
    >
      {children}
    </StatsFilterContext.Provider>
  );
};
