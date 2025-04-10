import {
  Activity,
  Users,
  Shield,
  ChartPie,
  AlertTriangle,
  Clock,
  Bell,
} from "lucide-react";
import SideBar_up from "./components/Sidebar_up";
import TopBar_up from "./components/Topbar_up";

export default function Home_up() {
  const role = localStorage.getItem("role");
  const service = localStorage.getItem("service");
  const userName = localStorage.getItem("firstName") || "Administrateur";
  const currentTime = new Date();
  const hours = currentTime.getHours();

  let greeting;
  if (hours < 12) {
    greeting = "Bonjour";
  } else if (hours < 18) {
    greeting = "Bon après-midi";
  } else {
    greeting = "Bonsoir";
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <SideBar_up isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar_up />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          {/* Message d'accueil */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-green-200 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-400 rounded-full opacity-10 -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-600 rounded-full opacity-10 -ml-20 -mb-20"></div>

            <div className="flex items-center justify-between relative z-10">
              <div>
                <h1 className="text-3xl font-bold text-green-800 flex items-center">
                  {greeting},{" "}
                  <span className="text-emerald-600 ml-2">{userName}</span>
                </h1>
                <p className="text-gray-600 mt-2 flex items-center">
                  <Clock size={16} className="mr-2 text-green-600" />
                  {currentTime.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="mt-4 text-gray-700">
                  Bienvenue sur votre tableau de bord. Vous avez{" "}
                  <span className="font-semibold text-green-700">
                    3 incidents critiques
                  </span>{" "}
                  à surveiller aujourd'hui.
                </p>
              </div>
              <div className="hidden md:flex items-center bg-green-100 p-4 rounded-lg border border-green-200">
                <Bell className="mr-3 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Notification importante
                  </p>
                  <p className="text-xs text-gray-600">
                    Maintenance prévue à 22h00
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-6 border border-green-100">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl p-6 mb-8 border border-green-200 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full opacity-10 -mr-20 -mt-20"></div>
              <h1 className="text-2xl font-semibold text-white relative z-10">
                Supervision système
              </h1>
              <p className="text-green-100 flex items-center gap-2 mt-2 relative z-10">
                <Shield size={18} className="text-green-200" />
                {role} • {service}
              </p>
            </div>

            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <QuickStatCard
                icon={<Activity size={20} />}
                title="Charge système"
                value="78%"
                trend="+12% vs normal"
                trendColor="text-amber-600"
                detail="Surveillance requise"
              />
              <QuickStatCard
                icon={<Users size={20} />}
                title="Agents connectés"
                value="24/35"
                trend="3 en pause"
                trendColor="text-blue-600"
                detail="68% capacité"
              />
              <QuickStatCard
                icon={<AlertTriangle size={20} />}
                title="Incidents critiques"
                value="3"
                trend="2 non assignés"
                trendColor="text-rose-600"
                detail="Urgent"
              />
              <QuickStatCard
                icon={<ChartPie size={20} />}
                title="Performance"
                value="92%"
                trend="+5% vs hier"
                trendColor="text-emerald-600"
                detail="Optimal"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne principale */}
              <div className="lg:col-span-2 space-y-6">
                {/* Incidents critiques */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-green-800">
                      Incidents critiques
                    </h2>
                    <span className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-sm font-medium">
                      3 actifs
                    </span>
                  </div>
                  <div className="space-y-4">
                    <CriticalIncident
                      code="INC-2024-089"
                      title="Défaillance système principal"
                      severity="CRITIQUE"
                      impact="4 services affectés"
                      time="00:47:23"
                      status="NON ASSIGNÉ"
                    />
                    <CriticalIncident
                      code="INC-2024-088"
                      title="Perte connexion - Site B"
                      severity="HAUTE"
                      impact="2 équipes bloquées"
                      time="01:23:45"
                      status="EN COURS"
                    />
                    <CriticalIncident
                      code="INC-2024-087"
                      title="Surcharge serveur BDD"
                      severity="MOYENNE"
                      impact="Performance dégradée"
                      time="02:15:00"
                      status="EN ANALYSE"
                    />
                  </div>
                </div>

                {/* Monitoring système */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-200 shadow-sm">
                  <h2 className="text-lg font-semibold text-green-800 mb-6">
                    Monitoring système
                  </h2>
                  <div className="space-y-6">
                    <SystemMetric
                      name="CPU"
                      value={78}
                      status="warning"
                      detail="Charge élevée"
                    />
                    <SystemMetric
                      name="Mémoire"
                      value={65}
                      status="normal"
                      detail="4.2/8 GB utilisés"
                    />
                    <SystemMetric
                      name="Stockage"
                      value={92}
                      status="critical"
                      detail="Nettoyage requis"
                    />
                    <SystemMetric
                      name="Réseau"
                      value={45}
                      status="normal"
                      detail="2.3 GB/s"
                    />
                  </div>
                </div>
              </div>

              {/* Colonne latérale */}
              <div className="space-y-6">
                {/* État des services */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-200 shadow-sm">
                  <h2 className="text-lg font-semibold text-green-800 mb-4">
                    État des services
                  </h2>
                  <div className="space-y-3">
                    <ServiceStatus
                      name="API Gateway"
                      status="operational"
                      latency="45ms"
                    />
                    <ServiceStatus
                      name="Base de données"
                      status="degraded"
                      latency="280ms"
                    />
                    <ServiceStatus
                      name="Auth Service"
                      status="operational"
                      latency="65ms"
                    />
                    <ServiceStatus
                      name="File Storage"
                      status="critical"
                      latency="500ms+"
                    />
                  </div>
                </div>

                {/* Activité temps réel */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-200 shadow-sm">
                  <h2 className="text-lg font-semibold text-green-800 mb-4">
                    Activité temps réel
                  </h2>
                  <div className="space-y-3">
                    <ActivityLog
                      type="alert"
                      message="Tentative d'accès non autorisé"
                      time="2 min"
                    />
                    <ActivityLog
                      type="warning"
                      message="Ralentissement détecté - DB"
                      time="5 min"
                    />
                    <ActivityLog
                      type="info"
                      message="Backup automatique terminé"
                      time="12 min"
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

// Composants mis à jour
const QuickStatCard = ({ icon, title, value, trend, trendColor, detail }) => (
  <div className="bg-white rounded-xl p-6 border border-green-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex items-center justify-between">
      <div className="p-2 bg-green-100 rounded-lg">
        <div className="text-green-700">{icon}</div>
      </div>
    </div>
    <h3 className="text-gray-600 mt-4 font-medium">{title}</h3>
    <p className="text-2xl font-bold text-green-800 mt-2">{value}</p>
    <div className="flex justify-between mt-2">
      <p className={`text-sm ${trendColor} font-medium`}>{trend}</p>
      <p className="text-sm text-gray-500">{detail}</p>
    </div>
  </div>
);

const CriticalIncident = ({ code, title, severity, impact, time, status }) => {
  const getSeverityStyle = (severity) => {
    const styles = {
      CRITIQUE: "bg-rose-100 text-rose-600",
      HAUTE: "bg-amber-100 text-amber-600",
      MOYENNE: "bg-blue-100 text-blue-600",
    };
    return styles[severity];
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-green-100 hover:shadow-sm transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{code}</span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${getSeverityStyle(
                severity
              )} font-medium`}
            >
              {severity}
            </span>
          </div>
          <h3 className="text-gray-800 font-medium mt-2">{title}</h3>
          <p className="text-gray-600 text-sm mt-1">{impact}</p>
        </div>
        <div className="text-right">
          <div className="text-amber-600 font-mono font-medium">{time}</div>
          <div className="text-gray-500 text-sm mt-1">{status}</div>
        </div>
      </div>
    </div>
  );
};

const SystemMetric = ({ name, value, status, detail }) => {
  const getStatusColor = (status) => {
    const colors = {
      normal: "bg-emerald-500",
      warning: "bg-amber-500",
      critical: "bg-rose-500",
    };
    return colors[status];
  };

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-gray-700 font-medium">{name}</span>
        <span className="text-gray-600">{detail}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-2 rounded-full ${getStatusColor(
            status
          )} transition-all duration-1000 ease-in-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

const ServiceStatus = ({ name, status, latency }) => {
  const getStatusStyle = (status) => {
    const styles = {
      operational: "bg-emerald-100 text-emerald-600",
      degraded: "bg-amber-100 text-amber-600",
      critical: "bg-rose-100 text-rose-600",
    };
    return styles[status];
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100 hover:shadow-sm transition-all duration-300">
      <div className="flex items-center gap-3">
        <div
          className={`w-2 h-2 rounded-full ${
            getStatusStyle(status).split(" ")[1]
          }`}
        />
        <span className="text-gray-800 font-medium">{name}</span>
      </div>
      <span className="text-gray-500 text-sm">{latency}</span>
    </div>
  );
};

const ActivityLog = ({ type, message, time }) => {
  const getTypeStyle = (type) => {
    const styles = {
      alert: "text-rose-600",
      warning: "text-amber-600",
      info: "text-blue-600",
    };
    return styles[type];
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-100 hover:shadow-sm transition-all duration-300">
      <div className={`text-lg font-bold ${getTypeStyle(type)}`}>•</div>
      <div className="flex-1">
        <p className="text-gray-700 text-sm font-medium">{message}</p>
        <p className="text-gray-500 text-xs">Il y a {time}</p>
      </div>
    </div>
  );
};
