import { useState } from "react";
import logo from "../assets/icones/logo 3.jpg";

export default function Logo() {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleMouseLeave = () => setHovered(false);
  const handleClick = () => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 5000); // Adjust the duration as needed
  };

  return (
    <div
      className={`flex p-8 w-64 h-[50px] text-center  fixed bottom-2 bg-gray-800 rounded-lg left-2 z-20 shadow-md items-center justify-center cursor-pointer transition-transform duration-300 ${
        hovered ? "hover:scale-105" : ""
      }`}
      // onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {clicked && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="text-center">
            <img
              src={logo}
              alt="logo_BMS"
              className="w-64 h-64 rounded-full bg-white shadow-md transition-transform duration-300"
            />
            <h1 className="text-white text-4xl font-bold mt-4">
              Digi-Doc solutions
            </h1>
            <p className="text-white text-lg mt-2">
              Tous droits réservés 2024-2025
            </p>
          </div>
        </div>
      )}
      {!clicked && (
        <div className="flex items-center justify-center gap-2 align-middle w-full h-full">
          <img
            src={logo}
            alt="logo_BMS"
            className="w-12 h-12 rounded-full bg-white shadow-md"
          />
          <h1 className="text-white text-2x font-bold">Digi Doc solution</h1>
        </div>
      )}
    </div>
  );
}
