import React, { useState } from "react";

const CardFaceSelector = ({ setCardFace, triggerAnimation }) => {
  const [selectedFace, setSelectedFace] = useState(0);

  const handleFaceChange = (face) => {
    setSelectedFace(face);
    setCardFace(face);
    triggerAnimation();
  };

  const cardLabels = ["トップ", "能力", "詳細", "進化"];

  return (
    <div className="fixed bottom-4 right-4 flex items-end space-x-2 z-50">
      {cardLabels.map((label, index) => (
        <button
          key={index}
          onClick={() => handleFaceChange(index)}
          className={`bg-gradient-to-r font-bold py-2 px-4 rounded-md shadow-lg 
                     transition duration-300 ease-in-out
                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
                     ${
                       selectedFace === index
                         ? "from-blue-500 to-blue-600 text-white transform scale-110 z-10"
                         : "from-blue-400 to-blue-500 text-white opacity-90 hover:from-blue-500 hover:to-blue-600 hover:opacity-100"
                     }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default CardFaceSelector;
