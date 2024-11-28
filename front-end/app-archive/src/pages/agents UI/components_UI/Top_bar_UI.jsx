import React, { useState } from 'react'; // Ajoutez useState
import { useNavigate } from 'react-router-dom';
import { BookText, ChartColumnBig, CircleChevronRight, Ellipsis, LogOut, Menu, User2Icon } from 'lucide-react';
import 'daisyui/dist/full.css';
import Logo2 from '../../../Components/Logo2';
import Logo from '../../../Components/Logo';
const TopBar_UI = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false); // État pour la visibilité de la Sidebar

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible); // Bascule la visibilité de la Sidebar
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('permissions');
    localStorage.removeItem('profilName');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('role');
    localStorage.removeItem('service');
    localStorage.removeItem('serviceId');
    navigate('/login');
  };

  return (
    <div>
      <div className="navbar bg-gradient-to-r from-gray-600 to-gray-800 fixed top-0 left-0 w-full z-20 shadow-md flex justify-between items-center px-10 py-4">
   
       <Logo/>
       <Logo2/>
       <div></div>
        <div className="flex items-center space-x-6">
          

          <button className="btn btn-ghost btn-circle text-white hover:text-blue-400 transition-transform duration-150 ease-in-out transform hover:scale-105 shadow-sm">
            <BookText className="mx-auto" />
          </button>
        
          <button className="btn btn-ghost btn-circle text-white hover:text-blue-400 transition-transform duration-150 ease-in-out transform hover:scale-105 shadow-sm">
            <ChartColumnBig className="mx-auto" />
          </button>
          <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-gray-400 to-gray-500 shadow-md rounded-lg">
  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg">
    <span className="text-gray-700 font-bold text-lg">
      {localStorage.getItem('firstName').charAt(0) + localStorage.getItem('lastName').charAt(0)}
    </span>
  </div>
  <div className="text-gray-800">
    <p className="text-sm font-semibold">{localStorage.getItem('role')}</p>
    <p className="text-xs">{localStorage.getItem('service')}</p>
  </div>
</div>
          <button onClick={handleLogout} className="btn btn-outline btn-md text-white hover:bg-white hover:text-blue-400 transition-transform duration-150 ease-in-out transform hover:scale-105 shadow-sm">
            <LogOut className="mx-auto" />
            Deconnexion
          </button>
       
        </div>
      </div>
    </div>

  );
};

export default TopBar_UI;
