/* eslint-disable react/prop-types */
import { useRef, useCallback, useEffect, useMemo } from "react";
import PokemonCard from "./PokemonCard";
import { useContext } from "react";
import { FavoritesContext } from "./FavoritesContext.jsx";
import { isFavorite } from "./FavoriteReducer";
import { POKEMON_TYPE_MAPPING } from "../constants/pokemonTypeMapping";

export default function PokemonList({
  data,
  filterText,
  selectedTypes,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  status,
  filteredPokemons,
}) {
  const { favorites, dispatch } = useContext(FavoritesContext);
  const observer = useRef();

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

  const pokemonsToDisplay =
    filteredPokemons.length > 0
      ? filteredPokemons
      : data?.pages?.flatMap((page) => page.results) || [];

  // filterTextによるフィルタリングを適用
  const finalFilteredPokemons = pokemonsToDisplay.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(filterText.toLowerCase())
  );

  useEffect(() => {
    if (finalFilteredPokemons.length < 20 && hasNextPage) {
      fetchNextPage();
    }
  }, [finalFilteredPokemons, hasNextPage, fetchNextPage]);

  if (status === "loading") {
    return <p>ポケモンデータを読み込んでいます...</p>;
  }

  if (status === "error") {
    return <p>エラーが発生しました。再度お試しください。</p>;
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {finalFilteredPokemons.map((pokemon, index) => (
          <div
            key={pokemon.name}
            ref={
              index === finalFilteredPokemons.length - 1
                ? lastPokemonElementRef
                : null
            }
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
