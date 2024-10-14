import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PokemonCards from "./components/PokemonCards.jsx";
import Favorites from "./components/Favorites.jsx";
import { FavoritesProvider } from "./components/FavoritesContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FavoritesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PokemonCards />} />
          <Route path="/pokemons" element={<PokemonCards />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </Router>
    </FavoritesProvider>
  </React.StrictMode>
);
