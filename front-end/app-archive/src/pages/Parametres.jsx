import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, UserCheck2, UserRoundCog, DatabaseZap, Cable, Network, BackpackIcon, CircleArrowLeft, Zap, Bolt, TextSearch, TextSearchIcon } from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl text-white mb-8 flex items-center">
        <Settings size="40px" className="mr-2" />
        Paramétrages
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="card bg-gray-700 text-white shadow-xl hover:scale-105 transform transition-transform duration-300" onClick={() => handleNavigate('/profil')}>
          <div className="card-body flex flex-col items-center">
            <h2 className="card-title">Gestion profil</h2>
            <Zap size="60px" className="text-blue-400 mt-4" />
          </div>
        </div>
        <div className="card bg-gray-700 text-white shadow-xl hover:scale-105 transform transition-transform duration-300" onClick={() => handleNavigate('/users')}>
          <div className="card-body flex flex-col items-center">
            <h2 className="card-title">Création utilisateurs</h2>
            <UserRoundCog size="60px" className="text-blue-400 mt-4" />
          </div>
        </div>
        <div className="card bg-gray-700 text-white shadow-xl hover:scale-105 transform transition-transform duration-300" onClick={() => handleNavigate('/metadata')}>
          <div className="card-body flex flex-col items-center">
            <h2 className="card-title">Gestion méta-données</h2>
            <DatabaseZap size="60px" className="text-blue-400 mt-4" />
          </div>
        </div>
        <div className="card bg-gray-700 text-white shadow-xl hover:scale-105 transform transition-transform duration-300" onClick={() => handleNavigate('/pieces')}>
          <div className="card-body flex flex-col items-center">
            <h2 className="card-title">Configuration des pièces</h2>
            <Cable size="60px" className="text-blue-400 mt-4" />
          </div>
        </div>
        <div className="card bg-gray-700 text-white shadow-xl hover:scale-105 transform transition-transform duration-300" onClick={() => handleNavigate('/userRoles')}>
          <div className="card-body flex flex-col items-center">
            <h2 className="card-title">Fonctions agent</h2>
            <Bolt size="60px" className="text-blue-400 mt-4" />
          </div>
        </div>
        <div className="card bg-gray-700 text-white shadow-xl hover:scale-105 transform transition-transform duration-300" onClick={() => handleNavigate('/tree')}>
          <div className="card-body flex flex-col items-center">
            <h2 className="card-title">Structure système</h2>
            <Network size="60px" className="text-blue-400 mt-4" />
          </div>
        </div>
        <div className="card bg-gray-700 text-white shadow-xl hover:scale-105 transform transition-transform duration-300" onClick={() => handleNavigate('/search-config')}>
          <div className="card-body flex flex-col items-center">
            <h2 className="card-title">Moteur de recherche</h2>
            <TextSearchIcon size="60px" className="text-blue-400 mt-4" />
          </div>
        </div>
      </div>
      <button className="btn btn-primary mt-8" onClick={() => navigate(-1)}>
        <CircleArrowLeft className="mr-2" />
        Retour
      </button>
    </div>
  );
};

export default SettingsPage;
