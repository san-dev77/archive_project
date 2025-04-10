import { Settings, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserBadge = ({ path }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex bg-green-600 items-center space-x-2 p-2 transition-all hover:bg-green-800 cursor-pointer hover:scale-110 shadow-md rounded-lg relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        navigate(path);
      }}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg">
        <span className="text-gray-700 font-bold text-lg">
          {localStorage.getItem("firstName").charAt(0) +
            localStorage.getItem("lastName").charAt(0)}
        </span>
      </div>
      {isHovered && (
        <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-[200px] bg-white shadow-lg p-2 rounded-md">
          <div className="text-gray-800">
            <p className="text-sm font-semibold flex items-center justify-center text-gray-800">
              <Zap /> Role : &nbsp;
              {role}
            </p>
            <br />
            <p className="text-xs flex items-center text-gray-800 text-center">
              <Settings />
              {localStorage.getItem("service")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBadge;
