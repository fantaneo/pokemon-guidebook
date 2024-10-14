import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PokemonCards from "./components/PokemonCards.jsx";
import Favorites from "./components/Favorites.jsx";
import { FavoritesProvider } from "./components/FavoritesContext.jsx";
import { QueryClient, QueryClientProvider } from "react-query"; // 追加

// QueryClient のインスタンスを作成
const queryClient = new QueryClient(); // 追加

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <Router>
          <Routes>
            <Route path="/" element={<PokemonCards />} />
            <Route path="/pokemons" element={<PokemonCards />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </Router>
      </FavoritesProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
