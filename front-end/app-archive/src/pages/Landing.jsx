import { LogInIcon } from "lucide-react";
import landing from "../assets/bg/test.jpg";
import icone1 from "../assets/icones/icone1.ico";
import icone2 from "../assets/icones/icone4.png";
import icone3 from "../assets/icones/icone5.png";
import logo from "../assets/icones/logo 3.jpg";
const LandingPage = () => {
  return (
    <div
      className="relative w-full h-screen flex items-center justify-center bg-cover"
      style={{ backgroundImage: `url(${landing})` }}
    >
      <div className="absolute inset-0 opacity-50 bg-black"></div>

      <div className="text-center w-full z-10 p-10 rounded-lg shadow-lg ">
        <div className="flex flex-col w-full items-center justify-center ">
          <img src={logo} className="rounded-full w-[140px] " alt="" />
          <h1 className="text-2xl md:text-6xl font-extrabold text-white mb-6">
            Bienvenue sur Digi - Doc
          </h1>
        </div>
        <p className="text-lg md:text-xl  text-gray-200 mb-8">
          Votre gestion de document ne sera plus jamais la même après ça !
        </p>
        <button
          className="btn btn-outline border-black btn-lg hover:bg-gray-800 hover:text-white text-black"
          onClick={() => (window.location.href = "/login")}
        >
          Se connecter
          <LogInIcon />
        </button>
        <div className="flex items-center justify-between w-full mt-12 gap-4">
          <div>
            <img className="w-[140px]" src={icone1} alt="" />
          </div>
          <div>
            <img className="w-[140px]" src={icone2} alt="" />
          </div>
          <div>
            <img className="w-[140px]" src={icone3} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
