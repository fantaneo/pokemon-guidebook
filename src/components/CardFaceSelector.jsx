import React from "react";

const CardFaceSelector = ({ setCardFace, triggerAnimation }) => {
  const handleFaceChange = (face) => {
    setCardFace(face);
    triggerAnimation();
  };

  const cardLabels = ["トップ", "能力", "詳細", "進化"];

  return (
    <div className="fixed bottom-4 right-4 flex space-x-2 z-50">
      {cardLabels.map((label, index) => (
        <button
          key={index}
          onClick={() => handleFaceChange(index)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                     text-white font-bold py-2 px-4 rounded-md shadow-lg 
                     transition duration-300 ease-in-out transform hover:scale-105 
                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default CardFaceSelector;
