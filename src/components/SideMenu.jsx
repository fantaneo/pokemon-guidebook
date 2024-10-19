import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "react-router-dom";
import { POKEMON_TYPES } from "../constants/pokemonTypes";
import { useTypeContext } from "../hooks/useTypeContext";
import SearchBar from "./SearchBar";
import { FaHome, FaHeart, FaSearch } from "react-icons/fa";
import { MdChevronRight } from "react-icons/md";
import { useStatsFilterContext } from "../contexts/StatsFilterContext";
import { CustomSlider } from "../components/ui/custom-slider";

export default function SideMenu() {
  const location = useLocation();
  const { selectedTypes, handleTypeSelect } = useTypeContext();
  const { attackFilter, setAttackFilter } = useStatsFilterContext();
  const menuItems = [
    { name: "ホーム", href: "/pokemons", icon: <FaHome /> },
    { name: "お気に入り", href: "/favorites", icon: <FaHeart /> },
  ];

  return (
    <ScrollArea className="h-full py-6 px-4">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">メニュー</h2>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
              location.pathname === item.href
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-blue-50"
            }`}
          >
            <span className="flex items-center space-x-3">
              {item.icon}
              <span>{item.name}</span>
            </span>
            <MdChevronRight className="text-lg" />
          </Link>
        ))}
      </nav>
      <h2 className="mt-8 mb-4 text-lg font-semibold text-gray-800 flex items-center">
        <FaSearch className="mr-2" />
        検索
      </h2>
      <SearchBar />
      <h2 className="mt-8 mb-4 text-lg font-semibold text-gray-800">タイプ</h2>
      <div className="flex flex-wrap gap-2">
        {POKEMON_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => handleTypeSelect(type)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedTypes.includes(type)
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-blue-100"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      <h2 className="mt-8 mb-4 text-lg font-semibold text-gray-800">
        こうげき {attackFilter} 以上
      </h2>
      <div className="flex flex-col space-y-2">
        <CustomSlider
          min={0}
          max={150}
          step={1}
          value={[attackFilter]}
          onValueChange={(value) => setAttackFilter(value[0])}
        />
      </div>
    </ScrollArea>
  );
}
