import { useEffect, useReducer, useState } from "react";
import PokemonCard from "./PokemonCard";
import FavoritesList from "./FavoritesList";
import { favoritesReducer, initialState, isFavorite } from "./FavoriteReducer";
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom";

export default function PokemonCards() {
  const [pokemons, setPokemons] = useState([]);
  const [favorites, dispatch] = useReducer(favoritesReducer, initialState);
  const [open, setOpen] = useState(false)

  const menuItems = [
    { name: "ポケモン", href: "/pokemons" },
    { name: "お気に入り", href: "/favorites" },
  ]

  const SideMenu = () => (
    <ScrollArea className="h-full py-6 pl-6 pr-6">
      <h2 className="mb-4 text-lg font-semibold">メニュー</h2>
      <nav className="flex flex-col space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </ScrollArea>
  )

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=10")
      .then((res) => res.json())
      .then((data) => {
        setPokemons(data.results);
      })
      .catch((error) =>
        console.error("Error fetching initial pokemon data:", error)
      );
  }, []);

  useEffect(() => {
    const _favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    _favorites.forEach((pokemon) =>
      dispatch({ type: "ADD_FAVORITE", payload: pokemon })
    );
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center border-b px-4 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">メニューを開く</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b px-4 py-2">
                <h2 className="text-lg font-semibold">メニュー</h2>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-6 w-6" />
                    <span className="sr-only">メニューを閉じる</span>
                  </Button>
                </SheetTrigger>
              </div>
              <SideMenu />
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="ml-4 text-lg font-semibold">マイアプリ</h1>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r lg:block">
          <SideMenu />
        </aside>
        <main className="flex-1 p-6">
          <div className="p-5">
            <FavoritesList favorites={favorites} />
            <div className="grid grid-cols-3 gap-4">
              {pokemons.map((pokemon, index) => (
                <PokemonCard
                  key={index}
                  pokemon={pokemon}
                  isFavorite={() => isFavorite(favorites, pokemon)}
                  toggleFavorite={() =>
                    dispatch({ type: "TOGGLE_FAVORITE", payload: pokemon })
                  }
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
