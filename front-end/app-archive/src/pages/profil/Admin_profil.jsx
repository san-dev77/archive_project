import {
  PhoneIcon,
  MailIcon,
  UserIcon,
  CalendarIcon,
  BuildingIcon,
  ShieldIcon,
  KeyIcon,
  User,
  EyeIcon,
  SquarePen,
  ActivityIcon,
  BarChart3Icon,
  ClockIcon,
  UsersIcon,
  BellIcon,
  Settings2Icon,
} from "lucide-react";
import SideBar from "../../Components/Side_bar";
import SideBar_ui from "../../pages/agents UI/components_UI/Sidebar_UI";
import TopBar from "../../Components/Top_bar";
import TopBar_ui from "../../pages/agents UI/components_UI/Top_bar_UI";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function Profile() {
  // Récupérer les informations du localStorage
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const role = localStorage.getItem("role");
  const service = localStorage.getItem("service");
  const mail = localStorage.getItem("mail");
  const login = localStorage.getItem("login");
  const password = localStorage.getItem("password");
  const tel_number = localStorage.getItem("tel_number");
  const created_at = localStorage.getItem("created_at");
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName,
    lastName,
    tel_number,
    mail,
    password,
  });

  const [stats] = useState({
    ticketsResolus: 145,
    projetsSuivis: 12,
    tempsMoyenReponse: "2h 30min",
    tauxSatisfaction: "94%",
  });

  const [activites] = useState([
    {
      id: 1,
      action: "Ticket #1234 résolu",
      date: "Il y a 2 heures",
      type: "success",
    },
    {
      id: 2,
      action: "Nouveau projet assigné : Migration serveur",
      date: "Il y a 5 heures",
      type: "info",
    },
    {
      id: 3,
      action: "Mise à jour du système effectuée",
      date: "Hier",
      type: "warning",
    },
  ]);

  return (
    <div className="flex min-h-screen bg-gray-300">
      {role === "admin" ? (
        <SideBar isVisible={true} />
      ) : (
        <SideBar_ui isVisible={true} />
      )}
      <div className="flex-1 flex flex-col">
        {role === "admin" ? (
          <TopBar position="fixed" title="Mon Profil" />
        ) : (
          <TopBar_ui position="fixed" title="Mon Profil" />
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container w-full mx-auto px-4 py-8 mt-20"
        >
          <div className="bg-[#232b3e] rounded-xl shadow-xl p-6">
            {/* En-tête du profil */}
            <div className="bg-gradient-to-r from-[#2e374a] to-[#2c3242] rounded-xl p-6 mb-8 border border-[#3d4659]">
              <div className="flex items-center gap-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 p-1">
                    <div className="w-full h-full rounded-full bg-[#1a1f2d] flex items-center justify-center">
                      <User size={50} className="text-white/80" />
                    </div>
                  </div>
                  <button className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition-colors">
                    <SquarePen size={16} className="text-white" />
                  </button>
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-100 mb-2">
                    {firstName} {lastName}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-400">
                    <span className="flex items-center gap-2">
                      <ShieldIcon size={16} />
                      {role}
                    </span>
                    <span className="flex items-center gap-2">
                      <BuildingIcon size={16} />
                      {service}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all transform hover:scale-105"
                >
                  {isEditing ? "Sauvegarder" : "Modifier le profil"}
                </button>
              </div>
            </div>

            {/* Grille d'informations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Carte des informations personnelles */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#2a324a] rounded-xl p-6 border border-[#3d4659]"
              >
                <h2 className="text-xl font-semibold text-gray-100 mb-6 flex items-center gap-2">
                  <UserIcon className="text-blue-500" />
                  Informations Personnelles
                </h2>

                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={userInfo.firstName}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full bg-[#1f2537] border border-[#3d4659] rounded-lg p-3 text-white"
                      />
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-[#1f2537] rounded-xl">
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="text-gray-100">{mail}</p>
                        </div>
                        <MailIcon className="text-blue-500" size={20} />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-[#1f2537] rounded-xl">
                        <div>
                          <p className="text-sm text-gray-400">Téléphone</p>
                          <p className="text-gray-100">{tel_number}</p>
                        </div>
                        <PhoneIcon className="text-blue-500" size={20} />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-[#1f2537] rounded-xl">
                        <div>
                          <p className="text-sm text-gray-400">
                            Date d'inscription
                          </p>
                          <p className="text-gray-100">
                            {new Date(created_at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <CalendarIcon className="text-blue-500" size={20} />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Carte des informations de sécurité */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#2a324a] rounded-xl p-6 border border-[#3d4659]"
              >
                <h2 className="text-xl font-semibold text-gray-100 mb-6 flex items-center gap-2">
                  <KeyIcon className="text-blue-500" />
                  Sécurité
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#1f2537] rounded-xl">
                    <div>
                      <p className="text-sm text-gray-400">Identifiant</p>
                      <p className="text-gray-100">{login}</p>
                    </div>
                    <UserIcon className="text-blue-500" size={20} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#1f2537] rounded-xl">
                    <div>
                      <p className="text-sm text-gray-400">Mot de passe</p>
                      <p className="text-gray-100">
                        {showPassword ? password : "••••••••"}
                      </p>
                    </div>
                    <button onClick={() => setShowPassword(!showPassword)}>
                      <EyeIcon
                        className="text-blue-500 hover:text-blue-400 transition-colors"
                        size={20}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Statistiques */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:col-span-2 bg-[#2a324a] rounded-xl p-6 border border-[#3d4659]"
              >
                <h2 className="text-xl font-semibold text-gray-100 mb-6 flex items-center gap-2">
                  <BarChart3Icon className="text-blue-500" />
                  Statistiques
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#1f2537] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <ActivityIcon className="text-green-500" size={24} />
                      <span className="text-2xl font-bold text-gray-100">
                        {stats.ticketsResolus}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">Tickets résolus</p>
                  </div>
                  <div className="bg-[#1f2537] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <UsersIcon className="text-blue-500" size={24} />
                      <span className="text-2xl font-bold text-gray-100">
                        {stats.projetsSuivis}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">Projets suivis</p>
                  </div>
                  <div className="bg-[#1f2537] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <ClockIcon className="text-yellow-500" size={24} />
                      <span className="text-2xl font-bold text-gray-100">
                        {stats.tempsMoyenReponse}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Temps moyen de réponse
                    </p>
                  </div>
                  <div className="bg-[#1f2537] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Settings2Icon className="text-purple-500" size={24} />
                      <span className="text-2xl font-bold text-gray-100">
                        {stats.tauxSatisfaction}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Taux de satisfaction
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Activités récentes */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#2a324a] rounded-xl p-6 border border-[#3d4659]"
              >
                <h2 className="text-xl font-semibold text-gray-100 mb-6 flex items-center gap-2">
                  <ActivityIcon className="text-blue-500" />
                  Activités récentes
                </h2>
                <div className="space-y-4">
                  {activites.map((activite) => (
                    <div
                      key={activite.id}
                      className="flex items-center gap-4 p-4 bg-[#1f2537] rounded-xl"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activite.type === "success"
                            ? "bg-green-500"
                            : activite.type === "info"
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-gray-100">{activite.action}</p>
                        <p className="text-sm text-gray-400">{activite.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Préférences */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#2a324a] rounded-xl p-6 border border-[#3d4659]"
              >
                <h2 className="text-xl font-semibold text-gray-100 mb-6 flex items-center gap-2">
                  <BellIcon className="text-blue-500" />
                  Préférences de notification
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#1f2537] rounded-xl">
                    <div>
                      <p className="text-gray-100">Notifications par email</p>
                      <p className="text-sm text-gray-400">
                        Recevoir les mises à jour par email
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-[#3d4659] peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#1f2537] rounded-xl">
                    <div>
                      <p className="text-gray-100">Notifications push</p>
                      <p className="text-sm text-gray-400">
                        Recevoir les alertes en temps réel
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-[#3d4659] peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
