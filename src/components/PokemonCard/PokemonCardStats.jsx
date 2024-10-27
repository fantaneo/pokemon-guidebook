import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import {
  typeTranslations,
  getTypeColor,
  statTranslations,
} from "../../utils/pokemonHelpers";

export default function PokemonCardStats({ pokemon, cardBackground }) {
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    // コンポーネントがマウントされたらアニメーションを開始
    setAnimateStats(true);
    // アニメーション終了後にフラグをリセット
    const timer = setTimeout(() => setAnimateStats(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const maxStat = useMemo(() => {
    return Math.max(...pokemon.stats.map((stat) => stat.value));
  }, [pokemon.stats]);

  const calculateStatPercentage = (value) => {
    return (Math.min(value, 150) / 150) * 100;
  };

  return (
    <div
      className="w-full h-full flex flex-col items-start justify-start p-4 rounded-xl relative"
      style={{ background: cardBackground }}
    >
      <div className="flex items-center mb-2 w-full">
        <div className="flex flex-col items-start">
          <h2 className="text-lg font-bold">
            {pokemon.japaneseName || pokemon.name}
          </h2>
          {pokemon.category && (
            <p className="text-xs text-gray-600">{pokemon.category}</p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        {pokemon.types.map((type) => (
          <span
            key={type}
            className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: getTypeColor(type) }}
          >
            {typeTranslations[type.toLowerCase()] || type}
          </span>
        ))}
      </div>
      <div className="absolute top-2 right-2 z-10">
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-32 h-32 object-contain transform scale-125 hover:scale-150 transition-transform duration-300"
        />
      </div>
      <ul className="w-full mt-16">
        {pokemon.stats.map((stat, index) => (
          <li
            key={stat.name}
            className="flex justify-between items-center mb-1"
          >
            <span className="text-sm font-medium w-20">
              {statTranslations[stat.name] || stat.name}:
            </span>
            <span
              className={`text-lg font-bold w-12 text-right mr-2 ${
                stat.value === maxStat ? "text-indigo-700" : ""
              } ${animateStats ? "animate-stat-pop" : ""}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {stat.value}
            </span>
            <div className="w-1/2 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full ${
                  stat.value === maxStat ? "bg-indigo-600" : "bg-teal-500"
                } ${animateStats ? "animate-stat-bar" : ""}`}
                style={{
                  width: animateStats
                    ? "0%"
                    : `${calculateStatPercentage(stat.value)}%`,
                  animationDelay: `${index * 100}ms`,
                  "--stat-width": `${calculateStatPercentage(stat.value)}%`,
                }}
              ></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

PokemonCardStats.propTypes = {
  pokemon: PropTypes.shape({
    name: PropTypes.string.isRequired,
    japaneseName: PropTypes.string,
    category: PropTypes.string,
    types: PropTypes.arrayOf(PropTypes.string).isRequired,
    sprites: PropTypes.shape({
      front_default: PropTypes.string.isRequired,
    }).isRequired,
    stats: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  cardBackground: PropTypes.string.isRequired,
};
