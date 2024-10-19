// eslint-disable-next-line react/prop-types
export default function SearchBar({ filterText, setFilterText }) {
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
