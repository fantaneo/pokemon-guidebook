import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { POKEMON_TYPE_MAPPING } from "../constants/pokemonTypeMapping";

PokemonCard.propTypes = {
  pokemon: PropTypes.shape({
    name: PropTypes.string.isRequired,
    types: PropTypes.arrayOf(PropTypes.string).isRequired,
    sprites: PropTypes.shape({
      front_default: PropTypes.string.isRequired,
    }).isRequired,
    japaneseName: PropTypes.string,
    height: PropTypes.number.isRequired,
    weight: PropTypes.number.isRequired,
    stats: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  toggleFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired,
};

export default function PokemonCard({ pokemon, toggleFavorite, isFavorite }) {
  return (
    <div className="...">
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className="..."
      />
      <h2 className="...">{pokemon.japaneseName || pokemon.name}</h2>
      <p>タイプ: {pokemon.types.join(", ")}</p>
      <p>身長: {pokemon.height / 10}m</p>
      <p>体重: {pokemon.weight / 10}kg</p>
      <h3>能力値:</h3>
      <ul>
        {pokemon.stats.map((stat) => (
          <li key={stat.name}>
            {stat.name}: {stat.value}
          </li>
        ))}
      </ul>
      <button onClick={() => toggleFavorite(pokemon)} className="...">
        {isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
      </button>
    </div>
  );
}
