import React from "react";
import { FaStar } from "react-icons/fa";

const FavoriteButton = ({ isFavorite, toggleFavorite }) => {
  return (
    <button
      onClick={toggleFavorite}
      className="bg-white bg-opacity-50 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200 relative group"
    >
      {/* 外側の星（縁取り） - 濃い黄色 */}
      <FaStar
        className={`text-4xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-200 ${
          isFavorite ? "text-yellow-500" : "text-gray-300"
        }`}
      />
      {/* 内側の星（メインの色） - 薄い黄色 */}
      <FaStar
        className={`text-3xl relative z-10 transition-colors duration-200 ${
          isFavorite ? "text-yellow-300" : "text-white"
        }`}
      />
    </button>
  );
};

export default FavoriteButton;
