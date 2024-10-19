import { useInfiniteQuery } from "react-query";
import { useState, useEffect } from "react";

const fetchPokemons = async ({ pageParam = 0 }) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${pageParam}`
  );
  const data = await response.json();
  const detailedData = await Promise.all(
    data.results.map(async (pokemon) => {
      try {
        const detailResponse = await fetch(pokemon.url);
        const detailData = await detailResponse.json();
        return {
          ...pokemon,
          types: detailData.types.map((type) => type.type.name),
          japaneseName: await fetchJapaneseName(detailData.species.url),
        };
      } catch (error) {
        console.error(`Error fetching details for ${pokemon.name}:`, error);
        return {
          ...pokemon,
          types: [],
          japaneseName: "",
        };
      }
    })
  );
  return { ...data, results: detailedData, nextOffset: pageParam + 10 };
};

const fetchJapaneseName = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.names.find((name) => name.language.name === "ja")?.name || "";
};

export function usePokemonData() {
  const [nameMap, setNameMap] = useState({});

  const query = useInfiniteQuery("pokemons", fetchPokemons, {
    getNextPageParam: (lastPage) => lastPage.nextOffset,
  });

  useEffect(() => {
    const storedNameMap = localStorage.getItem("pokemonNameMap");
    if (storedNameMap) {
      setNameMap(JSON.parse(storedNameMap));
    }
  }, []);

  // Merge Japanese names into the query data
  const data = {
    ...query.data,
    pages: query.data?.pages.map((page) => ({
      ...page,
      results: page.results.map((pokemon) => ({
        ...pokemon,
        japaneseName: nameMap[pokemon.name] || pokemon.japaneseName,
      })),
    })),
  };

  return { ...query, data };
}
