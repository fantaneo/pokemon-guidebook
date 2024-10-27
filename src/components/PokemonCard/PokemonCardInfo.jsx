import PropTypes from "prop-types";
import {
  typeTranslations,
  getTypeColor,
  statTranslations,
} from "../../utils/pokemonHelpers";
import { POKEMON_ABILITIES } from "../../constants/pokemonAbilities";

export default function PokemonCardInfo({ pokemon, cardBackground }) {
  const getAbilityJapaneseName = (abilityName) => {
    return POKEMON_ABILITIES[abilityName.toLowerCase()] || abilityName;
  };

  return (
    <div
      className="w-full h-full flex flex-col p-4 rounded-xl relative"
      style={{ background: cardBackground }}
    >
      <div className="flex items-start mb-2">
        <div className="flex flex-col items-start">
          <h2 className="text-lg font-bold">
            {pokemon.japaneseName || pokemon.name}
          </h2>
          {pokemon.category && (
            <p className="text-sm text-gray-600">{pokemon.category}</p>
          )}
        </div>
      </div>
      <div className="absolute top-2 right-2 z-10">
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-32 h-32 object-contain transform scale-125 hover:scale-150 transition-transform duration-300"
        />
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        {pokemon.types.map((type) => (
          <span
            key={type}
            className="px-2 py-0.5 rounded-full text-sm font-semibold text-white"
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
              {ability.is_hidden && " (隠れ特)"}
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
    </div>
  );
}

PokemonCardInfo.propTypes = {
  pokemon: PropTypes.shape({
    name: PropTypes.string.isRequired,
    japaneseName: PropTypes.string,
    category: PropTypes.string,
    types: PropTypes.arrayOf(PropTypes.string).isRequired,
    sprites: PropTypes.shape({
      front_default: PropTypes.string.isRequired,
    }).isRequired,
    height: PropTypes.number.isRequired,
    weight: PropTypes.number.isRequired,
    abilities: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        is_hidden: PropTypes.bool.isRequired,
      })
    ).isRequired,
    stats: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      })
    ).isRequired,
    description: PropTypes.string,
  }).isRequired,
  cardBackground: PropTypes.string.isRequired,
};
