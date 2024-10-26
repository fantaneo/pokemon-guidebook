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
import CardFaceSelector from "./CardFaceSelector";

export default function Favorites() {
  const { favorites, dispatch } = useContext(FavoritesContext);
  const { filterText } = useSearchContext();
  const { selectedTypes } = useTypeContext();
  const { statsFilter } = useStatsFilterContext();
  const [globalCardFace, setGlobalCardFace] = useState(0);
  const [triggerAnimation, setTriggerAnimation] = useState(false);

  const { filteredPokemons } = useTypeFiltering(favorites, selectedTypes);

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

  const handleTriggerAnimation = () => {
    setTriggerAnimation((prev) => !prev);
  };

  // ローディング状態を表すstate（必要に応じて）
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // お気に入りデータの読み込みが完了したらローディング状態を false に設定
    setIsLoading(false);
  }, [favorites]);

  if (isLoading) {
    return (
      <p className="text-center mt-8">お気に入りデータを読み込んでいます...</p>
    );
  }

  return (
    <Layout>
      <div className="p-5">
        {finalFilteredPokemons.length > 0 ? (
          <>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {finalFilteredPokemons.map((pokemon, index) => (
                  <div
                    key={`${pokemon.name}-${index}`}
                    className="w-full max-w-[256px]"
                  >
                    <PokemonCard
                      pokemon={pokemon}
                      isFavorite={checkIsFavorite(pokemon)}
                      toggleFavorite={() => {
                        dispatch({ type: "TOGGLE_FAVORITE", payload: pokemon });
                      }}
                      initialCardFace={globalCardFace}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="text-center mt-8">
            {filterText ||
            Object.values(statsFilter).some((value) => value > 0) ||
            selectedTypes.length > 0
              ? "該当するお気に入りポケモンが見つかりません"
              : "お気に入りのポケモンがありません"}
          </p>
        )}
        <CardFaceSelector
          setCardFace={setGlobalCardFace}
          triggerAnimation={handleTriggerAnimation}
        />
      </div>
    </Layout>
  );
}
