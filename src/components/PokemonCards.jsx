import { useEffect, useState } from "react";
import PokemonCard from "./PokemonCard";
import FavoritesList from "./FavoritesList";

export default function PokemonCards() {
  const [pokemons, setPokemons] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1")
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
    setFavorites(favorites);
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (pokemon) => {
    return favorites.some((fav) => fav.name === pokemon.name);
  };

  const toggleFavorite = (pokemon) => {
    const fav = [...favorites];
    if (fav.includes(pokemon)) {
      fav.splice(fav.indexOf(pokemon), 1);
    } else {
      fav.push(pokemon);
    }
    setFavorites(fav);
  };

  return (
    <div className="p-5">
      <FavoritesList favorites={favorites} />
      <div className="grid grid-cols-3 gap-4">
        {pokemons.map((pokemon, index) => (
          <PokemonCard
            key={index}
            pokemon={pokemon}
            isFavorite={isFavorite(pokemon)}
            toggleFavorite={() => toggleFavorite(pokemon)}
          />
        ))}
      </div>
    </div>
  );
}
