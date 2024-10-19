import { createContext, useReducer, useEffect } from "react";
import { favoritesReducer, initialState } from "./FavoriteReducer";

export const FavoritesContext = createContext();

// eslint-disable-next-line react/prop-types
export const FavoritesProvider = ({ children }) => {
  const [favorites, dispatch] = useReducer(favoritesReducer, initialState);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    storedFavorites.forEach((pokemon) =>
      dispatch({ type: "ADD_FAVORITE", payload: pokemon })
    );
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, dispatch }}>
      {children}
    </FavoritesContext.Provider>
  );
};
