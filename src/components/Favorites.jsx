import { useContext, useState, useCallback } from "react";
import { FavoritesContext } from "./FavoritesContext.jsx";
import { useEffect } from "react";
import Header from "./Header";
import SideMenu from "./SideMenu";
import PokemonCard from "./PokemonCard";
import { isFavorite } from "./FavoriteReducer";

export default function Favorites() {
  const { favorites, dispatch } = useContext(FavoritesContext);
  const [pokemons, setPokemons] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    const favoritePokemons = favorites.map((favorite) => {
      return fetch(`https://pokeapi.co/api/v2/pokemon/${favorite.name}`).then(
        (res) => res.json()
      );
    });
    Promise.all(favoritePokemons).then((fpokemons) => {
      setPokemons(
        fpokemons.map((p) => {
          return {
            name: p.species.name,
            url: p.species.url,
          };
        })
      );
    });
  }, [favorites]);

  const handleTypeSelect = (type) => {
    setSelectedTypes((prevTypes) =>
      prevTypes.includes(type)
        ? prevTypes.filter((t) => t !== type)
        : [...prevTypes, type]
    );
  };

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
          <SideMenu
            selectedTypes={selectedTypes}
            onTypeSelect={handleTypeSelect}
          />
        </aside>
        <main className="flex-1 p-6">
          <div className="p-5">
            <h2 className="text-2xl font-bold mb-4">お気に入りリスト</h2>
            <div className="grid grid-cols-3 gap-4">
              {pokemons.map((pokemon, index) => (
                <PokemonCard
                  key={index}
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
