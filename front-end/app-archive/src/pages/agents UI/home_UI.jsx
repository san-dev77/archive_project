import React from 'react';
import Side_bar from '../../Components/Side_bar'; // Assurez-vous que l'importation est correcte
import SideBar_UI from './components_UI/Sidebar_UI';
import { Wifi, Activity, BarChart2, HelpCircle } from 'lucide-react';
import TopBar_UI from './components_UI/Top_bar_UI';

export default function Home() {
  // Récupérer les informations de l'agent depuis le local storage
  const firstName = localStorage.getItem('firstName');
  const lastName = localStorage.getItem('lastName');
  const role = localStorage.getItem('role');
  const service = localStorage.getItem('service');

  return (
    <div className="flex min-h-screen bg-gray-200">
      <SideBar_UI isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar_UI />
        <div className="p-4 mt-20">
          <div className="bg-white shadow-lg rounded-lg p-8 mb-8 transition-transform transform ">
            <h1 className="text-4xl font-extrabold text-center text-gray-800">
              Bienvenue, {firstName} {lastName} 👋!
            </h1>
            <p className="text-center flex items-center gap-2 justify-center text-gray-600 mt-4">
              <Wifi size={45} className=" p-2 bg-gray-600 rounded-full  text-green-500 animate-bounce" />
              Vous êtes connecté en tant que <span className="font-semibold">{role}</span> dans le service <span className="font-semibold">{service}</span>.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card shadow-lg bg-white p-6 rounded-lg transition-transform transform hover:scale-105">
              <Activity size={40} className="text-gray-500 mx-auto mb-4" />
              <h2 className="card-title text-center text-2xl font-bold text-gray-800">Activités</h2>
              <p className="text-center text-gray-600 mt-2">Explorez vos activités et gérez vos données facilement.</p>
            </div>
            <div className="card shadow-lg bg-white p-6 rounded-lg transition-transform transform hover:scale-105">
              <BarChart2 size={40} className="text-gray-500 mx-auto mb-4" />
              <h2 className="card-title text-center text-2xl font-bold text-gray-800">Statistiques</h2>
              <p className="text-center text-gray-600 mt-2">Visualisez vos statistiques de manière intuitive.</p>
            </div>
            <div className="card shadow-lg bg-white p-6 rounded-lg transition-transform transform hover:scale-105">
              <HelpCircle size={40} className="text-gray-500 mx-auto mb-4" />
              <h2 className="card-title text-center text-2xl font-bold text-gray-800">Support</h2>
              <p className="text-center text-gray-600 mt-2">Besoin d'aide? Nous sommes là pour vous.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
