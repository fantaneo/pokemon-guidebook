import { useRef, useCallback } from "react";
import { useInfiniteQuery } from "react-query";
import PokemonCard from "./PokemonCard";
import { isFavorite } from "./FavoriteReducer";
import Header from "./Header";
import SideMenu from "./SideMenu";
import { FavoritesContext } from "./FavoritesContext.jsx";
import { useContext } from "react";

const fetchPokemons = async ({ pageParam = 0 }) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${pageParam}`
  );
  const data = await response.json();
  return { ...data, nextOffset: pageParam + 10 };
};

export default function PokemonCards() {
  const { favorites, dispatch } = useContext(FavoritesContext);
  const observer = useRef();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery("pokemons", fetchPokemons, {
      getNextPageParam: (lastPage) => lastPage.nextOffset,
    });

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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r lg:block">
          <SideMenu />
        </aside>
        <main className="flex-1 p-6">
          <div className="p-5">
            <div className="grid grid-cols-3 gap-4">
              {status === "success" &&
                data.pages.map((page) =>
                  page.results.map((pokemon, index) => (
                    <div
                      key={pokemon.name}
                      ref={
                        index === page.results.length - 1 &&
                        data.pages[data.pages.length - 1] === page
                          ? lastPokemonElementRef
                          : null
                      }
                    >
                      <PokemonCard
                        pokemon={pokemon}
                        isFavorite={() => isFavorite(favorites, pokemon)}
                        toggleFavorite={() => {
                          dispatch({
                            type: "TOGGLE_FAVORITE",
                            payload: pokemon,
                          });
                        }}
                      />
                    </div>
                  ))
                )}
            </div>
            {isFetchingNextPage && <p>Loading more Pokémon...</p>}
            {!hasNextPage && <p>No more Pokémon to load</p>}
          </div>
        </main>
      </div>
    </div>
  );
}
