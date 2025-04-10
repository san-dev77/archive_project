import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  GlobeLock,
  KeyIcon,
  Lock,
  LogIn,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Phone,
  User,
  Shield,
} from "lucide-react";
import logo from "../assets/icones/logo 3.jpg";
import bg from "../assets/bg/bg6.jpg";
import LoginErrorButton from "../Components/LoginError";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [resetStep, setResetStep] = useState(1);
  const [newPassword, setNewPassword] = useState("");
  const [modalContent, setModalContent] = useState({
    type: "",
    title: "",
    message: "",
  });
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/agents/login", {
        login,
        password,
      });

      // Stocker le token
      sessionStorage.setItem("token", response.data.token);

      // Stocker les données utilisateur dans localStorage
      if (response.data.permissions) {
        localStorage.setItem(
          "permissions",
          JSON.stringify(response.data.permissions)
        );
      }

      // Liste des données à stocker
      const userDataKeys = [
        "isAdmin",
        "profilName",
        "firstName",
        "lastName",
        "role",
        "service",
        "serviceId",
        "id_user",
        "directoryId",
        "mail",
        "login",
        "tel_number",
        "password",
        "created_at",
      ];

      // Stocker chaque donnée si elle existe
      userDataKeys.forEach((key) => {
        if (response.data[key] !== undefined) {
          // Cas spécial pour directoryId
          const storageKey = key === "directoryId" ? "directory_id" : key;
          localStorage.setItem(storageKey, response.data[key]);
        }
      });

      // Stocker un message de bienvenue pour l'afficher après redirection
      const welcomeMessage =
        response.data.profilName === "admin"
          ? "Bienvenue cher Administrateur !"
          : response.data.profilName === "super_agent"
          ? "Bienvenue cher Super Agent !"
          : "Bienvenue cher Agent !";
      localStorage.setItem("loginSuccess", welcomeMessage);

      // Redirection en fonction du profil
      let redirectUrl;
      switch (response.data.profilName.trim().toLowerCase()) {
        case "admin":
          redirectUrl = "/app-archive";
          break;
        case "super agent":
          redirectUrl = "/agent_up";
          break;
        case "agent":
          redirectUrl = "/agents_UI";
          break;
        default:
          redirectUrl = "/";
      }
      window.location.href = redirectUrl;
    } catch (error) {
      // Afficher l'erreur directement sur la page
      const errorMessage =
        error.response?.data?.message || "Erreur lors de la connexion";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      // Étape 1: Vérification du numéro de téléphone et récupération des infos
      if (resetStep === 1) {
        const response = await axios.get(
          `http://localhost:3000/agents/check-phone/${phoneNumber}`
        );

        if (response.data.exist) {
          setUserData(response.data.agent);
          setResetStep(2);
        } else {
          setModalContent({
            type: "error",
            title: "Erreur",
            message: "Numéro de téléphone non trouvé",
          });
          setShowModal(true);
        }
      }
      // Étape 2: Confirmation de l'identité
      else if (resetStep === 2) {
        setResetStep(3);
      }
      // Étape 3: Mise à jour du mot de passe
      else if (resetStep === 3) {
        await axios.post("http://localhost:3000/agents/reset-password", {
          tel_number: phoneNumber,
          new_password: newPassword,
        });

        setModalContent({
          type: "success",
          title: "Succès",
          message: "Mot de passe mis à jour avec succès",
        });
        setShowModal(true);
        setShowResetModal(false);
        setResetStep(1);
        setPhoneNumber(""); // Reset le numéro de téléphone
        setNewPassword(""); // Reset le nouveau mot de passe
        setUserData(null);
      }
    } catch (error) {
      setModalContent({
        type: "error",
        title: "Erreur",
        message: error.response?.data?.message || "Une erreur est survenue",
      });
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonctions de gestion des changements déplacées ici

  // Composant Modal personnalisé amélioré
  const CustomModal = () => {
    if (!showModal) return null;

    const isSuccess = modalContent.type === "success";

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        ></div>
        <div
          className={`relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 ${
            showModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div
            className={`absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full flex items-center justify-center ${
              isSuccess ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isSuccess ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {isSuccess ? (
                <CheckCircle className="h-8 w-8 text-white" />
              ) : (
                <AlertCircle className="h-8 w-8 text-white" />
              )}
            </div>
          </div>

          <div className="mt-12 text-center">
            <h3
              className={`text-xl font-bold mb-2 ${
                isSuccess ? "text-green-600" : "text-red-600"
              }`}
            >
              {modalContent.title}
            </h3>
            <p className="text-gray-600 mb-6">
              {modalContent.message}
              <br />
              Nous vous prions de patienter quelques instants...
            </p>

            <button
              onClick={() => setShowModal(false)}
              className={`px-6 py-2 rounded-lg text-white font-medium transition-all transform hover:scale-105 ${
                isSuccess
                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              }`}
            >
              {isSuccess ? "Parfait !" : "Fermer"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ResetPasswordModal = () => {
    if (!showResetModal) return null;

    // États locaux pour le composant modal
    const [localPhoneNumber, setLocalPhoneNumber] = useState(phoneNumber);
    const [localNewPassword, setLocalNewPassword] = useState(newPassword);
    const [localLoading, setLocalLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordFeedback, setPasswordFeedback] = useState("");

    // Évaluer la force du mot de passe
    const evaluatePasswordStrength = (password) => {
      if (!password) {
        setPasswordStrength(0);
        setPasswordFeedback("");
        return;
      }

      let strength = 0;
      let feedback = "";

      // Longueur
      if (password.length >= 8) {
        strength += 25;
      } else {
        feedback = "Le mot de passe doit contenir au moins 8 caractères";
        setPasswordStrength(strength);
        setPasswordFeedback(feedback);
        return;
      }

      // Contient des chiffres
      if (/\d/.test(password)) {
        strength += 25;
      } else {
        feedback = "Ajoutez des chiffres pour renforcer votre mot de passe";
        setPasswordStrength(strength);
        setPasswordFeedback(feedback);
        return;
      }

      // Contient des lettres minuscules et majuscules
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
        strength += 25;
      } else {
        feedback = "Utilisez des lettres minuscules et majuscules";
        setPasswordStrength(strength);
        setPasswordFeedback(feedback);
        return;
      }

      // Contient des caractères spéciaux
      if (/[^a-zA-Z0-9]/.test(password)) {
        strength += 25;
      } else {
        feedback = "Ajoutez des caractères spéciaux (!@#$%^&*)";
        setPasswordStrength(strength);
        setPasswordFeedback(feedback);
        return;
      }

      if (strength === 100) {
        feedback = "Excellent mot de passe !";
      }

      setPasswordStrength(strength);
      setPasswordFeedback(feedback);
    };

    // Fonction pour synchroniser les états locaux avec les états parents lors de la soumission
    const handleLocalSubmit = async () => {
      setLocalLoading(true);

      // Mettre à jour les états parents
      setPhoneNumber(localPhoneNumber);
      setNewPassword(localNewPassword);

      // Appeler la fonction de réinitialisation du mot de passe
      try {
        // Étape 1: Vérification du numéro de téléphone et récupération des infos
        if (resetStep === 1) {
          const response = await axios.get(
            `http://localhost:3000/agents/check-phone/${localPhoneNumber}`
          );

          if (response.data.exist) {
            setUserData(response.data.agent);
            setResetStep(2);
          } else {
            setModalContent({
              type: "error",
              title: "Erreur",
              message: "Numéro de téléphone non trouvé",
            });
            setShowModal(true);
          }
        }
        // Étape 2: Confirmation de l'identité
        else if (resetStep === 2) {
          setResetStep(3);
        }
        // Étape 3: Mise à jour du mot de passe
        else if (resetStep === 3) {
          if (passwordStrength < 75) {
            setModalContent({
              type: "error",
              title: "Mot de passe trop faible",
              message:
                passwordFeedback ||
                "Veuillez choisir un mot de passe plus fort",
            });
            setShowModal(true);
            setLocalLoading(false);
            return;
          }

          await axios.post("http://localhost:3000/agents/reset-password", {
            tel_number: localPhoneNumber,
            new_password: localNewPassword,
          });

          setModalContent({
            type: "success",
            title: "Succès",
            message: "Mot de passe mis à jour avec succès",
          });
          setShowModal(true);
          setShowResetModal(false);
          setResetStep(1);
          setPhoneNumber("");
          setNewPassword("");
          setUserData(null);
        }
      } catch (error) {
        setModalContent({
          type: "error",
          title: "Erreur",
          message: error.response?.data?.message || "Une erreur est survenue",
        });
        setShowModal(true);
      } finally {
        setLocalLoading(false);
      }
    };

    // Fonction pour obtenir la couleur de l'indicateur de force
    const getStrengthColor = () => {
      if (passwordStrength < 50) return "bg-red-500";
      if (passwordStrength < 75) return "bg-yellow-500";
      return "bg-green-500";
    };

    // Rendu des étapes
    const renderStepIndicator = () => {
      return (
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                resetStep >= 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <Phone className="w-4 h-4" />
            </div>
            <div
              className={`w-10 h-1 ${
                resetStep >= 2 ? "bg-indigo-600" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                resetStep >= 2
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <User className="w-4 h-4" />
            </div>
            <div
              className={`w-10 h-1 ${
                resetStep >= 3 ? "bg-indigo-600" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                resetStep >= 3
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <Shield className="w-4 h-4" />
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => {
            if (!localLoading) {
              setShowResetModal(false);
              setResetStep(1);
              setPhoneNumber("");
              setNewPassword("");
              setUserData(null);
            }
          }}
        ></div>
        <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 opacity-100">
          <div className="absolute top-3 right-3 text-xs text-gray-500">
            Étape {resetStep}/3
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
            {resetStep === 1 && "Réinitialisation du mot de passe"}
            {resetStep === 2 && "Confirmation d'identité"}
            {resetStep === 3 && "Nouveau mot de passe"}
          </h3>

          <p className="text-sm text-gray-500 mb-4 text-center">
            {resetStep === 1 &&
              "Entrez votre numéro de téléphone pour vérifier votre identité"}
            {resetStep === 2 &&
              "Vérifiez que ces informations sont bien les vôtres"}
            {resetStep === 3 && "Créez un nouveau mot de passe sécurisé"}
          </p>

          {renderStepIndicator()}

          {resetStep === 1 && (
            <div className="space-y-4">
              <div className="relative">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Numéro de téléphone
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={localPhoneNumber}
                    onChange={(e) => setLocalPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2 pl-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ex: 83 57 70 85"
                    required
                    disabled={localLoading}
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Nous utiliserons ce numéro pour vérifier votre compte
                </p>
              </div>
            </div>
          )}

          {resetStep === 2 && userData && (
            <div className="space-y-4">
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <p className="text-sm text-gray-700 mb-2 font-medium">
                  Confirmation d&apos;identité :
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-indigo-600 mr-2" />
                    <p className="font-medium text-gray-800">
                      {userData.prenom} {userData.nom}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-indigo-600 mr-2" />
                    <p className="text-sm text-gray-700">
                      {userData.nom_role} au service {userData.nom_service}
                    </p>
                  </div>
                  {userData.nom_directory && (
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 text-indigo-600 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <p className="text-sm text-gray-700">
                        Direction : {userData.nom_directory}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                Si ces informations sont correctes, cliquez sur Confirmer pour
                continuer
              </div>
            </div>
          )}

          {resetStep === 3 && (
            <div className="space-y-4">
              <div className="relative">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={localNewPassword}
                    onChange={(e) => {
                      setLocalNewPassword(e.target.value);
                      evaluatePasswordStrength(e.target.value);
                    }}
                    className="w-full px-4 py-2 pl-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Entrez votre nouveau mot de passe"
                    required
                    disabled={localLoading}
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>

                {/* Indicateur de force du mot de passe */}
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">
                      Force du mot de passe
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{
                        color:
                          passwordStrength < 50
                            ? "#ef4444"
                            : passwordStrength < 75
                            ? "#f59e0b"
                            : "#10b981",
                      }}
                    >
                      {passwordStrength < 50
                        ? "Faible"
                        : passwordStrength < 75
                        ? "Moyen"
                        : "Fort"}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStrengthColor()} transition-all duration-300`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                  {passwordFeedback && (
                    <p className="text-xs text-gray-500 mt-1">
                      {passwordFeedback}
                    </p>
                  )}
                </div>

                <div className="mt-3 text-xs text-gray-500 space-y-1">
                  <p className="flex text-black  items-center">
                    <span
                      className={`inline-block text-black w-3 h-3 rounded-full mr-2 ${
                        /[A-Z]/.test(localNewPassword)
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></span>
                    Au moins une lettre majuscule
                  </p>
                  <p className="flex text-black  items-center">
                    <span
                      className={`inline-block text-black  w-3 h-3 rounded-full mr-2 ${
                        /[a-z]/.test(localNewPassword)
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></span>
                    Au moins une lettre minuscule
                  </p>
                  <p className="flex text-black  items-center">
                    <span
                      className={`inline-block text-black  w-3 h-3 rounded-full mr-2 ${
                        /\d/.test(localNewPassword)
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></span>
                    Au moins un chiffre
                  </p>
                  <p className="flex text-black   items-center">
                    <span
                      className={`inline-block text-black  w-3 h-3 rounded-full mr-2 ${
                        /[^a-zA-Z0-9]/.test(localNewPassword)
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></span>
                    Au moins un caractère spécial( _ ,&,*,$,ç,...)
                  </p>
                  <p className="flex text-black  items-center">
                    <span
                      className={`inline-block text-black  w-3 h-3 rounded-full mr-2 ${
                        localNewPassword.length >= 8
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></span>
                    Au moins 8 caractères
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => {
                if (!localLoading) {
                  if (resetStep > 1) {
                    setResetStep(resetStep - 1);
                  } else {
                    setShowResetModal(false);
                    setResetStep(1);
                    setPhoneNumber("");
                    setNewPassword("");
                    setUserData(null);
                  }
                }
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              disabled={localLoading}
            >
              {resetStep > 1 ? "Retour" : "Annuler"}
            </button>

            <button
              onClick={handleLocalSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center"
              disabled={
                localLoading || (resetStep === 3 && passwordStrength < 50)
              }
            >
              {localLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  {resetStep === 1 && "Vérifier"}
                  {resetStep === 2 && "Confirmer"}
                  {resetStep === 3 && "Changer le mot de passe"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-700 to-gray-800">
      {/* Motif de fond avec lignes amélioré */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%">
          <pattern
            id="login-pattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 20 L 40 20 M 20 0 L 20 40"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeOpacity="0.15"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#login-pattern)" />

          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(79, 70, 229, 0.1)" />
            <stop offset="50%" stopColor="rgba(79, 70, 229, 0.3)" />
            <stop offset="100%" stopColor="rgba(79, 70, 229, 0.1)" />
          </linearGradient>

          {[...Array(5)].map((_, i) => (
            <line
              key={i}
              x1="0"
              y1={100 + i * 200}
              x2="100%"
              y2={100 + i * 200}
              stroke="url(#line-gradient)"
              strokeWidth="1"
              strokeDasharray="5,5"
              opacity="0.5"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="10"
                dur={`${3 + i}s`}
                repeatCount="indefinite"
              />
            </line>
          ))}
        </svg>
      </div>

      <LoginErrorButton />

      <div
        className="flex w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden transform transition duration-500 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)]"
        style={{ maxHeight: "85vh" }}
      >
        <div className="flex-1 bg-white p-8 rounded-l-2xl relative">
          {/* Ligne décorative en haut */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-500"></div>

          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center">
              <GlobeLock className="w-5 h-5 mr-2 text-indigo-600" />
              Connexion
            </h2>
            <p className="text-gray-600 text-sm">
              Accédez à votre espace Digi-Doc
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm">
              <p className="flex items-center text-gray-900">
                <span className="mr-2 text-gray-700">⚠️</span>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <KeyIcon className="w-4 h-4 mr-2 text-indigo-600" />
                Identifiant
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="w-full px-4 py-2 pl-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                  placeholder="Entrez votre identifiant"
                  required
                />
                <KeyIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Lock className="w-4 h-4 mr-2 text-indigo-600" />
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 pl-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                  placeholder="Entrez votre mot de passe"
                  required
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowResetModal(true)}
                className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                className="w-full py-2 flex items-center justify-center text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg hover:shadow-xl disabled:opacity-70"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Connexion..." : "Se connecter"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <div className="relative flex items-center justify-center mb-3">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-3 text-gray-400 text-xs">ou</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <p className="text-xs text-gray-600 mb-3">
              Besoin d&apos;aide pour vous connecter ?
            </p>

            <a
              href="#"
              className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Contacter l&apos;administrateur système
            </a>
          </div>
        </div>

        <div
          className="relative flex-1 hidden md:block"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl w-full max-w-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
              <img
                src={logo}
                alt="Logo Digi-Doc"
                className="mx-auto bg-white rounded-full w-16 h-16 p-1 shadow-lg mb-4 border-2 border-indigo-200"
              />
              <h3 className="text-xl font-bold text-center mb-3">
                Bienvenue sur Digi-Doc
              </h3>
              <p className="text-center text-white/90 text-sm mb-4">
                Votre solution de gestion documentaire intelligente pour une
                organisation optimale et sécurisée de vos archives.
              </p>
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  {[1, 2, 3].map((dot) => (
                    <div
                      key={dot}
                      className="w-1.5 h-1.5 rounded-full bg-white/50"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lignes décoratives comme dans Landing.jsx */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <pattern
                id="sidebar-pattern"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 0 20 L 40 20 M 20 0 L 20 40"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
              <rect width="100%" height="100%" fill="url(#sidebar-pattern)" />
            </svg>
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 text-center text-xs text-gray-100">
        © {new Date().getFullYear()} Digi-Doc. Tous droits réservés.
      </div>

      {/* Ajout de la modale personnalisée */}
      <CustomModal />
      <ResetPasswordModal />
    </div>
  );
}
