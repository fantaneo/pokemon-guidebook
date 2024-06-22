import "./App.css";

import { useState, useEffect } from "react";

function App() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon")
      .then((res) => res.json())
      .then((data) => setPokemons(data.results));
  }, []);

  return (
    <div className="p-5">
      <div className="grid grid-cols-3 gap-4">
        {pokemons.map((pokemon) => (
          <div
            key={pokemon.name}
            className="bg-gray-200 rounded-lg shadow-md p-4"
          >
            <h1 className="text-lg font-bold">{pokemon.name}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
