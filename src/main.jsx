import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PokemonCards from "./components/PokemonCards.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/pokemons" element={<App />} />
        <Route path="/favorites" element={<PokemonCards />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
