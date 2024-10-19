import { useInfiniteQuery } from "react-query";
import { useState, useEffect } from "react";

const CACHE_KEY = "pokemonCache";
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24時間
const TOTAL_POKEMONS = 151;

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
        ...pokemon,
        types: detailData.types.map((type) => type.type.name),
        japaneseName: await fetchJapaneseName(detailData.species.url),
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

const fetchPokemons = async ({ pageParam = 0 }) => {
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_EXPIRY) {
      const start = pageParam;
      const end = start + 10;
      return {
        results: data.slice(start, end),
        nextOffset: end < data.length ? end : undefined,
        count: data.length,
      };
    }
  }

  const allPokemons = await fetchAllPokemons();
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      data: allPokemons,
      timestamp: Date.now(),
    })
  );

  const start = pageParam;
  const end = start + 10;
  return {
    results: allPokemons.slice(start, end),
    nextOffset: end < allPokemons.length ? end : undefined,
    count: allPokemons.length,
  };
};

export function usePokemonData() {
  const query = useInfiniteQuery("pokemons", fetchPokemons, {
    getNextPageParam: (lastPage) => lastPage.nextOffset,
  });

  const data = query.data
    ? {
        ...query.data,
        pages: query.data.pages.map((page) => ({
          ...page,
          results: page.results,
        })),
      }
    : undefined;

  return { ...query, data };
}
