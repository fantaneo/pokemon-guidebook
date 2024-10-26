/* eslint-disable react/prop-types */
import { useRef, useCallback, useEffect, useMemo } from "react";
import PokemonCard from "./PokemonCard";
import { useContext } from "react";
import { FavoritesContext } from "./FavoritesContext.jsx";
import { isFavorite } from "./FavoriteReducer";
import { useStatsFilterContext } from "../contexts/StatsFilterContext";

export default function PokemonList({
  data,
  filterText,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  status,
  filteredPokemons,
  globalCardFace,
}) {
  const { favorites, dispatch } = useContext(FavoritesContext);
  const observer = useRef();
  const { attackFilter } = useStatsFilterContext();

  const checkIsFavorite = useCallback(
    (pokemon) => {
      return isFavorite(favorites, pokemon);
    },
    [favorites]
  );

  const lastPokemonElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    if (filteredPokemons.length < 20 && hasNextPage) {
      fetchNextPage();
    }
  }, [filteredPokemons, hasNextPage, fetchNextPage]);

  if (
    status === "idle" ||
    status === "loading" ||
    (status === "success" && filteredPokemons.length === 0 && !filterText)
  ) {
    return (
      <p className="text-center mt-8">ポケモンデータを読み込んでいます...</p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center mt-8">
        エラーが発生しました。再度お試しください。
      </p>
    );
  }

  if (filteredPokemons.length === 0 && status === "success") {
    return <p className="text-center mt-8">該当するポケモンが見つかりません</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-4">
        {filteredPokemons.map((pokemon, index) => (
          <div
            key={`${pokemon.name}-${index}`}
            ref={
              index === filteredPokemons.length - 1
                ? lastPokemonElementRef
                : null
            }
            className="w-full"
          >
            <PokemonCard
              pokemon={pokemon}
              isFavorite={checkIsFavorite(pokemon)}
              toggleFavorite={() => {
                dispatch({
                  type: "TOGGLE_FAVORITE",
                  payload: pokemon,
                });
              }}
              initialCardFace={globalCardFace}
            />
          </div>
        ))}
      </div>
      {isFetchingNextPage && (
        <p className="text-center mt-4">ポケモンをさらに読み込んでいます...</p>
      )}
      {!hasNextPage && filteredPokemons.length > 0 && (
        <p className="text-center mt-4">すべてのポケモンを読み込みました</p>
      )}
    </>
  );
}
