import SideBar_UI from "./components_UI/Sidebar_UI";
import TopBar_UI from "./components_UI/Top_bar_UI";
import {
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
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <SideBar_UI isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar_UI />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-white rounded-xl shadow-xl p-6 border border-green-100">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6 mb-8 border border-green-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-green-800">
                    Tableau de bord agent
                  </h1>
                  <div className="mt-4 flex items-center">
                    <Shield size={22} className="text-green-600 mr-3" />
                    <div>
                      <span className="text-xl font-bold text-gray-800">
                        {firstName} {lastName}
                      </span>
                      <div className="flex items-center mt-1">
                        <span className="text-green-600 font-medium">
                          {role}
                        </span>
                        <span className="mx-2 text-gray-500">•</span>
                        <span className="text-gray-600">{service}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 bg-white px-4 py-3 rounded-lg border border-green-200 shadow-md">
                  <p className="text-gray-500 text-sm">Connecté en tant que</p>
                  <p className="text-xl font-bold text-gray-800">
                    {firstName} {lastName}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="px-2 py-1 bg-green-100 rounded-md text-xs font-medium text-green-700">
                      {role}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      {service}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <QuickStatCard
                icon={<Users size={20} />}
                title="Utilisateurs actifs"
                value="24"
                trend="+12% cette semaine"
                trendColor="text-green-600"
                detail="Stable"
              />
              <QuickStatCard
                icon={<FolderOpen size={20} />}
                title="Dossiers en cours"
                value="156"
                trend="32 nouveaux"
                trendColor="text-green-600"
                detail="En progression"
              />
              <QuickStatCard
                icon={<Clock size={20} />}
                title="Temps moyen"
                value="2.4h"
                trend="-30min vs hier"
                trendColor="text-green-600"
                detail="Efficacité"
              />
              <QuickStatCard
                icon={<Bell size={20} />}
                title="Notifications"
                value="12"
                trend="3 non lues"
                trendColor="text-amber-500"
                detail="À consulter"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Actions rapides */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl p-6 border border-green-200 shadow-md">
                  <h2 className="text-lg font-semibold text-green-800 mb-4">
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
                <div className="bg-white rounded-xl p-6 border border-green-200 shadow-md">
                  <h2 className="text-lg font-semibold text-green-800 mb-4">
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
  <div className="bg-white rounded-xl p-6 border border-green-200 shadow-md">
    <div className="flex items-center justify-between">
      <div className="p-2 bg-green-100 rounded-lg">
        <div className="text-green-600">{icon}</div>
      </div>
    </div>
    <h3 className="text-gray-500 mt-4">{title}</h3>
    <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    <div className="flex justify-between mt-2">
      <p className={`text-sm ${trendColor}`}>{trend}</p>
      <p className="text-sm text-gray-500">{detail}</p>
    </div>
  </div>
);

const ActionCard = ({ icon, title, description }) => (
  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-all duration-300 cursor-pointer group border border-green-100">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-green-200 rounded-lg text-green-600">{icon}</div>
      <div>
        <h3 className="text-gray-800 font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    <ArrowRight className="text-gray-400 group-hover:text-green-600 transition-colors" />
  </div>
);

const NotificationItem = ({ title, time, priority }) => {
  const priorityColors = {
    high: "bg-red-100 border-red-300 text-red-800",
    medium: "bg-amber-100 border-amber-300 text-amber-800",
    low: "bg-green-100 border-green-300 text-green-800",
  };

  const dotColors = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-green-500",
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 ${priorityColors[priority]} rounded-lg border`}
    >
      <div className={`w-2 h-2 rounded-full ${dotColors[priority]}`} />
      <div className="flex-1">
        <h4 className="text-gray-800 text-sm font-medium">{title}</h4>
        <p className="text-gray-500 text-xs">{time}</p>
      </div>
    </div>
  );
};
