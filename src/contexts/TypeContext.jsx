import { createContext, useState } from "react";

export const TypeContext = createContext();

// eslint-disable-next-line react/prop-types
export function TypeProvider({ children }) {
  const [selectedTypes, setSelectedTypes] = useState([]);

  const handleTypeSelect = (type) => {
    setSelectedTypes((prevTypes) =>
      prevTypes.includes(type)
        ? prevTypes.filter((t) => t !== type)
        : [...prevTypes, type]
    );
  };

  const clearSelectedTypes = () => {
    setSelectedTypes([]);
  };

  return (
    <TypeContext.Provider
      value={{ selectedTypes, handleTypeSelect, clearSelectedTypes }}
    >
      {children}
    </TypeContext.Provider>
  );
}
