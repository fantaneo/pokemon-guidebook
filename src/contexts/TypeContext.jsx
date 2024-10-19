import React, { createContext, useState, useContext } from "react";

const TypeContext = createContext();

export function TypeProvider({ children }) {
  const [selectedTypes, setSelectedTypes] = useState([]);

  const handleTypeSelect = (type) => {
    setSelectedTypes((prevTypes) =>
      prevTypes.includes(type)
        ? prevTypes.filter((t) => t !== type)
        : [...prevTypes, type]
    );
  };

  return (
    <TypeContext.Provider value={{ selectedTypes, handleTypeSelect }}>
      {children}
    </TypeContext.Provider>
  );
}

export function useTypeContext() {
  return useContext(TypeContext);
}
