import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function PokemonCard({ pokemon }) {
  PokemonCard.propTypes = {
    pokemon: PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
  };

  const [pokemonDetails, setPokemonDetails] = useState(null);

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
    const fetchPokemon = () =>
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`)
        .then((res) => res.json())
        .then((speciesData) => {
          const jpName = getPokemonName(speciesData);
          setPokemonDetails({
            id: pokemon.name,
            name: jpName.name,
            image: pokemonImageUrl(pokemon.url),
          });
        })
        .catch((error) =>
          console.error("Error fetching species details:", error)
        );
    fetchPokemon();
  }, [pokemon.name, pokemon.url]);

  if (!pokemonDetails) {
    return null;
  }

  return (
    <div
      key={pokemonDetails.id}
      className="bg-gray-200 rounded-lg shadow-md p-4"
    >
      <h1 className="text-lg font-bold">{pokemonDetails.name}</h1>
      <img
        src={pokemonDetails.image}
        alt={pokemonDetails.name}
        className="w-20 h-20"
      />
    </div>
  );
}
