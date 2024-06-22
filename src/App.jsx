import "./App.css";

import { useState, useEffect } from "react";

function App() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon")
      .then((res) => res.json())
      .then((data) => setPokemons(data.results));
  }, []);

  // Helper function to extract Pokemon ID from URL and form the image URL
  const getPokemonImageUrl = (url) => {
    const id = url.split("/").filter(Boolean).pop(); // Extracts the last non-empty segment of the URL
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  };

  return (
    <div className="p-5">
      <div className="grid grid-cols-3 gap-4">
        {pokemons.map((pokemon) => (
          <div
            key={pokemon.name}
            className="bg-gray-200 rounded-lg shadow-md p-4"
          >
            <h1 className="text-lg font-bold">{pokemon.name}</h1>
            <img
              src={getPokemonImageUrl(pokemon.url)}
              alt={pokemon.name}
              className="w-20 h-20"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
