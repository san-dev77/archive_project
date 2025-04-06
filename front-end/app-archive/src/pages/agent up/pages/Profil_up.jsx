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
  Shield,
  Clock,
  FileText,
  Award,
  Briefcase,
  MapPin,
} from "lucide-react";
import SideBar_ui from "../components/Sidebar_up";
import { useState } from "react";
import { motion } from "framer-motion";
import TopBar_up from "../components/Topbar_up";

export default function Profil_up() {
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
  const [activeTab, setActiveTab] = useState("profile");

  // Statistiques fictives pour la démonstration
  const stats = {
    documentsTraités: 128,
    archivesGérées: 47,
    tauxComplétion: 94,
    dernièreConnexion: "Aujourd'hui à 09:45",
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-400">
      <SideBar_ui isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar_up position="fixed" title="Mon Profil" />

        {/* Contenu principal */}
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          {/* En-tête du profil */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 w-full rounded-lg shadow-md overflow-hidden mb-6"
          >
            <div className="h-32 bg-primary/80"></div>
            <div className="px-6 py-4 flex w-full flex-col md:flex-row gap-6 items-center md:items-end -mt-16 relative">
              <div className="w-32 h-32 rounded-full border-4 border-gray-800 bg-gray-800 shadow-lg overflow-hidden z-10">
                <div className="w-full h-full bg-primary flex items-center justify-center">
                  <User size={64} className="text-white" />
                </div>
              </div>

              <div className="flex-1 w-full text-center md:text-left">
                <h1 className="text-2xl font-bold text-white">{`${firstName} ${lastName}`}</h1>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
                  <span className="px-3 py-1 bg-primary/70 text-primary-content text-white rounded-full text-sm font-medium">
                    {role}
                  </span>
                  <span className="px-3 py-1 bg-info/70 text-white text-secondary-content rounded-full text-sm font-medium">
                    {service}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center transition-all duration-200 shadow-sm">
                  <SquarePen className="h-5 w-5 mr-2" />
                  Modifier
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center transition-all duration-200 shadow-sm">
                  <Shield className="h-5 w-5 mr-2" />
                  Sécurité
                </button>
              </div>
            </div>

            {/* Navigation par onglets */}
            <div className="px-6 pt-4 border-b border-gray-700">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === "profile"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Informations personnelles
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === "activity"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Activité
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === "security"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Sécurité
                </button>
              </div>
            </div>
          </motion.div>

          {activeTab === "profile" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Informations personnelles */}
              <motion.div
                variants={itemVariants}
                className="bg-gray-800 rounded-lg shadow-md p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <UserIcon className="text-primary" />
                  Informations Personnelles
                </h3>

                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-md border border-gray-600 hover:border-primary/30 transition-colors">
                    <p className="text-sm text-gray-400">Nom complet</p>
                    <p className="font-medium text-white text-lg">{`${firstName} ${lastName}`}</p>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-md border border-gray-600 hover:border-primary/30 transition-colors">
                    <p className="text-sm text-gray-400">Téléphone</p>
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="font-medium text-white text-lg">
                        {tel_number || "Non renseigné"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-md border border-gray-600 hover:border-primary/30 transition-colors">
                    <p className="text-sm text-gray-400">Email</p>
                    <div className="flex items-center">
                      <MailIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="font-medium text-white text-primary-content text-lg">
                        {mail}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-md border border-gray-600 hover:border-primary/30 transition-colors">
                    <p className="text-sm text-gray-400">Membre depuis</p>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="font-medium text-white text-lg">
                        {new Date(created_at).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Informations professionnelles */}
              <motion.div
                variants={itemVariants}
                className="bg-gray-800 rounded-lg shadow-md p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <BuildingIcon className="text-primary" />
                  Informations Professionnelles
                </h3>

                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-md border border-gray-600 hover:border-primary/30 transition-colors">
                    <p className="text-sm text-gray-400">Rôle</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-3 text-white py-1 bg-primary/70 text-primary-content rounded-full text-sm font-medium">
                        {role}
                      </span>
                      <p className="text-gray-100">
                        Accès {role === "admin" ? "complet" : "limité"} au
                        système
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-md border border-gray-600 hover:border-primary/30 transition-colors">
                    <p className="text-sm text-gray-400">Service</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      <p className="font-medium text-white">{service}</p>
                    </div>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-md border border-gray-600 hover:border-primary/30 transition-colors">
                    <p className="text-sm text-gray-400">Localisation</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p className="font-medium text-white">Siège principal</p>
                    </div>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-md border border-gray-600 hover:border-primary/30 transition-colors">
                    <p className="text-sm text-gray-100">Compétences</p>
                    <div className="flex text-white flex-wrap gap-2 mt-2">
                      <span className="px-3 text-white py-1 bg-primary/70 text-primary-content rounded-full text-sm">
                        Archivage
                      </span>
                      <span className="px-3 text-white py-1 bg-warning/70 text-secondary-content rounded-full text-sm">
                        Documentation
                      </span>
                      <span className="px-3 text-white py-1 bg-accent/70 text-accent-content rounded-full text-sm">
                        Gestion
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Statistiques */}
              <motion.div
                variants={itemVariants}
                className="md:col-span-2 bg-gray-800 rounded-lg shadow-md p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Award className="text-primary" />
                  Statistiques et Performance
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-700 p-4 rounded-md border border-primary/20">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">Documents traités</p>
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <p className="font-bold text-2xl text-white mt-2">
                      {stats.documentsTraités}
                    </p>
                    <p className="text-xs text-green-400 mt-1">+12% ce mois</p>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-md border border-secondary/20">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">Archives gérées</p>
                      <BuildingIcon className="h-5 w-5 text-secondary" />
                    </div>
                    <p className="font-bold text-2xl text-white mt-2">
                      {stats.archivesGérées}
                    </p>
                    <p className="text-xs text-secondary-content mt-1">
                      Actives
                    </p>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-md border border-accent/20">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">
                        Taux de complétion
                      </p>
                      <div className="h-5 w-5 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
                        %
                      </div>
                    </div>
                    <p className="font-bold text-2xl text-white mt-2">
                      {stats.tauxComplétion}%
                    </p>
                    <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                      <div
                        className="bg-accent h-2 rounded-full"
                        style={{ width: `${stats.tauxComplétion}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-md border border-gray-600">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">
                        Dernière connexion
                      </p>
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="font-medium text-white mt-2">
                      {stats.dernièreConnexion}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Activité régulière
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Informations de connexion */}
              <motion.div
                variants={itemVariants}
                className="md:col-span-2 bg-gray-800 rounded-lg shadow-md p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <KeyIcon className="text-primary" />
                  Informations de Connexion
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700 p-4 rounded-md border border-gray-600 hover:border-primary/30 transition-colors">
                    <p className="text-sm text-gray-400">Identifiant</p>
                    <p className="font-medium text-white text-lg">{login}</p>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-md border border-gray-600 hover:border-primary/30 transition-colors">
                    <p className="text-sm text-gray-400">Mot de passe</p>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white text-lg">
                        {showPassword ? password : "••••••••"}
                      </p>
                      <EyeIcon
                        className="h-5 w-5 text-gray-400 hover:text-primary cursor-pointer transition-colors duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-gray-700 rounded-md border border-primary/20">
                  <div className="flex items-start">
                    <ShieldIcon className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm text-gray-300">
                        Pour votre sécurité, nous vous recommandons de changer
                        votre mot de passe régulièrement et de ne jamais le
                        partager.
                      </p>
                      <button className="mt-2 text-sm font-medium text-primary hover:text-primary/80">
                        Changer mon mot de passe
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "activity" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800 w-full rounded-lg shadow-md p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Activité récente
              </h3>

              <div className="space-y-4">
                {[
                  {
                    action: "Connexion au système",
                    date: "Aujourd'hui, 09:45",
                    icon: <User className="h-4 w-4 text-white" />,
                  },
                  {
                    action: "Document archivé",
                    date: "Hier, 15:30",
                    icon: <FileText className="h-4 w-4 text-white" />,
                  },
                  {
                    action: "Modification de métadonnées",
                    date: "22/04/2023, 11:15",
                    icon: <SquarePen className="h-4 w-4 text-white" />,
                  },
                  {
                    action: "Recherche d'archives",
                    date: "20/04/2023, 14:22",
                    icon: <SearchIcon className="h-4 w-4 text-white" />,
                  },
                  {
                    action: "Changement de mot de passe",
                    date: "15/04/2023, 10:00",
                    icon: <KeyIcon className="h-4 w-4 text-white" />,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start p-3 border-b border-gray-700 last:border-0"
                  >
                    <div className="bg-primary/20 p-2 rounded-full text-primary-content mr-3">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.action}</p>
                      <p className="text-sm text-gray-400">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-4 text-primary hover:text-primary/80 text-sm font-medium">
                Voir toute l&apos;activité
              </button>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800 w-full rounded-lg shadow-md p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Paramètres de sécurité
              </h3>

              <div className="space-y-6">
                <div className="p-4 border border-gray-700 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-white">
                        Authentification à deux facteurs
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">
                        Ajoutez une couche de sécurité supplémentaire à votre
                        compte
                      </p>
                    </div>
                    <div className="form-control">
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-gray-700 rounded-md">
                  <div>
                    <h4 className="font-medium text-white">
                      Appareils connectés
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Gérez les appareils qui ont accès à votre compte
                    </p>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-700 rounded-md">
                      <div className="flex items-center">
                        <div className="bg-primary/20 p-2 rounded-full text-primary-content mr-3">
                          <Laptop className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-white font-medium">MacBook Pro</p>
                          <p className="text-xs text-gray-400">
                            Kati, Mali • Dernière activité: Aujourd&apos;hui
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-900 text-green-300 rounded-full text-xs">
                        Actuel
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-gray-700 rounded-md">
                  <h4 className="font-medium text-white">
                    Changer le mot de passe
                  </h4>
                  <p className="text-sm text-gray-400 mt-1">
                    Mettez à jour régulièrement votre mot de passe pour plus de
                    sécurité
                  </p>

                  <button className="mt-3 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md text-sm font-medium transition-colors">
                    Modifier le mot de passe
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// Composant SearchIcon pour l'activité
function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

// Composant Laptop pour la section sécurité
function Laptop(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
    </svg>
  );
}
