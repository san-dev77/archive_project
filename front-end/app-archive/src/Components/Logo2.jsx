import logo from "../assets/icones/logo_BMS.png";

export default function Logo2() {
  return (
    <div className="flex p-2 w-[150px] text-center bg-gray-700 rounded-lg fixed top-4 left-4 z-20 shadow-md items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105">
      <div className="flex items-center shadow-lg  justify-center w-full h-full">
        <img
          src={logo}
          alt="logo_BMS"
          className="w-full h-full object-contain rounded-lg bg-gray-200 shadow-lg"
        />
      </div>
    </div>
  );
}
