import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "react-router-dom";
import { POKEMON_TYPES } from "../constants/pokemonTypes";
import { MdArrowForwardIos } from "react-icons/md";
import { useTypeContext } from "../contexts/TypeContext";

// eslint-disable-next-line react/prop-types
export default function SideMenu() {
  const location = useLocation();
  const { selectedTypes: contextSelectedTypes, handleTypeSelect } =
    useTypeContext();
  const menuItems = [
    { name: "ポケモン", href: "/pokemons" },
    { name: "お気に入り", href: "/favorites" },
  ];

  return (
    <ScrollArea className="h-full py-6 pl-6 pr-6">
      <h2 className="mb-4 text-lg font-semibold">メニュー</h2>
      <nav className="flex flex-col space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground flex items-center justify-between ${
              location.pathname === item.href
                ? "bg-accent text-accent-foreground font-medium"
                : ""
            }`}
          >
            {item.name}
            {location.pathname === item.href && (
              <MdArrowForwardIos className="ml-2" />
            )}
          </Link>
        ))}
      </nav>
      <h2 className="mt-6 mb-4 text-lg font-semibold">タイプ</h2>
      <div className="flex flex-wrap gap-2">
        {POKEMON_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => handleTypeSelect(type)}
            className={`px-2 py-1 text-sm rounded ${
              contextSelectedTypes.includes(type)
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
