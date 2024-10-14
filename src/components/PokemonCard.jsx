import { useState, useEffect } from "react";
import PropTypes from "prop-types";

PokemonCard.propTypes = {
  pokemon: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  toggleFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.func.isRequired,
};

export default function PokemonCard({ pokemon, toggleFavorite, isFavorite }) {
  const [pokemonDetail, setPokemonDetail] = useState(null);

  const pokemonImageUrl = (imageUrl) => {
    const url = imageUrl.split("/").filter(Boolean).pop();
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${url}.png`;
  };

  const getPokemonName = async (url) => {
    try {
      const res = await fetch(url);
      const speciesData = await res.json();
      return (
        speciesData.names.find((name) => name.language.name === "ja-Hrkt") || {
          name: "名前なし",
        }
      );
    } catch (error) {
      console.error("Error fetching species name:", error);
      return { name: "名前なし" };
    }
  };

  useEffect(() => {
    const fetchPokemon = async () => {
      fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
        .then((res) => res.json())
        .then(async (pokemonData) => {
          const speciesData = pokemonData.species;
          const jpName = await getPokemonName(speciesData.url);
          setPokemonDetail({
            id: pokemon.name,
            name: jpName.name,
            image: pokemonImageUrl(pokemon.url),
            stats: pokemonData.stats,
          });
        })
        .catch((error) =>
          console.error("Error fetching species details:", error)
        );
    };
    fetchPokemon();
  }, [pokemon.name, pokemon.url]);

  if (!pokemonDetail) {
    return (
      <div className="bg-gray-200 rounded-lg shadow-md p-4">
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      key={pokemonDetail.id}
      className="bg-gray-200 rounded-lg shadow-md p-4"
    >
      <button onClick={() => toggleFavorite()}>
        {isFavorite() ? "♥" : "♡"}
      </button>

      <h1 className="text-lg font-bold">{pokemonDetail.name}</h1>
      <img
        src={pokemonDetail.image}
        alt={pokemonDetail.name}
        className="w-20 h-20"
      />
      <ul>
        {pokemonDetail.stats.map((stat) => (
          <li key={stat.stat.name} className="text-left">
            {stat.stat.name}:{" "}
            <span className="text-xl font-bold">{stat.base_stat}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
