import { useState } from "react";
import Header from "./Header";
import SideMenu from "./SideMenu";
import SearchBar from "./SearchBar";
import PokemonList from "./PokemonList";
import { usePokemonData } from "../hooks/usePokemonData";

export default function PokemonCards() {
  const [filterText, setFilterText] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    usePokemonData();

  const handleTypeSelect = (type) => {
    setSelectedTypes((prevTypes) =>
      prevTypes.includes(type)
        ? prevTypes.filter((t) => t !== type)
        : [...prevTypes, type]
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r lg:block">
          <SideMenu
            selectedTypes={selectedTypes}
            onTypeSelect={handleTypeSelect}
          />
        </aside>
        <main className="flex-1 p-6">
          <div className="p-5">
            <SearchBar filterText={filterText} setFilterText={setFilterText} />
            <PokemonList
              data={data}
              filterText={filterText}
              selectedTypes={selectedTypes}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              status={status}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
