import { Tooltip } from "@mui/material";
import guide_icone from "../assets/icones/guide_icone.gif";

const FloatingGuideButton = () => {
  return (
    <Tooltip title="Guide">
      <div className="fixed bottom-5 right-5 transition-all hover:scale-125 ">
        <button className="flex items-center justify-center w-16 h-16 bg-white border-2 border-blue-600 rounded-full shadow-lg animate-bounce transition-transform transform hover:scale-150">
          <img src={guide_icone} alt="Floating Button" className="w-10 h-10" />
        </button>
      </div>
    </Tooltip>
  );
};

export default FloatingGuideButton;
