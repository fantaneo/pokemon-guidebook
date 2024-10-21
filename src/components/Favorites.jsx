import React, {
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { FavoritesContext } from "./FavoritesContext";
import PokemonCard from "./PokemonCard";
import { isFavorite } from "./FavoriteReducer";
import { useTypeFiltering } from "../hooks/useTypeFiltering";
import { useTypeContext } from "../hooks/useTypeContext";
import { useSearchContext } from "../contexts/SearchContext";
import { useStatsFilterContext } from "../contexts/StatsFilterContext";
import Layout from "./Layout";

export default function Favorites() {
  const { favorites, dispatch } = useContext(FavoritesContext);
  const [pokemons, setPokemons] = useState([]);
  const { selectedTypes } = useTypeContext();
  const { filterText } = useSearchContext();
  const { statsFilter } = useStatsFilterContext();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setPokemons(storedFavorites);
  }, []);

  const { filteredPokemons } = useTypeFiltering(pokemons, selectedTypes);

  const finalFilteredPokemons = useMemo(() => {
    return filteredPokemons.filter((pokemon) => {
      const nameMatch =
        pokemon.name.toLowerCase().includes(filterText.toLowerCase()) ||
        (pokemon.japaneseName && pokemon.japaneseName.includes(filterText));

      const statsMatch = pokemon.stats.every((stat) => {
        const statName = stat.name || (stat.stat && stat.stat.name);
        if (!statName) return true;

        let statKey = statName.replace("-", "").toLowerCase();
        if (statKey === "specialattack") statKey = "specialAttack";
        if (statKey === "specialdefense") statKey = "specialDefense";

        const statValue = stat.base_stat || stat.value;
        return statValue >= (statsFilter[statKey] || 0);
      });

      return nameMatch && statsMatch;
    });
  }, [filteredPokemons, filterText, statsFilter]);

  const checkIsFavorite = useCallback(
    (pokemon) => {
      return isFavorite(favorites, pokemon);
    },
    [favorites]
  );

  return (
    <Layout>
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {finalFilteredPokemons.map((pokemon, index) => (
            <div key={`${pokemon.name}-${index}`} className="w-full">
              <PokemonCard
                pokemon={pokemon}
                isFavorite={checkIsFavorite(pokemon)}
                toggleFavorite={() => {
                  dispatch({ type: "TOGGLE_FAVORITE", payload: pokemon });
                }}
              />
            </div>
          ))}
        </div>
        {finalFilteredPokemons.length === 0 && (
          <p className="text-center mt-8">お気に入りのポケモンがありません</p>
        )}
      </div>
    </Layout>
  );
}
