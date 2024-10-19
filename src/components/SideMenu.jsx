import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "react-router-dom";
import { POKEMON_TYPES } from "../constants/pokemonTypes";
import { useTypeContext } from "../hooks/useTypeContext";
import SearchBar from "./SearchBar";
import { FaHome, FaHeart, FaSearch } from "react-icons/fa";
import { MdChevronRight } from "react-icons/md";
import { useStatsFilterContext } from "../contexts/StatsFilterContext";
import { CustomSlider } from "../components/ui/custom-slider";
import { Button } from "@/components/ui/button";
import { FaUndo } from "react-icons/fa";

export default function SideMenu() {
  const location = useLocation();
  const { selectedTypes, handleTypeSelect } = useTypeContext();
  const { statsFilter, updateStatFilter, resetStatsFilter } =
    useStatsFilterContext();
  const menuItems = [
    { name: "ホーム", href: "/pokemons", icon: <FaHome /> },
    { name: "お気に入り", href: "/favorites", icon: <FaHeart /> },
  ];

  const statNames = {
    hp: "HP",
    attack: "こうげき",
    defense: "ぼうぎょ",
    specialAttack: "とくこう",
    specialDefense: "とくぼう",
    speed: "すばやさ",
  };

  const handleStatFilterChange = (statName, value) => {
    updateStatFilter(statName, value);
  };

  return (
    <ScrollArea className="h-full py-6 px-4">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">メニュー</h2>
      <nav className="space-y-2 mb-8">
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
      <h2 className="mb-4 text-lg font-semibold text-gray-800 flex items-center">
        <FaSearch className="mr-2" />
        検索
      </h2>
      <SearchBar />
      <h2 className="mt-8 mb-4 text-lg font-semibold text-gray-800">タイプ</h2>
      <div className="flex flex-wrap gap-2 mb-8">
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">能力値</h2>
        <Button
          onClick={resetStatsFilter}
          className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <FaUndo className="mr-2 text-gray-500" />
          リセット
        </Button>
      </div>
      <div className="space-y-12">
        {Object.entries(statNames).map(([key, name]) => (
          <div key={key}>
            <h3 className="text-base font-bold text-gray-800 mb-3">
              {name}
              <span className="ml-2 text-sm font-normal text-gray-600">
                {statsFilter[key]} 以上
              </span>
            </h3>
            <CustomSlider
              min={0}
              max={150}
              step={1}
              value={[statsFilter[key]]}
              onValueChange={(value) => updateStatFilter(key, value[0])}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
