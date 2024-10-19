import { useSearchContext } from "../contexts/SearchContext";

export default function SearchBar() {
  const { filterText, setFilterText } = useSearchContext();

  return (
    <input
      type="text"
      placeholder="ポケモンを検索..."
      value={filterText}
      onChange={(e) => setFilterText(e.target.value)}
      className="mb-4 w-full p-2 border rounded"
    />
  );
}
