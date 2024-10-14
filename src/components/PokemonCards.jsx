import { useEffect, useState } from "react";
import PokemonCard from "./PokemonCard";
import { isFavorite } from "./FavoriteReducer";
import Header from "./Header";
import SideMenu from "./SideMenu";
import { FavoritesContext } from "./FavoritesContext.jsx";
import { useContext } from "react";

export default function PokemonCards() {
  const [pokemons, setPokemons] = useState([]);
  const { favorites, dispatch } = useContext(FavoritesContext);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then((res) => res.json())
      .then((data) => {
        setPokemons(data.results);
      })
      .catch((error) =>
        console.error("Error fetching initial pokemon data:", error)
      );
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r lg:block">
          <SideMenu />
        </aside>
        <main className="flex-1 p-6">
          <div className="p-5">
            <div className="grid grid-cols-3 gap-4">
              {pokemons.map((pokemon, index) => (
                <PokemonCard
                  key={index}
                  pokemon={pokemon}
                  isFavorite={() => isFavorite(favorites, pokemon)}
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
