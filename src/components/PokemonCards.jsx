import { useEffect, useReducer, useState } from "react";
import PokemonCard from "./PokemonCard";
import FavoritesList from "./FavoritesList";
import { favoritesReducer, initialState, isFavorite } from "./FavoriteReducer";

export default function PokemonCards() {
  const [pokemons, setPokemons] = useState([]);
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=10")
      .then((res) => res.json())
      .then((data) => {
        setPokemons(data.results);
      })
      .catch((error) =>
        console.error("Error fetching initial pokemon data:", error)
      );
  }, []);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.forEach((pokemon) =>
      dispatch({ type: "ADD_FAVORITE", payload: pokemon })
    );
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(state.favorites));
  }, [state.favorites]);

  return (
    <div className="p-5">
      <FavoritesList favorites={state.favorites} />
      <div className="grid grid-cols-3 gap-4">
        {pokemons.map((pokemon, index) => (
          <PokemonCard
            key={index}
            pokemon={pokemon}
            isFavorite={() => isFavorite(state, pokemon)}
            toggleFavorite={() =>
              dispatch({ type: "TOGGLE_FAVORITE", payload: pokemon })
            }
          />
        ))}
      </div>
    </div>
  );
}
