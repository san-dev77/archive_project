import React from "react";
import SideBar_UI from "./components_UI/Sidebar_UI";
import TopBar_UI from "./components_UI/Top_bar_UI";
import {
  Wifi,
  Activity,
  Users,
  FolderOpen,
  Clock,
  Bell,
  ArrowRight,
  Calendar,
  FileCheck,
  Settings,
  Shield,
} from "lucide-react";

export default function Home() {
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const role = localStorage.getItem("role");
  const service = localStorage.getItem("service");

  return (
    <div className="flex min-h-screen bg-gray-300">
      <SideBar_UI isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar_UI />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-[#232b3e] rounded-xl shadow-xl p-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-[#2e374a] to-[#2c3242] rounded-xl p-6 mb-8 border border-[#3d4659]">
              <h1 className="text-2xl font-semibold text-gray-100">
                Tableau de bord agent
              </h1>
              <p className="text-gray-400 flex items-center gap-2 mt-2">
                <Shield size={18} className="text-[#00B7FF]" />
                {role} • {service} • {firstName} {lastName}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <QuickStatCard
                icon={<Users size={20} />}
                title="Utilisateurs actifs"
                value="24"
                trend="+12% cette semaine"
                trendColor="text-blue-400"
                detail="Stable"
              />
              <QuickStatCard
                icon={<FolderOpen size={20} />}
                title="Dossiers en cours"
                value="156"
                trend="32 nouveaux"
                trendColor="text-emerald-400"
                detail="En progression"
              />
              <QuickStatCard
                icon={<Clock size={20} />}
                title="Temps moyen"
                value="2.4h"
                trend="-30min vs hier"
                trendColor="text-emerald-400"
                detail="Efficacité"
              />
              <QuickStatCard
                icon={<Bell size={20} />}
                title="Notifications"
                value="12"
                trend="3 non lues"
                trendColor="text-amber-400"
                detail="À consulter"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Actions rapides */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#2a324a] rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-gray-100 mb-4">
                    Actions rapides
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ActionCard
                      icon={<FileCheck size={20} />}
                      title="Vérifier les dossiers"
                      description="Consultez les derniers dossiers en attente"
                    />
                    <ActionCard
                      icon={<Calendar size={20} />}
                      title="Planning du jour"
                      description="Voir vos tâches programmées"
                    />
                    <ActionCard
                      icon={<Activity size={20} />}
                      title="Suivi d'activité"
                      description="Consultez vos statistiques"
                    />
                    <ActionCard
                      icon={<Settings size={20} />}
                      title="Paramètres"
                      description="Gérez vos préférences"
                    />
                  </div>
                </div>
              </div>

              {/* Notifications récentes */}
              <div className="space-y-6">
                <div className="bg-[#2a324a] rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-gray-100 mb-4">
                    Notifications récentes
                  </h2>
                  <div className="space-y-3">
                    <NotificationItem
                      title="Nouveau dossier assigné"
                      time="Il y a 2h"
                      priority="high"
                    />
                    <NotificationItem
                      title="Mise à jour système"
                      time="Il y a 5h"
                      priority="medium"
                    />
                    <NotificationItem
                      title="Maintenance prévue"
                      time="Il y a 1j"
                      priority="low"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composants auxiliaires
const QuickStatCard = ({ icon, title, value, trend, trendColor, detail }) => (
  <div className="bg-[#2a324a] rounded-xl p-6 border border-[#3d4659]">
    <div className="flex items-center justify-between">
      <div className="p-2 bg-[#3d4659] rounded-lg">
        <div className="text-gray-100">{icon}</div>
      </div>
    </div>
    <h3 className="text-gray-400 mt-4">{title}</h3>
    <p className="text-2xl font-bold text-gray-100 mt-2">{value}</p>
    <div className="flex justify-between mt-2">
      <p className={`text-sm ${trendColor}`}>{trend}</p>
      <p className="text-sm text-gray-500">{detail}</p>
    </div>
  </div>
);

const ActionCard = ({ icon, title, description }) => (
  <div className="flex items-center justify-between p-3 bg-[#1f2537] rounded-lg hover:bg-[#283045] transition-all duration-300 cursor-pointer group">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-[#3d4659] rounded-lg text-gray-100">{icon}</div>
      <div>
        <h3 className="text-gray-100 font-medium">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
    <ArrowRight className="text-gray-500 group-hover:text-[#00B7FF] transition-colors" />
  </div>
);

const NotificationItem = ({ title, time, priority }) => {
  const priorityColors = {
    high: "text-rose-400",
    medium: "text-amber-400",
    low: "text-emerald-400",
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-[#1f2537] rounded-lg">
      <div className={`w-2 h-2 rounded-full ${priorityColors[priority]}`} />
      <div className="flex-1">
        <h4 className="text-gray-300 text-sm">{title}</h4>
        <p className="text-gray-500 text-xs">{time}</p>
      </div>
    </div>
  );
};
