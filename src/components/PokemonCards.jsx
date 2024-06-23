import { useEffect, useState } from "react";
import PokemonCard from "./PokemonCard";

export default function PokemonCards() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    let isMounted = true;

    fetch("https://pokeapi.co/api/v2/pokemon?limit=50")
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (isMounted) {
          setPokemons(data.results);
        }
      })
      .catch((error) =>
        console.error("Error fetching initial pokemon data:", error)
      );
    return () => {
      isMounted = false;
    };
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
