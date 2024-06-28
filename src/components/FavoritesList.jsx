import PropTypes from "prop-types";

export default function FavoritesList({ favorites }) {
  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">お気に入りリスト</h2>
      <div className="flex flex-wrap gap-4">
        <ul>
          {favorites.map((favorite) => (
            <li key={favorite.name}>{favorite.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

FavoritesList.propTypes = {
  favorites: PropTypes.arrayOf(PropTypes.object).isRequired,
};
