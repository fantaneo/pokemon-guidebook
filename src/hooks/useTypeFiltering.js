import { useMemo } from "react";
import { POKEMON_TYPE_MAPPING } from "../constants/pokemonTypeMapping";

export function useTypeFiltering(pokemons, selectedTypes) {
  const filteredPokemons = useMemo(() => {
    return pokemons.filter((pokemon) => {
      const typeMatch =
        selectedTypes.length === 0 ||
        (Array.isArray(pokemon.types) &&
          pokemon.types.some((pokemonType) =>
            selectedTypes.some(
              (selectedType) =>
                POKEMON_TYPE_MAPPING[selectedType].toLowerCase() ===
                pokemonType.toLowerCase()
            )
          ));

      return typeMatch;
    });
  }, [pokemons, selectedTypes]);

  return { filteredPokemons };
}
