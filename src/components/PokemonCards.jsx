import { useEffect, useReducer, useState } from "react";
import PokemonCard from "./PokemonCard";
import FavoritesList from "./FavoritesList";
import { favoritesReducer, initialState, isFavorite } from "./FavoriteReducer";
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"

export default function PokemonCards() {
  const [pokemons, setPokemons] = useState([]);
  const [favorites, dispatch] = useReducer(favoritesReducer, initialState);

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
    const _favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    _favorites.forEach((pokemon) =>
      dispatch({ type: "ADD_FAVORITE", payload: pokemon })
    );
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <div className="p-5">
      <Button variant="ghost" size="icon">
      </Button>
      <FavoritesList favorites={favorites} />
      <div className="grid grid-cols-3 gap-4">
        {pokemons.map((pokemon, index) => (
          <PokemonCard
            key={index}
            pokemon={pokemon}
            isFavorite={() => isFavorite(favorites, pokemon)}
            toggleFavorite={() =>
              dispatch({ type: "TOGGLE_FAVORITE", payload: pokemon })
            }
          />
        ))}
      </div>
    </div>
  );
}
