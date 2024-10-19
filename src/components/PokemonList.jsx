/* eslint-disable react/prop-types */
import { useRef, useCallback } from "react";
import PokemonCard from "./PokemonCard";
import { useContext } from "react";
import { FavoritesContext } from "./FavoritesContext.jsx";
import { isFavorite } from "./FavoriteReducer";

export default function PokemonList({
  data,
  filterText,
  selectedTypes,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  status,
}) {
  const { favorites, dispatch } = useContext(FavoritesContext);
  const observer = useRef();

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

  const checkIsFavorite = useCallback(
    (pokemon) => {
      return isFavorite(favorites, pokemon);
    },
    [favorites]
  );

  const filteredPokemons = data?.pages
    ? data.pages.flatMap((page) =>
        page.results.filter(
          (pokemon) =>
            (pokemon.japaneseName?.includes(filterText) ||
              pokemon.name.includes(filterText)) &&
            (selectedTypes.length === 0 ||
              selectedTypes.every((type) => pokemon.types?.includes(type)))
        )
      )
    : [];

  if (status === "loading") {
    return <p>ポケモンデータを読み込んでいます...</p>;
  }

  if (status === "error") {
    return <p>エラーが発生しました。再度お試しください。</p>;
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {filteredPokemons.map((pokemon, index) => (
          <div
            key={pokemon.name}
            ref={
              index === filteredPokemons.length - 1
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
      {!hasNextPage && filteredPokemons.length > 0 && (
        <p>すべてのポケモンを読み込みました</p>
      )}
      {filteredPokemons.length === 0 && <p>該当するポケモンが見つかりません</p>}
    </>
  );
}
