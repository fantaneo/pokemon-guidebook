import { useEffect, useState } from "react";
import PokemonCard from "./PokemonCard";

export default function PokemonCards() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
      .then((res) => res.json())
      .then((data) => {
        setPokemons(data.results);
      })
      .catch((error) =>
        console.error("Error fetching initial pokemon data:", error)
      );
  }, []);

  return (
    <div className="p-5">
      <div className="grid grid-cols-3 gap-4">
        {pokemons.map((pokemon, index) => (
          <PokemonCard key={index} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
}
