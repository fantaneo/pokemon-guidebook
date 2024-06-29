export const initialState = {
  favorites: [],
};

export const isFavorite = (state, pokemon) => {
  return state.favorites.some((fav) => fav.name === pokemon.name);
};

export const favoritesReducer = (state, action) => {
  switch (action.type) {
    case "ADD_FAVORITE":
      return { ...state, favorites: [...state.favorites, action.payload] };
    case "TOGGLE_FAVORITE":
      return {
        ...state,
        favorites: isFavorite(state, action.payload)
          ? state.favorites.filter((fav) => fav.name !== action.payload.name)
          : [...state.favorites, action.payload],
      };
    default:
      return state;
  }
};
