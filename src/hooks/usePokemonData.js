import { useInfiniteQuery } from "react-query";
import { useState, useEffect, useMemo, useCallback } from "react";

const CACHE_KEY = "pokemonCache";
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24時間
const TOTAL_POKEMONS = 151;
const POKEMONS_PER_PAGE = 10;

const fetchAllPokemons = async () => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMONS}`
  );
  const data = await response.json();
  const detailedData = await Promise.all(
    data.results.map(async (pokemon) => {
      const detailResponse = await fetch(pokemon.url);
      const detailData = await detailResponse.json();
      return {
        id: detailData.id,
        name: detailData.name,
        types: detailData.types.map((type) => type.type.name),
        japaneseName: await fetchJapaneseName(detailData.species.url),
        stats: detailData.stats.map((stat) => ({
          name: stat.stat.name,
          value: stat.base_stat,
        })),
        height: detailData.height,
        weight: detailData.weight,
        abilities: detailData.abilities.map((ability) => ability.ability.name),
        sprites: {
          front_default: detailData.sprites.front_default,
          back_default: detailData.sprites.back_default,
        },
      };
    })
  );
  return detailedData;
};

const fetchJapaneseName = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.names.find((name) => name.language.name === "ja")?.name || "";
};

export function usePokemonData() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const checkCachedData = useCallback(() => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        setIsInitialLoad(false);
        return true;
      }
    }
    return false;
  }, []);

  useEffect(() => {
    checkCachedData();
  }, [checkCachedData]);

  const fetchPokemonsWithCache = useCallback(
    async ({ pageParam = 0 }) => {
      if (checkCachedData()) {
        const { data } = JSON.parse(localStorage.getItem(CACHE_KEY));
        const start = pageParam * POKEMONS_PER_PAGE;
        const end = start + POKEMONS_PER_PAGE;
        return {
          results: data.slice(start, end),
          nextOffset: end < data.length ? pageParam + 1 : undefined,
          count: data.length,
        };
      }

      // キャッシュが存在しないか期限切れの場合のみ、全ポケモンデータを取得
      const allPokemons = await fetchAllPokemons();
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: allPokemons,
          timestamp: Date.now(),
        })
      );

      const start = pageParam * POKEMONS_PER_PAGE;
      const end = start + POKEMONS_PER_PAGE;
      return {
        results: allPokemons.slice(start, end),
        nextOffset: end < allPokemons.length ? pageParam + 1 : undefined,
        count: allPokemons.length,
      };
    },
    [checkCachedData]
  );

  const query = useInfiniteQuery("pokemons", fetchPokemonsWithCache, {
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    onSuccess: () => {
      setIsInitialLoad(false);
    },
    staleTime: CACHE_EXPIRY,
    cacheTime: CACHE_EXPIRY,
  });

  const data = useMemo(
    () =>
      query.data
        ? {
            ...query.data,
            pages: query.data.pages.map((page) => ({
              ...page,
              results: page.results,
            })),
          }
        : undefined,
    [query.data]
  );

  return { ...query, data, isInitialLoad };
}
