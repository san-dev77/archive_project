import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Grid,
  Landmark,
  ArchiveRestore,
  TicketCheck,
  BookMarked,
  Home,
  Layers3,
  Settings,
} from "lucide-react";
import "daisyui/dist/full.css";

const SideBar_agence = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      <div className="sticky top-28 ml-2 h-[70vh] overflow-y-auto overflow-x-hidden scrollbar-state rounded-lg z-20 bg-gradient-to-b from-gray-500 to-gray-800 shadow-lg flex flex-col justify-between items-center px-2 py-2 w-64">
        <div className="flex flex-col items-center space-y-4 w-full">
          <div
            className="cursor-pointer p-2 rounded-full bg-gray-800 hover:bg-gray-600 transition-colors duration-300"
            onClick={() => handleNavigate("/app-archive")}
          >
            <LayoutDashboard
              color="white"
              size="24px"
              className="transition-transform duration-300 ease-in-out transform hover:scale-110"
            />
          </div>
          <div className="divider "></div>
          <div
            className="fixed top-[21%] left-[16%] cursor-pointer p-2 rounded-full bg-gray-900 hover:bg-gray-600 transition-colors duration-300"
            onClick={() => handleNavigate("/agences")}
          >
            <Home size={20} color="white" />
          </div>

          <ul className="menu p-0 w-full">
            <li className="w-full">
              <div
                onClick={() => handleNavigate("/agence_page")}
                className="flex w-full items-center justify-between text-white hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center">
                  <Landmark color="white" size="24px" />
                  <span className="text-sm ml-2">Agences</span>
                </div>
              </div>
            </li>
            <li className="w-full">
              <div
                onClick={() => handleNavigate("/agence/document-type")}
                className="flex w-full items-center justify-between text-white hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center">
                  <Layers3 color="white" size="24px" />
                  <span className="text-sm ml-2">Types de documents</span>
                </div>
              </div>
            </li>
            <li className="w-full">
              <div
                onClick={() => handleNavigate("/caisse")}
                className="flex w-full items-center text-white hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                <ArchiveRestore color="white" size="24px" />
                <span className="text-sm ml-2">Caisses</span>
              </div>
            </li>
            <li className="w-full">
              <div
                onClick={() => handleNavigate("/agence_createPiece")}
                className="flex w-full items-center text-white hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                <Grid color="white" size="24px" />
                <span className="text-sm ml-2">Pièces</span>
              </div>
            </li>
            <li className="w-full">
              <div
                onClick={() => handleNavigate("/guichet")}
                className="flex w-full items-center text-white hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                <TicketCheck color="white" size="24px" />
                <span className="text-sm ml-2">Guichets</span>
              </div>
            </li>
            <li className="w-full">
              <div
                onClick={() => handleNavigate("/dossier")}
                className="flex w-full items-center text-white hover:text-yellow-300 transition-colors duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                <BookMarked color="white" size="24px" />
                <span className="text-sm ml-2">Dossiers</span>
              </div>
            </li>
          </ul>
          <div className="divider"></div>
        </div>
      </div>
    </>
  );
};

export default SideBar_agence;
