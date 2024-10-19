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

  const finalFilteredPokemons = useMemo(() => {
    return filteredPokemons.filter(
      (pokemon) =>
        (pokemon.name.toLowerCase().includes(filterText.toLowerCase()) ||
          (pokemon.japaneseName &&
            pokemon.japaneseName.includes(filterText))) &&
        pokemon.stats.find((stat) => stat.name === "attack").value >=
          attackFilter
    );
  }, [filteredPokemons, filterText, attackFilter]);

  if (status === "loading") {
    return <p>ポケモンデータを読み込んでいます...</p>;
  }

  if (status === "error") {
    return <p>エラーが発生しました。再度お試しください。</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-4">
        {finalFilteredPokemons.map((pokemon, index) => (
          <div
            key={`${pokemon.name}-${index}`}
            ref={
              index === finalFilteredPokemons.length - 1
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
            />
          </div>
        ))}
      </div>
      {isFetchingNextPage && <p>ポケモンをさらに読み込んでいます...</p>}
      {!hasNextPage && finalFilteredPokemons.length > 0 && (
        <p>すべてのポケモンを読み込みました</p>
      )}
      {finalFilteredPokemons.length === 0 && (
        <p>該当するポケモンが見つかりません</p>
      )}
    </>
  );
}
