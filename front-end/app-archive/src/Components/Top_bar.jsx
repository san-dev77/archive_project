import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import "daisyui/dist/full.css";
import UserBadge from "./UserBadge";
import Logo2 from "../Components/Logo2";
import Swal from "sweetalert2"; // Import SweetAlert2

const TopBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez vous déconnecter !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6b7280",
      cancelButtonColor: "#000",
      confirmButtonText: "Oui, déconnectez-moi !",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("permissions");
        localStorage.removeItem("profilName");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("role");
        localStorage.removeItem("service");
        localStorage.removeItem("serviceId");
        navigate("/");
      }
    });
  };
  // const firstName = localStorage.getItem("firstName");

  return (
    <div>
      <div className="fixed right-0 top-0 navbar bg-gray-100 w-[80%] z-10 shadow-md flex justify-between items-center px-10 py-4">
        <Logo2 />
        <div className="text-black font-bold flex flex-col items-start">
          {/* <h3 className="text-2xl">👋 Ravi de vous revoir, {firstName} </h3> */}
        </div>
        <div className="flex items-center space-x-6">
          <UserBadge />
          <button
            onClick={handleLogout}
            className="btn btn-outline btn-md text-black hover:bg-white hover:text-blue-400 transition-transform duration-150 ease-in-out transform hover:scale-105 shadow-sm"
          >
            <LogOut className="mx-auto" />
            Deconnexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
