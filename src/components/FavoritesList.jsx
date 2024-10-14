import PropTypes from "prop-types";

export default function FavoritesList({ favorites }) {
  return (
    <div className="flex flex-wrap gap-4">
      <ul>
        {favorites.map((favorite) => (
          <li key={favorite.name}>{favorite.name}</li>
        ))}
      </ul>
    </div>
  );
}

FavoritesList.propTypes = {
  favorites: PropTypes.arrayOf(PropTypes.object).isRequired,
};
