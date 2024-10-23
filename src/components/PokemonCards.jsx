import { useState, useMemo } from "react";
import Header from "./Header";
import SideMenu from "./SideMenu";
import PokemonList from "./PokemonList";
import { usePokemonData } from "../hooks/usePokemonData";
import { useTypeFiltering } from "../hooks/useTypeFiltering";
import { useTypeContext } from "../hooks/useTypeContext";
import { useSearchContext } from "../contexts/SearchContext";
import { useStatsFilterContext } from "../contexts/StatsFilterContext";
import PokemonTitle from "./PokemonTitle";
import Layout from "./Layout";
import CardFaceSelector from "./CardFaceSelector";

export default function PokemonCards() {
  const { filterText } = useSearchContext();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    usePokemonData();
  const { selectedTypes } = useTypeContext();
  const { statsFilter } = useStatsFilterContext();
  const [globalCardFace, setGlobalCardFace] = useState(0);
  const [triggerAnimation, setTriggerAnimation] = useState(false);

  const allPokemons = useMemo(() => {
    return data?.pages?.flatMap((page) => page.results) || [];
  }, [data]);

  const { filteredPokemons } = useTypeFiltering(allPokemons, selectedTypes);

  const finalFilteredPokemons = useMemo(() => {
    return filteredPokemons.filter((pokemon) => {
      const nameMatch =
        pokemon.name.toLowerCase().includes(filterText.toLowerCase()) ||
        (pokemon.japaneseName && pokemon.japaneseName.includes(filterText));

      const statsMatch = pokemon.stats.every((stat) => {
        const statName = stat.name || (stat.stat && stat.stat.name);
        if (!statName) return true;

        // ここでstatNameをstatsFilterのキーに変換
        let statKey = statName.replace("-", "").toLowerCase();
        if (statKey === "specialattack") statKey = "specialAttack";
        if (statKey === "specialdefense") statKey = "specialDefense";

        const statValue = stat.base_stat || stat.value;
        return statValue >= (statsFilter[statKey] || 0);
      });

      return nameMatch && statsMatch;
    });
  }, [filteredPokemons, filterText, statsFilter]);

  const handleTriggerAnimation = () => {
    setTriggerAnimation((prev) => !prev);
  };

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
          globalCardFace={globalCardFace}
          triggerAnimation={triggerAnimation}
        />
        <CardFaceSelector
          setCardFace={setGlobalCardFace}
          triggerAnimation={handleTriggerAnimation}
        />
      </div>
    </Layout>
  );
}
