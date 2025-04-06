import { useNavigate } from "react-router-dom";
import "daisyui/dist/full.css";
import Logo2 from "../../../Components/Logo2";
import UserBadge from "../../../Components/UserBadge";
import { ChartColumnBig, FileText, LogOut } from "lucide-react";
import { useState } from "react";

const TopBar_UI = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("permissions");
    localStorage.removeItem("profilName");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("role");
    localStorage.removeItem("service");
    localStorage.removeItem("serviceId");
    navigate("/login");
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-20">
        <div className="navbar bg-gray-100 shadow-md">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center w-full">
              <div className="flex-none">
                <Logo2 />
              </div>

              {/* <div className="flex-1 flex justify-center gap-6">
                <button
                  className="btn btn-outline btn-md text-black hover:bg-gray-200 hover:text-blue-600 transition-all duration-200 transform hover:scale-105 shadow-sm flex items-center gap-2"
                  onClick={() => navigate("/rapports_agents")}
                >
                  <FileText size={18} />
                  Rapports
                </button>

                <button
                  className="btn btn-outline btn-md text-black hover:bg-gray-200 hover:text-blue-600 transition-all duration-200 transform hover:scale-105 shadow-sm flex items-center gap-2"
                  onClick={() => navigate("/stats_agents")}
                >
                  <ChartColumnBig size={18} />
                  Statistiques
                </button>
              </div> */}

              <div className="flex-none flex items-center gap-6">
                <UserBadge path="/profile" />

                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="btn btn-outline btn-md text-black hover:bg-white hover:text-blue-400 transition-all duration-200 transform hover:scale-105 shadow-sm flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de déconnexion */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <LogOut className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Confirmation de déconnexion
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous
                reconnecter pour accéder à votre compte.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="btn btn-outline border-gray-300 hover:bg-gray-100 text-gray-700"
                >
                  Annuler
                </button>
                <button
                  onClick={handleLogout}
                  className="btn bg-red-600 hover:bg-red-700 text-white"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar_UI;
