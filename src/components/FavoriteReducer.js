export const initialState = [];

export const isFavorite = (favorites, pokemon) => {
  return favorites.some((fav) => fav.name === pokemon.name);
};

export const favoritesReducer = (favorites, action) => {
  switch (action.type) {
    case "ADD_FAVORITE":
      return isFavorite(favorites, action.payload)
        ? favorites
        : [...favorites, action.payload];
    case "TOGGLE_FAVORITE":
      return isFavorite(favorites, action.payload)
        ? favorites.filter((fav) => fav.name !== action.payload.name)
        : [...favorites, action.payload];
    default:
      return favorites;
  }
};
