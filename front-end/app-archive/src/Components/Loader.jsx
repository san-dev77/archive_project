import "./Loader.css";
import { useEffect, useState } from "react";

export default function Loader_component() {
  const [tip, setTip] = useState("");

  const tips = [
    "Astuce : Utilisez des mots-clés spécifiques pour affiner votre recherche.",
    "Saviez-vous ? Vous pouvez filtrer les résultats par date.",
    "Conseil : Vérifiez l'orthographe de vos mots-clés.",
    "Astuce : Essayez d'utiliser des synonymes pour obtenir plus de résultats.",
  ];

  useEffect(() => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setTip(randomTip);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>

        <div className="space-y-4">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full animate-pulse"></div>
          </div>

          <h2 className="text-white font-bold text-2xl text-center">
            Chargement...
          </h2>

          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-300 text-sm text-center italic">{tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
