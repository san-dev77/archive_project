import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobeLock, KeyIcon, Lock, LogIn } from "lucide-react";
import Swal from "sweetalert2";
import logo from "../assets/icones/logo 3.jpg";
import bg from "../assets/bg/bg6.jpg";
import LoginErrorButton from "../Components/LoginError";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/agents/login", {
        login,
        password,
      });
      sessionStorage.setItem("token", response.data.token);
      console.log(response);
      const token = sessionStorage.getItem("token");
      if (token) {
        // Sauvegarder les permissions dans le local storage
        if (response.data.permissions) {
          const permissions = JSON.stringify(response.data.permissions);
          localStorage.setItem("permissions", permissions);
        }

        if (response.data.isAdmin) {
          localStorage.setItem("isAdmin", response.data.isAdmin);
        }

        if (response.data.profilName) {
          localStorage.setItem("profilName", response.data.profilName);
        }

        if (response.data.firstName) {
          localStorage.setItem("firstName", response.data.firstName);
        }

        if (response.data.lastName) {
          localStorage.setItem("lastName", response.data.lastName);
        }

        if (response.data.role) {
          localStorage.setItem("role", response.data.role);
        }

        if (response.data.service) {
          localStorage.setItem("service", response.data.service);
        }

        if (response.data.serviceId) {
          localStorage.setItem("serviceId", response.data.serviceId);
        }

        if (response.data.role) {
          Swal.fire({
            icon: "success",
            title: "Connexion réussie",
            text: "Bienvenue cher Administrateur !",
            confirmButtonText: "OK",
          });
          navigate("/app-archive");
        } else {
          Swal.fire({
            icon: "success",
            title: "Connexion réussie",
            text: "Bienvenue cher Agent !",
            confirmButtonText: "OK",
          });
          navigate("/agents");
        }
      } else {
        setError("Identifiants incorrects");
        Swal.fire({
          icon: "error",
          title: "Erreur de connexion",
          text: error,
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Erreur lors de la connexion";

      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: errorMessage,

        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="relative flex items-center bg-gray-400 justify-center min-h-screen ">
      <LoginErrorButton />
      <div className="flex w-full max-w-4xl  shadow-2xl rounded-xl transform transition duration-500 hover:scale-105">
        <div className="flex-1 bg-gray-300   p-7 rounded-l-xl">
          <h2 className="text-4xl font-extrabold text-center text-gray-800">
            <GlobeLock />
            Connecter-vous
          </h2>
          {error && <p className="text-center text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-12">
            <div>
              <label className="flex items-center justify-start text-sm font-medium text-gray-700">
                <KeyIcon className="w-4 h-4 mr-2" />
                Login
              </label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                required
              />
            </div>
            <div>
              <label className="flex items-center justify-start text-sm font-medium text-gray-700">
                <Lock className="w-4 h-4 mr-2" />
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 flex items-center justify-center text-lg font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-indigo-200 transition duration-300 ease-in-out transform hover:scale-105"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Se connecter
            </button>
          </form>
        </div>

        <div
          className="relative  flex-col text-white flex-1 p-10 w-full rounded-r-lg rounded-br-lg overflow-hidden flex items-center bg-center justify-center bg-cover"
          style={{ backgroundImage: `url(${bg})` }}
        >
          <div className="absolute flex flex-col items-center justify-center inset-0 bg-black opacity-50"></div>
          <img
            src={logo}
            alt="Logo"
            className="bg-white rounded-full w-24 h-24 transform transition duration-500 hover:scale-110 z-10"
          />
          <h3 className="text-2xl font-bold text-center  z-10">
            Bienvenue sur Digi - Doc
          </h3>
          <p className="mt-10 text-white z-30 font-bold">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, hic
            itaque aspernatur omnis quisquam nostrum voluptas a officiis
            consequuntur est temporibus dicta mollitia laudantium modi, autem,
            vel rem nam ullam!
          </p>
        </div>
      </div>
    </div>
  );
}
