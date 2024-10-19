import { useState, useMemo } from "react";
import Header from "./Header";
import SideMenu from "./SideMenu";
import PokemonList from "./PokemonList";
import { usePokemonData } from "../hooks/usePokemonData";
import { useTypeFiltering } from "../hooks/useTypeFiltering";
import { useTypeContext } from "../hooks/useTypeContext";
import { useSearchContext } from "../contexts/SearchContext";
import PokemonTitle from "./PokemonTitle";
import Layout from "./Layout";

export default function PokemonCards() {
  const { filterText } = useSearchContext();
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
    <Layout>
      <div className="p-5">
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
    </Layout>
  );
}
