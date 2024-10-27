import PropTypes from "prop-types";
import { FaArrowDown } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function PokemonCardEvolution({ pokemon, cardBackground }) {
  const [evolutionStages, setEvolutionStages] = useState([]);

  useEffect(() => {
    if (pokemon.evolutionChain) {
      const stages = getEvolutionStages(pokemon.evolutionChain, pokemon.name);
      setEvolutionStages(stages);
    }
  }, [pokemon]);

  const getEvolutionStages = (chain, currentPokemonName) => {
    const stages = [];
    let currentStage = chain;

    while (currentStage) {
      stages.push({
        name: currentStage.species.name,
        japaneseName: currentStage.species.japaneseName,
        imageUrl: currentStage.species.imageUrl,
        isCurrent:
          currentStage.species.name.toLowerCase() ===
          currentPokemonName.toLowerCase(),
      });
      currentStage = currentStage.evolves_to[0];
    }

    return stages;
  };

  return (
    <div
      className="w-full h-full flex flex-col p-2 rounded-xl overflow-y-auto"
      style={{ background: cardBackground }}
    >
      <h2 className="text-xl font-bold mb-2">進化チェーン</h2>
      <div className="flex flex-col items-center justify-start flex-grow -space-y-4">
        {Array.isArray(evolutionStages) && evolutionStages.length > 0 ? (
          evolutionStages.map((stage, index) => (
            <div
              key={stage.name}
              className="w-full flex flex-col items-center relative"
            >
              <div className="w-full flex items-center justify-center p-2 rounded-lg transition-all duration-300">
                <div className="relative">
                  {stage.imageUrl && (
                    <img
                      src={stage.imageUrl}
                      alt={stage.name}
                      className="w-24 h-24 transition-all duration-300 hover:scale-150"
                    />
                  )}
                </div>
                <div
                  className={`ml-2 px-3 py-1 rounded-full transition-all duration-300 ${
                    stage.isCurrent
                      ? "bg-sky-100 bg-opacity-50 border-2 border-sky-500 shadow-sm"
                      : ""
                  }`}
                >
                  <span
                    className={`text-sm font-semibold ${
                      stage.isCurrent ? "text-sky-700" : "text-gray-700"
                    }`}
                  >
                    {stage.japaneseName}
                  </span>
                </div>
              </div>
              {index < evolutionStages.length - 1 && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-green-500 bg-white rounded-full p-1 z-20 shadow-md">
                  <FaArrowDown size={16} />
                </div>
              )}
            </div>
          ))
        ) : (
          <p>進化情報がありません</p>
        )}
      </div>
    </div>
  );
}

PokemonCardEvolution.propTypes = {
  pokemon: PropTypes.shape({
    evolutionStages: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        japaneseName: PropTypes.string.isRequired,
        imageUrl: PropTypes.string,
        isCurrent: PropTypes.bool.isRequired,
      })
    ),
  }).isRequired,
  cardBackground: PropTypes.string.isRequired,
};
