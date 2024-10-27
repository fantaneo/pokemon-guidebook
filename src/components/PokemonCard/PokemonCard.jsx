import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { getTypeGradient } from "../../utils/typeGradients";
import PokemonCardFront from "./PokemonCardFront";
import PokemonCardStats from "./PokemonCardStats";
import PokemonCardInfo from "./PokemonCardInfo";
import PokemonCardEvolution from "./PokemonCardEvolution";
import FavoriteButton from "./FavoriteButton";
import CardIndicator from "./CardIndicator";

export default function PokemonCard({
  pokemon,
  toggleFavorite,
  isFavorite,
  initialCardFace = 0,
}) {
  const [cardFace, setCardFace] = useState(initialCardFace);
  const [isFlipping, setIsFlipping] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (cardFace !== initialCardFace) {
      setIsFlipping(true);
      setTimeout(() => {
        setCardFace(initialCardFace);
        setIsFlipping(false);
        setKey((prev) => prev + 1);
      }, 300);
    }
  }, [initialCardFace]);

  const handleCardFlip = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setCardFace((prevFace) => (prevFace + 1) % 4);
      setIsFlipping(false);
      setKey((prev) => prev + 1);
    }, 300);
  };

  const cardBackground = useMemo(() => {
    const types = pokemon.types.map((type) => type.toLowerCase());
    return getTypeGradient(types);
  }, [pokemon.types]);

  return (
    <div
      className="relative w-64 h-96 rounded-xl shadow-lg transition-transform duration-300 transform cursor-pointer"
      onClick={handleCardFlip}
    >
      <div
        className={`absolute w-full h-full ${cardFace === 0 ? "" : "hidden"} ${
          isFlipping ? "flip-card" : ""
        }`}
      >
        <PokemonCardFront pokemon={pokemon} cardBackground={cardBackground} />
      </div>

      <div
        className={`absolute w-full h-full ${cardFace === 1 ? "" : "hidden"} ${
          isFlipping ? "flip-card" : ""
        }`}
      >
        <PokemonCardStats
          key={key}
          pokemon={pokemon}
          cardBackground={cardBackground}
        />
      </div>

      <div
        className={`absolute w-full h-full ${cardFace === 2 ? "" : "hidden"} ${
          isFlipping ? "flip-card" : ""
        }`}
      >
        <PokemonCardInfo pokemon={pokemon} cardBackground={cardBackground} />
      </div>

      <div
        className={`absolute w-full h-full ${cardFace === 3 ? "" : "hidden"} ${
          isFlipping ? "flip-card" : ""
        }`}
      >
        <PokemonCardEvolution
          pokemon={pokemon}
          cardBackground={cardBackground}
        />
      </div>

      <div className="absolute top-2 right-2 z-10">
        <FavoriteButton
          isFavorite={isFavorite}
          toggleFavorite={(e) => {
            e.stopPropagation();
            toggleFavorite(pokemon);
          }}
        />
      </div>

      <CardIndicator currentFace={cardFace} />
    </div>
  );
}

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
    evolutionStages: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        japaneseName: PropTypes.string.isRequired,
        imageUrl: PropTypes.string,
        isCurrent: PropTypes.bool.isRequired,
      })
    ),
  }).isRequired,
  toggleFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  initialCardFace: PropTypes.number,
};
