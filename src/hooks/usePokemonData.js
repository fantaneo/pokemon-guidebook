import { useInfiniteQuery } from "react-query";
import { useState, useEffect } from "react";

const CACHE_KEY = "pokemonCache";
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24時間

const fetchPokemons = async ({ pageParam = 0 }) => {
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_EXPIRY) {
      const allCachedPokemons = data.flatMap((page) => page.results);
      const start = pageParam;
      const end = start + 10;
      const paginatedPokemons = allCachedPokemons.slice(start, end);
      if (paginatedPokemons.length > 0) {
        return {
          results: paginatedPokemons,
          nextOffset: end,
          count: allCachedPokemons.length,
        };
      }
    }
  }
  return fetchFromAPI(pageParam);
};

const fetchFromAPI = async (pageParam) => {
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
    onSuccess: (data) => {
      const allPokemons = data.pages.flatMap((page) => page.results);
      const uniquePokemons = allPokemons.filter(
        (pokemon, index, self) =>
          index === self.findIndex((t) => t.name === pokemon.name)
      );
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: [
            {
              results: uniquePokemons,
              nextOffset: uniquePokemons.length,
              count: uniquePokemons.length,
            },
          ],
          timestamp: Date.now(),
        })
      );
    },
  });

  useEffect(() => {
    const storedNameMap = localStorage.getItem("pokemonNameMap");
    if (storedNameMap) {
      setNameMap(JSON.parse(storedNameMap));
    }
  }, []);

  const data = query.data
    ? {
        ...query.data,
        pages: query.data.pages.map((page) => ({
          ...page,
          results: page.results.map((pokemon) => ({
            ...pokemon,
            japaneseName: nameMap[pokemon.name] || pokemon.japaneseName,
          })),
        })),
      }
    : undefined;

  return { ...query, data };
}
