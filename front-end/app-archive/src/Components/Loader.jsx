import "./Loader.css";
export default function Loader_component() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
      <div className="wrapper">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="shadow"></div>
        <div className="shadow"></div>
        <div className="shadow"></div>
        <h2 className="text-white w-full  mt-56 font-bold text-2xl">
          Chargement...
        </h2>
      </div>
    </div>
  );
}
