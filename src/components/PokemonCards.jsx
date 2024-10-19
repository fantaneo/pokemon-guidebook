import { useState, useMemo } from "react";
import Header from "./Header";
import SideMenu from "./SideMenu";
import SearchBar from "./SearchBar";
import PokemonList from "./PokemonList";
import { usePokemonData } from "../hooks/usePokemonData";
import { useTypeFiltering } from "../hooks/useTypeFiltering";
import { useTypeContext } from "../hooks/useTypeContext";

export default function PokemonCards() {
  const [filterText, setFilterText] = useState("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    usePokemonData();
  const { selectedTypes } = useTypeContext();

  const allPokemons = useMemo(() => {
    return data?.pages?.flatMap((page) => page.results) || [];
  }, [data]);

  const { filteredPokemons } = useTypeFiltering(allPokemons, selectedTypes);

  const finalFilteredPokemons = useMemo(() => {
    return filteredPokemons.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(filterText.toLowerCase()) ||
        (pokemon.japaneseName && pokemon.japaneseName.includes(filterText))
    );
  }, [filteredPokemons, filterText]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r lg:block">
          <SideMenu />
        </aside>
        <main className="flex-1 p-6">
          <div className="p-5">
            <SearchBar filterText={filterText} setFilterText={setFilterText} />
            <PokemonList
              data={data}
              filterText={filterText}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              status={status}
              filteredPokemons={finalFilteredPokemons}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
