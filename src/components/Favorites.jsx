import { useContext, useState, useCallback, useEffect } from "react";
import { FavoritesContext } from "./FavoritesContext.jsx";
import Header from "./Header";
import SideMenu from "./SideMenu";
import PokemonCard from "./PokemonCard";
import { isFavorite } from "./FavoriteReducer";
import { useTypeFiltering } from "../hooks/useTypeFiltering";
import { useTypeContext } from "../hooks/useTypeContext";

export default function Favorites() {
  const { favorites, dispatch } = useContext(FavoritesContext);
  const [pokemons, setPokemons] = useState([]);
  const { selectedTypes } = useTypeContext();

  useEffect(() => {
    const fetchFavoritePokemons = async () => {
      const favoritePokemons = await Promise.all(
        favorites.map(async (favorite) => {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${favorite.name}`
          );
          const data = await response.json();
          return {
            name: data.species.name,
            url: data.species.url,
            types: data.types.map((type) => type.type.name),
            japaneseName: favorite.japaneseName,
          };
        })
      );
      setPokemons(favoritePokemons);
    };

    fetchFavoritePokemons();
  }, [favorites]);

  const { filteredPokemons } = useTypeFiltering(pokemons, selectedTypes);

  const checkIsFavorite = useCallback(
    (pokemon) => {
      return isFavorite(favorites, pokemon);
    },
    [favorites]
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r lg:block">
          <SideMenu />
        </aside>
        <main className="flex-1 p-6">
          <div className="p-5">
            <h2 className="text-2xl font-bold mb-4">お気に入りリスト</h2>
            <div className="grid grid-cols-3 gap-4">
              {filteredPokemons.map((pokemon, index) => (
                <PokemonCard
                  key={`${pokemon.name}-${index}`}
                  pokemon={pokemon}
                  isFavorite={checkIsFavorite(pokemon)}
                  toggleFavorite={() => {
                    dispatch({ type: "TOGGLE_FAVORITE", payload: pokemon });
                  }}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
