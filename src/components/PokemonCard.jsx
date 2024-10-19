import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { POKEMON_TYPE_MAPPING } from "../constants/pokemonTypeMapping";
import { POKEMON_ABILITIES } from "../constants/pokemonAbilities";
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
    category: PropTypes.string,
    description: PropTypes.string,
    abilities: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        is_hidden: PropTypes.bool.isRequired,
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
  const [cardFace, setCardFace] = useState(0);
  const [animateStats, setAnimateStats] = useState(false);

  const handleCardFlip = () => {
    setCardFace((prevFace) => {
      const newFace = (prevFace + 1) % 3;
      if (newFace === 1) {
        setAnimateStats(true);
        setTimeout(() => setAnimateStats(false), 1000); // アニメーション終了後にリセット
      }
      return newFace;
    });
  };

  const getTypeColor = (type) => {
    return POKEMON_TYPE_MAPPING[type.toLowerCase()] || "#A8A878"; // ��ォルトは通常タイプの色
  };

  const maxStat = useMemo(() => {
    return Math.max(...pokemon.stats.map((stat) => stat.value));
  }, [pokemon.stats]);

  // 能力値のパーセンテージを計算する関数
  const calculateStatPercentage = (value) => {
    return (Math.min(value, 150) / 150) * 100;
  };

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

  const CardIndicator = () => (
    <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full ${
            cardFace === index ? "bg-blue-500" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );

  // 特性の日本語名を取得する関数
  const getAbilityJapaneseName = (abilityName) => {
    return POKEMON_ABILITIES[abilityName.toLowerCase()] || abilityName;
  };

  return (
    <div
      className="relative w-64 h-96 rounded-xl shadow-lg transition-transform duration-300 transform cursor-pointer"
      onClick={handleCardFlip}
    >
      {/* 表面 */}
      <div
        className={`absolute w-full h-full ${cardFace === 0 ? "" : "hidden"}`}
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
          {pokemon.category && (
            <p className="text-sm text-gray-600 mb-2">{pokemon.category}</p>
          )}
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

      {/* 裏面 (能力値) */}
      <div
        className={`absolute w-full h-full ${cardFace === 1 ? "" : "hidden"}`}
      >
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-300 rounded-xl">
          <div className="flex items-center mb-2">
            <div className="flex flex-col items-start mr-4">
              <h2 className="text-xl font-bold">
                {pokemon.japaneseName || pokemon.name}
              </h2>
              {pokemon.category && (
                <p className="text-sm text-gray-600">{pokemon.category}</p>
              )}
            </div>
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-16 h-16 object-contain"
            />
          </div>
          <div className="flex gap-2 mb-4">
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
          <ul className="w-full">
            {pokemon.stats.map((stat, index) => (
              <li
                key={stat.name}
                className="flex justify-between items-center mb-1"
              >
                <span className="text-base font-medium w-24">
                  {statTranslations[stat.name] || stat.name}:
                </span>
                <span
                  className={`text-2xl font-bold w-16 text-right mr-2 ${
                    stat.value === maxStat ? "text-indigo-700" : ""
                  } ${animateStats ? "animate-stat-pop" : ""}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {stat.value}
                </span>
                <div className="w-1/2 bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      stat.value === maxStat ? "bg-indigo-600" : "bg-teal-500"
                    } ${animateStats ? "animate-stat-bar" : ""}`}
                    style={{
                      width: animateStats
                        ? 0
                        : `${calculateStatPercentage(stat.value)}%`,
                      animationDelay: `${index * 100}ms`,
                      "--stat-width": `${calculateStatPercentage(stat.value)}%`,
                    }}
                  ></div>
                </div>
              </li>
            ))}
          </ul>
          <FavoriteButton />
        </div>
      </div>

      {/* フレーバーテキストと追加情報 */}
      <div
        className={`absolute w-full h-full ${cardFace === 2 ? "" : "hidden"}`}
      >
        <div className="w-full h-full flex flex-col p-4 bg-gradient-to-br from-gray-100 to-gray-300 rounded-xl">
          <div className="flex items-center mb-2">
            <div className="flex flex-col items-start mr-4">
              <h2 className="text-xl font-bold">
                {pokemon.japaneseName || pokemon.name}
              </h2>
              {pokemon.category && (
                <p className="text-sm text-gray-600">{pokemon.category}</p>
              )}
            </div>
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-16 h-16 object-contain"
            />
          </div>
          <div className="flex gap-2 mb-2">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className="px-2 py-1 rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: getTypeColor(type) }}
              >
                {typeTranslations[type.toLowerCase()] || type}
              </span>
            ))}
          </div>
          <div className="flex mt-1">
            <span className="text-sm font-semibold mr-2 w-12">体格:</span>
            <div>
              <p className="text-sm">身長: {pokemon.height / 10}m</p>
              <p className="text-sm">体重: {pokemon.weight / 10}kg</p>
            </div>
          </div>
          <div className="flex mt-1">
            <span className="text-sm font-semibold mr-2 w-12">特性:</span>
            <ul className="list-none">
              {pokemon.abilities.map((ability, index) => (
                <li key={index} className="text-sm">
                  {getAbilityJapaneseName(ability.name)}
                  {ability.is_hidden && " (隠れ特性)"}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-2">
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              {pokemon.stats.map((stat) => (
                <div key={stat.name} className="flex justify-between">
                  <span className="text-sm font-medium">
                    {statTranslations[stat.name] || stat.name}:
                  </span>
                  <span className="text-sm font-bold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-grow" />
          <div className="mt-1">
            <p className="text-sm text-gray-800 overflow-y-auto max-h-20">
              {pokemon.description}
            </p>
          </div>
          <FavoriteButton />
        </div>
      </div>

      <CardIndicator />
    </div>
  );
}
