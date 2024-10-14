import { createContext, useReducer, useEffect } from "react";
import { favoritesReducer, initialState } from "./FavoriteReducer";

export const FavoritesContext = createContext();

// eslint-disable-next-line react/prop-types
export const FavoritesProvider = ({ children }) => {
  const [favorites, dispatch] = useReducer(favoritesReducer, initialState);

  useEffect(() => {
    const _favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    _favorites.forEach((pokemon) =>
      dispatch({ type: "ADD_FAVORITE", payload: pokemon })
    );
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, dispatch }}>
      {children}
    </FavoritesContext.Provider>
  );
};
