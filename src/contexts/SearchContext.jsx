import React, { createContext, useState, useContext } from "react";

const SearchContext = createContext();

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [filterText, setFilterText] = useState("");

  return (
    <SearchContext.Provider value={{ filterText, setFilterText }}>
      {children}
    </SearchContext.Provider>
  );
};
