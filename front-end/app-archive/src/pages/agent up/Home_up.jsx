import { Activity, Users, Shield, ChartPie, AlertTriangle } from "lucide-react";
import SideBar_up from "./components/Sidebar_up";
import TopBar_up from "./components/Topbar_up";

export default function Home_up() {
  const role = localStorage.getItem("role");
  const service = localStorage.getItem("service");

  return (
    <div className="flex min-h-screen bg-[#1a1f2d]">
      <SideBar_up isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar_up />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-[#232b3e] rounded-xl shadow-xl p-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-[#2e374a] to-[#2c3242] rounded-xl p-6 mb-8 border border-[#3d4659]">
              <h1 className="text-2xl font-semibold text-gray-100">
                Supervision système
              </h1>
              <p className="text-gray-400 flex items-center gap-2 mt-2">
                <Shield size={18} className="text-emerald-400" />
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
                trendColor="text-amber-400"
                detail="Surveillance requise"
              />
              <QuickStatCard
                icon={<Users size={20} />}
                title="Agents connectés"
                value="24/35"
                trend="3 en pause"
                trendColor="text-blue-400"
                detail="68% capacité"
              />
              <QuickStatCard
                icon={<AlertTriangle size={20} />}
                title="Incidents critiques"
                value="3"
                trend="2 non assignés"
                trendColor="text-rose-400"
                detail="Urgent"
              />
              <QuickStatCard
                icon={<ChartPie size={20} />}
                title="Performance"
                value="92%"
                trend="+5% vs hier"
                trendColor="text-emerald-400"
                detail="Optimal"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne principale */}
              <div className="lg:col-span-2 space-y-6">
                {/* Incidents critiques */}
                <div className="bg-[#2a324a] rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-100">
                      Incidents critiques
                    </h2>
                    <span className="px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-sm">
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
                <div className="bg-[#2a324a] rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-gray-100 mb-6">
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
                <div className="bg-[#2a324a] rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-gray-100 mb-4">
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
                <div className="bg-[#2a324a] rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-gray-100 mb-4">
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

const CriticalIncident = ({ code, title, severity, impact, time, status }) => {
  const getSeverityStyle = (severity) => {
    const styles = {
      CRITIQUE: "bg-rose-500/20 text-rose-300",
      HAUTE: "bg-amber-500/20 text-amber-300",
      MOYENNE: "bg-blue-500/20 text-blue-300",
    };
    return styles[severity];
  };

  return (
    <div className="bg-[#1f2537] rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{code}</span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${getSeverityStyle(
                severity
              )}`}
            >
              {severity}
            </span>
          </div>
          <h3 className="text-gray-100 font-medium mt-2">{title}</h3>
          <p className="text-gray-400 text-sm mt-1">{impact}</p>
        </div>
        <div className="text-right">
          <div className="text-amber-400 font-mono">{time}</div>
          <div className="text-gray-400 text-sm mt-1">{status}</div>
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
        <span className="text-gray-300">{name}</span>
        <span className="text-gray-400">{detail}</span>
      </div>
      <div className="h-2 bg-[#1f2537] rounded-full">
        <div
          className={`h-2 rounded-full ${getStatusColor(status)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

const ServiceStatus = ({ name, status, latency }) => {
  const getStatusStyle = (status) => {
    const styles = {
      operational: "bg-emerald-500/20 text-emerald-300",
      degraded: "bg-amber-500/20 text-amber-300",
      critical: "bg-rose-500/20 text-rose-300",
    };
    return styles[status];
  };

  return (
    <div className="flex items-center justify-between p-3 bg-[#1f2537] rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${getStatusStyle(status)}`} />
        <span className="text-gray-100">{name}</span>
      </div>
      <span className="text-gray-400 text-sm">{latency}</span>
    </div>
  );
};

const ActivityLog = ({ type, message, time }) => {
  const getTypeStyle = (type) => {
    const styles = {
      alert: "text-rose-400",
      warning: "text-amber-400",
      info: "text-blue-400",
    };
    return styles[type];
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-[#1f2537] rounded-lg">
      <div className={`text-sm ${getTypeStyle(type)}`}>•</div>
      <div className="flex-1">
        <p className="text-gray-300 text-sm">{message}</p>
        <p className="text-gray-500 text-xs">Il y a {time}</p>
      </div>
    </div>
  );
};
