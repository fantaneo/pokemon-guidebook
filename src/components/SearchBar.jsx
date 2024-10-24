import { useSearchContext } from "../contexts/SearchContext";

export default function SearchBar() {
  const { filterText, setFilterText } = useSearchContext();

  const handleClear = () => {
    setFilterText("");
  };

  return (
    <div className="relative mb-4">
      <input
        type="text"
        placeholder="ポケモンを検索..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="w-full p-2 border rounded pr-10"
      />
      {filterText && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
        >
          ✗
        </button>
      )}
    </div>
  );
}
