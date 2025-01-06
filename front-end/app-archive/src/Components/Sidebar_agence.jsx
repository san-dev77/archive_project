import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Grid,
  Landmark,
  ArchiveRestore,
  TicketCheck,
  BookMarked,
  Layers3,
} from "lucide-react";
import "daisyui/dist/full.css";
import logo from "../assets/icones/logo 3.jpg";

const SideBar_agence = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      <div className="sticky top-0  h-screen overflow-y-auto overflow-x-hidden scrollbar-state  z-20 bg-gray-800 shadow-lg flex flex-col justify-between items-center px-2 py-2 w-64">
        <div className="flex flex-col  items-center overflow-x-hidden space-y-4 w-full overflow-y-auto max-h-[80vh]">
          {/* Le logo */}
          <div className="flex p-6 h-[50px] text-left w-full items-start justify-start ">
            <div className="flex items-center justify-normal w-full gap-2 align-middle h-full">
              <img
                src={logo}
                alt="logo_BMS"
                className="w-12 h-12 rounded-full bg-white shadow-md"
              />
              <h1 className="text-white text-2x font-bold">
                Digi Doc solution
              </h1>
            </div>
          </div>
          {/* Le logo */}

          <div className="divider "></div>
          {/* <div
            className="fixed top-[21%] left-[16%] cursor-pointer p-2 rounded-full bg-gray-900 hover:bg-gray-600 transition-colors duration-300"
            onClick={() => handleNavigate("/agences")}
          >
            <Home size={20} color="white" />
          </div> */}

          <ul className="menu p-0 w-full">
            <div
              className="cursor-pointer flex items-start justify-start text-white gap-1 w-full rounded-lg p-2 bg-gray-800 hover:bg-gray-600 transition-colors duration-300"
              onClick={() => handleNavigate("/app-archive")}
            >
              <LayoutDashboard
                color="white"
                size="24px"
                className="transition-transform duration-300 ease-in-out transform hover:scale-110"
              />
              <span className="text-sm ml-2">Dashboard</span>
            </div>
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
