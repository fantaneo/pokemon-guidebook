import PropTypes from "prop-types";
import { typeTranslations, getTypeColor } from "../../utils/pokemonHelpers";

export default function PokemonCardFront({ pokemon, cardBackground }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-4 rounded-xl"
      style={{ background: cardBackground }}
    >
      <div className="absolute top-2 left-2 px-2 py-1">
        <span className="text-sm font-bold">No.{pokemon.id}</span>
      </div>
      <div className="relative w-48 h-48 mb-2">
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-125"
        />
      </div>
      <h2 className="text-lg font-bold mb-1">
        {pokemon.japaneseName || pokemon.name}
      </h2>
      {pokemon.category && (
        <p className="text-xs text-gray-600 mb-1">{pokemon.category}</p>
      )}
      <div className="flex gap-1 mb-1">
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
    </div>
  );
}

PokemonCardFront.propTypes = {
  pokemon: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    japaneseName: PropTypes.string,
    category: PropTypes.string,
    types: PropTypes.arrayOf(PropTypes.string).isRequired,
    sprites: PropTypes.shape({
      front_default: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  cardBackground: PropTypes.string.isRequired,
};
