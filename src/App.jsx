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
    <div>
      {pokemons.map((pokemon) => (
        <div key={pokemon.name}>
          <h1>{pokemon.name}</h1>
        </div>
      ))}
    </div>
  );
}

export default App;
