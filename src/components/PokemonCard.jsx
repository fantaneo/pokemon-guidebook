import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { POKEMON_TYPE_MAPPING } from "../constants/pokemonTypeMapping";
import { FaHeart, FaRegHeart } from "react-icons/fa";

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

const typeTranslations = {
  normal: "ノーマル",
  fire: "ほのお",
  water: "みず",
  electric: "でんき",
  grass: "くさ",
  ice: "こおり",
  fighting: "かくとう",
  poison: "どく",
  ground: "じめん",
  flying: "ひこう",
  psychic: "エスパー",
  bug: "むし",
  rock: "いわ",
  ghost: "ゴースト",
  dragon: "ドラゴン",
  dark: "あく",
  steel: "はがね",
  fairy: "フェアリー",
};

const statTranslations = {
  hp: "HP",
  attack: "こうげき",
  defense: "ぼうぎょ",
  "special-attack": "とくこう",
  "special-defense": "とくぼう",
  speed: "すばやさ",
};

export default function PokemonCard({ pokemon, toggleFavorite, isFavorite }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const getTypeColor = (type) => {
    return POKEMON_TYPE_MAPPING[type.toLowerCase()] || "#A8A878"; // デフォルトは通常タイプの色
  };

  const maxStat = useMemo(() => {
    return Math.max(...pokemon.stats.map((stat) => stat.value));
  }, [pokemon.stats]);

  const FavoriteButton = () => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(pokemon);
      }}
      className="absolute top-2 right-2 text-2xl"
    >
      {isFavorite ? (
        <FaHeart className="text-gray-500" />
      ) : (
        <FaRegHeart className="text-gray-500" />
      )}
    </button>
  );

  return (
    <div
      className={`relative w-64 h-96 rounded-xl shadow-lg transition-transform duration-300 transform ${
        isFlipped ? "rotate-y-180" : ""
      }`}
      onClick={handleCardFlip}
    >
      <div
        className={`absolute w-full h-full backface-hidden ${
          isFlipped ? "hidden" : ""
        }`}
      >
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-300 rounded-xl">
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-32 h-32 object-contain mb-4"
          />
          <h2 className="text-xl font-bold mb-2">
            {pokemon.japaneseName || pokemon.name}
          </h2>
          <div className="flex gap-2 mb-2">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: getTypeColor(type) }}
              >
                {typeTranslations[type.toLowerCase()] || type}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600">タップしてさらに詳細を表示</p>
          <FavoriteButton />
        </div>
      </div>
      <div
        className={`absolute w-full h-full backface-hidden rotate-y-180 ${
          isFlipped ? "" : "hidden"
        }`}
      >
        <div className="w-full h-full flex flex-col items-center justify-between p-4 bg-gradient-to-br from-gray-100 to-gray-300 rounded-xl">
          <h3 className="text-lg font-bold mb-2">能力値</h3>
          <ul className="w-full">
            {pokemon.stats.map((stat) => (
              <li
                key={stat.name}
                className="flex justify-between items-center mb-2"
              >
                <span className="text-sm w-20">
                  {statTranslations[stat.name] || stat.name}:
                </span>
                <span
                  className={`text-lg font-bold w-12 text-right mr-2 ${
                    stat.value === maxStat ? "text-indigo-700" : ""
                  }`}
                >
                  {stat.value}
                </span>
                <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      stat.value === maxStat ? "bg-indigo-600" : "bg-teal-500"
                    }`}
                    style={{ width: `${(stat.value / 255) * 100}%` }}
                  ></div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <p className="text-sm">身長: {pokemon.height / 10}m</p>
            <p className="text-sm">体重: {pokemon.weight / 10}kg</p>
          </div>
          <FavoriteButton />
        </div>
      </div>
    </div>
  );
}
