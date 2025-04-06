import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import "daisyui/dist/full.css";
import UserBadge from "./UserBadge";
import { useState } from "react";
import SpeedMenuBtn from "./SpeedMenuBtn";

const TopBar = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("permissions");
    localStorage.removeItem("profilName");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("id_user");
    localStorage.removeItem("role");
    localStorage.removeItem("service");
    localStorage.removeItem("serviceId");
    navigate("/");
  };

  return (
    <>
      <div>
        <div className="fixed right-0 top-0 navbar bg-gray-100 w-[100% - 16rem] z-[10] shadow-md px-4 py-3">
          <div className="flex justify-between items-center w-full">
            {/* Navigation buttons section */}
            <div className="ml-64 flex items-center gap-3">
              <button
                onClick={() => navigate("/stats")}
                className="btn btn-outline btn-md text-black hover:bg-gray-200 hover:text-blue-600 transition-all duration-200 shadow-sm flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3v18h18" />
                  <path d="M18 17V9" />
                  <path d="M13 17V5" />
                  <path d="M8 17v-3" />
                </svg>
                Statistiques
              </button>

              <button
                onClick={() => navigate("/reports")}
                className="btn btn-outline btn-md text-black hover:bg-gray-200 hover:text-blue-600 transition-all duration-200 shadow-sm flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
                Rapports
              </button>
            </div>

            {/* User section */}
            <div className="flex items-center gap-4">
              <UserBadge path="/profile" />
              <button
                onClick={() => setShowLogoutModal(true)}
                className="btn btn-outline btn-md text-black hover:bg-white hover:text-blue-400 transition-all duration-200 shadow-sm flex items-center gap-2"
              >
                <LogOut size={18} />
                Deconnexion
              </button>
              <SpeedMenuBtn />
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

export default TopBar;
