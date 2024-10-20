import { useInfiniteQuery } from "react-query";
import { useState, useEffect, useMemo, useCallback } from "react";

const CACHE_KEY = "pokemonCache";
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24時間
const TOTAL_POKEMONS = 151;
const POKEMONS_PER_PAGE = 10;

const fetchPokemonDetails = async (speciesUrl) => {
  const response = await fetch(speciesUrl);
  const data = await response.json();

  const japaneseName =
    data.names.find((name) => name.language.name === "ja")?.name || "";

  const japaneseCategoryEntry = data.genera.find(
    (entry) => entry.language.name === "ja-Hrkt"
  );
  const category = japaneseCategoryEntry ? japaneseCategoryEntry.genus : "";

  const japaneseFlavorText =
    data.flavor_text_entries.find((entry) => entry.language.name === "ja")
      ?.flavor_text || "";

  // 進化チェーンの情報を取得
  const evolutionChainResponse = await fetch(data.evolution_chain.url);
  const evolutionChainData = await evolutionChainResponse.json();

  // 進化チェーンのデータ構造を整形
  const formatEvolutionChain = async (chain) => {
    const speciesResponse = await fetch(chain.species.url);
    const speciesData = await speciesResponse.json();

    return {
      species: {
        name: chain.species.name,
        japaneseName:
          speciesData.names.find((name) => name.language.name === "ja")?.name ||
          chain.species.name,
        imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
          chain.species.url.split("/").slice(-2, -1)[0]
        }.png`,
      },
      evolves_to: await Promise.all(
        (chain.evolves_to || []).map(formatEvolutionChain)
      ),
    };
  };

  const formattedEvolutionChain = await formatEvolutionChain(
    evolutionChainData.chain
  );

  return {
    japaneseName,
    category,
    description: japaneseFlavorText,
    evolutionChain: formattedEvolutionChain,
  };
};

const fetchAllPokemons = async () => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMONS}`
  );
  const data = await response.json();
  const detailedData = await Promise.all(
    data.results.map(async (pokemon) => {
      const detailResponse = await fetch(pokemon.url);
      const detailData = await detailResponse.json();
      const speciesDetails = await fetchPokemonDetails(detailData.species.url);

      return {
        id: detailData.id,
        name: detailData.name,
        url: pokemon.url,
        types: detailData.types.map((type) => type.type.name),
        japaneseName: speciesDetails.japaneseName,
        stats: detailData.stats.map((stat) => ({
          name: stat.stat.name,
          value: stat.base_stat,
        })),
        height: detailData.height,
        weight: detailData.weight,
        abilities: detailData.abilities.map((ability) => ({
          name: ability.ability.name,
          is_hidden: ability.is_hidden,
        })),
        sprites: {
          front_default: detailData.sprites.front_default,
          back_default: detailData.sprites.back_default,
        },
        category: speciesDetails.category,
        description: speciesDetails.description,
        evolutionChain: speciesDetails.evolutionChain,
      };
    })
  );
  return detailedData;
};

export function usePokemonData() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [cachedData, setCachedData] = useState(null);

  const checkCachedData = useCallback(() => {
    const storedData = localStorage.getItem(CACHE_KEY);
    if (storedData) {
      const { timestamp, data } = JSON.parse(storedData);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        console.log("キャッシュからポケモンデータを読み込みます。");
        setCachedData(data);
        setIsInitialLoad(false);
        return true;
      }
    }
    return false;
  }, []);

  useEffect(() => {
    const hasCachedData = checkCachedData();
    if (!hasCachedData) {
      console.log("全ポケモンの取得を開始します。");
      fetchAllPokemons().then((allPokemons) => {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: allPokemons,
            timestamp: Date.now(),
          })
        );
        setCachedData(allPokemons);
        setIsInitialLoad(false);
      });
    }
  }, [checkCachedData]);

  const fetchPokemonsWithCache = useCallback(
    ({ pageParam = 0 }) => {
      if (!cachedData) {
        return Promise.resolve({
          results: [],
          nextOffset: undefined,
          count: 0,
        });
      }
      const start = pageParam * POKEMONS_PER_PAGE;
      const end = start + POKEMONS_PER_PAGE;
      return Promise.resolve({
        results: cachedData.slice(start, end),
        nextOffset: end < cachedData.length ? pageParam + 1 : undefined,
        count: cachedData.length,
      });
    },
    [cachedData]
  );

  const query = useInfiniteQuery("pokemons", fetchPokemonsWithCache, {
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    enabled: !isInitialLoad,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const data = useMemo(() => {
    if (cachedData) {
      const pages = [];
      for (let i = 0; i < cachedData.length; i += POKEMONS_PER_PAGE) {
        pages.push({
          results: cachedData.slice(i, i + POKEMONS_PER_PAGE),
          nextOffset:
            i + POKEMONS_PER_PAGE < cachedData.length
              ? i / POKEMONS_PER_PAGE + 1
              : undefined,
          count: cachedData.length,
        });
      }
      return { pages };
    }
    return null;
  }, [cachedData]);

  return { ...query, data, isInitialLoad };
}
