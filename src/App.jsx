import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [pokemons, setPokemons] = useState([]);

  const pokemonImageUrl = (imageUrl) => {
    const url = imageUrl.split("/").filter(Boolean).pop();
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${url}.png`;
  };

  const getPokemonName = (speciesData) => {
    return (
      speciesData.names.find((name) => name.language.name === "ja-Hrkt") || {
        name: "名前なし",
      }
    );
  };

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=50")
      .then((res) => res.json())
      .then((data) => {
        const promises = data.results.map((pokemon) =>
          fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`)
            .then((res) => res.json())
            .then((speciesData) => {
              const jpName = getPokemonName(speciesData);
              return {
                id: pokemon.name,
                name: jpName.name,
                image: pokemonImageUrl(pokemon.url),
              };
            })
            .catch((error) =>
              console.error("Error fetching species details:", error)
            )
        );
        Promise.all(promises).then((pokemonNames) => {
          setPokemons(pokemonNames);
        });
      })
      .catch((error) =>
        console.error("Error fetching initial pokemon data:", error)
      );
  }, []);

  return (
    <div className="p-5">
      <div className="grid grid-cols-3 gap-4">
        {pokemons.map((pokemon) => (
          <div
            key={pokemon.id}
            className="bg-gray-200 rounded-lg shadow-md p-4"
          >
            <h1 className="text-lg font-bold">{pokemon.name}</h1>
            <img
              src={pokemon.image}
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
