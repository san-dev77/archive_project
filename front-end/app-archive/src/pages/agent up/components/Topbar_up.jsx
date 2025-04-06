import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import "daisyui/dist/full.css";
import UserBadge from "../../../Components/UserBadge";
import { useState } from "react";
import SpeedMenuBtn from "../../../Components/SpeedMenuBtn";

const TopBar_up = ({ position, title }) => {
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
    navigate("/");
  };

  return (
    <>
      <div>
        <div
          className={`fixed right-0 top-0 navbar  bg-gray-100 w-[100% - 16rem] z-[10] shadow-md px-4 py-3`}
        >
          <div className="flex justify-between items-center w-full">
            <div className="ml-64 flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            </div>

            <div className="flex items-center gap-4">
              <UserBadge path="/profil_up" />
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

export default TopBar_up;
