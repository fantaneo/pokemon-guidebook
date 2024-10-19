import { useState, useEffect } from "react";
import PropTypes from "prop-types";

PokemonCard.propTypes = {
  pokemon: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    types: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  toggleFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired,
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
            types: pokemonData.types.map((type) => type.type.name),
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
    <div className="border p-4 rounded-lg shadow-md">
      {pokemonDetail && (
        <>
          <img
            src={pokemonDetail.image}
            alt={pokemonDetail.name}
            className="w-32 h-32 mx-auto"
          />
          <h2 className="text-xl font-bold mt-2">{pokemonDetail.name}</h2>
          <div className="mt-2">
            {pokemonDetail.types &&
              pokemonDetail.types.map((type, index) => (
                <span
                  key={index}
                  className="mr-2 px-2 py-1 bg-gray-200 rounded-full text-sm"
                >
                  {type}
                </span>
              ))}
          </div>
          <div className="mt-2">
            {pokemonDetail.stats.map((stat, index) => (
              <div key={index} className="text-sm">
                {stat.stat.name}: {stat.base_stat}
              </div>
            ))}
          </div>
          <button
            onClick={toggleFavorite}
            className={`mt-2 px-4 py-2 rounded ${
              isFavorite ? "bg-red-500 text-white" : "bg-gray-200"
            }`}
          >
            {isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
          </button>
        </>
      )}
    </div>
  );
}
