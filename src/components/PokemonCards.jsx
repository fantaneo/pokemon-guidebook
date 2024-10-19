import { useRef, useCallback, useEffect, useState } from "react";
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

const fetchJapaneseName = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.names.find((name) => name.language.name === "ja").name;
};

export default function PokemonCards() {
  const { favorites, dispatch } = useContext(FavoritesContext);
  const observer = useRef();
  const [nameMap, setNameMap] = useState({});
  const [filterText, setFilterText] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery("pokemons", fetchPokemons, {
      getNextPageParam: (lastPage) => lastPage.nextOffset,
    });

  useEffect(() => {
    const storedNameMap = localStorage.getItem("pokemonNameMap");
    if (storedNameMap) {
      setNameMap(JSON.parse(storedNameMap));
    } else {
      fetchPokemons().then(async (pokemonList) => {
        const newNameMap = {};
        for (const pokemon of pokemonList) {
          const japaneseName = await fetchJapaneseName(pokemon.url);
          newNameMap[pokemon.name] = japaneseName;
        }
        setNameMap(newNameMap);
        localStorage.setItem("pokemonNameMap", JSON.stringify(newNameMap));
      });
    }
  }, []);

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

  const filteredPokemons =
    data?.pages.flatMap((page) =>
      page.results.filter(
        (pokemon) =>
          nameMap[pokemon.name]?.includes(filterText) ||
          pokemon.name.includes(filterText)
      )
    ) || [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r lg:block">
          <SideMenu />
        </aside>
        <main className="flex-1 p-6">
          <div className="p-5">
            <input
              type="text"
              placeholder="ポケモンを検索..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="mb-4 w-full p-2 border rounded"
            />
            <div className="grid grid-cols-3 gap-4">
              {status === "success" &&
                filteredPokemons.map((pokemon, index) => (
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
                      japaneseName={nameMap[pokemon.name]}
                      isFavorite={() => isFavorite(favorites, pokemon)}
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
            {!hasNextPage && <p>すべてのポケモンを読み込みました</p>}
          </div>
        </main>
      </div>
    </div>
  );
}
