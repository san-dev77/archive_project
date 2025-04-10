import { useState, useEffect } from "react";
import user_icone from "../assets/icones/user_icone.png";
import {
  CirclePlus,
  LayoutList,
  Plus,
  PlusCircle,
  Settings,
  Settings2Icon,
  ShieldCheck,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "../Components/Side_bar";
import TopBar from "../Components/Top_bar";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import { showDeleteConfirmation } from "../utils/alerts";

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [AgentNoProfil, SetAgentNoProfil] = useState(0);
  const [newAgent, setNewAgent] = useState({
    lastName: "",
    phone: "",
    email: "",
    service: "",
    login: "",
    password: "",
    fonction_id: "",
    firstName: "",
  });
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredAgents, setFilteredAgents] = useState([]);

  const [editingAgent, setEditingAgent] = useState(null);
  const [servicesData, setServicesData] = useState([]);
  const [showRoleOptionsModal, setShowRoleOptionsModal] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      const response = await fetch("http://localhost:3000/agents/");
      const data = await response.json();
      console.log(data);

      setAgents(data);
      setFilteredAgents(data);
    };
    fetchAgents();
    const fetchAgentNoProfilCount = async () => {
      const response = await fetch(
        "http://localhost:3000/agents/agentNoProfil"
      );
      const data = await response.json();
      console.log(data);

      SetAgentNoProfil(data);
    };
    fetchAgentNoProfilCount();

    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/services/directory"
        );
        const data = response.data.map((directory) => {
          const services = directory.services
            .split("|")
            .map((service) => JSON.parse(service));
          return {
            ...directory,
            services,
          };
        });
        setServicesData(data);
        if (data.length > 0 && data[0].services.length > 0) {
          setNewAgent((prev) => ({
            ...prev,
            service: data[0].services[0].id,
          }));
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    const fetchRoles = async () => {
      const response = await fetch("http://localhost:3000/roles");
      const data = await response.json();
      setRoles(data);
      if (data.length > 0) {
        setNewAgent((prev) => ({
          ...prev,
          fonction_id: data[0].id,
        }));
      }
    };

    fetchServices();
    fetchRoles();

    const fetchProfiles = async () => {
      const response = await fetch("http://localhost:3000/profil");
      const data = await response.json();
      console.log(data);
    };
    fetchProfiles();
  }, []);

  useEffect(() => {
    setFilteredAgents(
      agents.filter(
        (agent) =>
          agent.prenom.toLowerCase().includes(searchText.toLowerCase()) ||
          agent.nom.toLowerCase().includes(searchText.toLowerCase()) ||
          agent.mail.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText, agents]);

  const refresh_agent = async () => {
    const response = await fetch("http://localhost:3000/agents/");
    const data = await response.json();
    console.log(data);

    setAgents(data);
    setFilteredAgents(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAgent({ ...newAgent, [name]: value });
  };

  const handleAddAgent = async (e) => {
    try {
      e.preventDefault();
      if (!newAgent.firstName) {
        toast.error("Veuillez remplir tous les champs obligatoires.");
        return;
      }

      const response = await fetch(
        "http://localhost:3000/agents/create-agent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newAgent, firstName: newAgent.firstName }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de la requête: ${errorText}`);
      }
      refresh_agent();
      setNewAgent({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        login: "",
        password: "",
        service: "",
        fonction_id: "",
        prenom: "",
      });
      Swal.fire("Succès!", "Agent créé avec succès!", "success"); // SweetAlert for success
    } catch (error) {
      Swal.fire(
        "Erreur!",
        "Erreur lors de l'ajout de l'agent: " + error.message,
        "error"
      ); // SweetAlert for error
    }
  };

  const handleEdit = (agent) => {
    setEditingAgent(agent);
    setOpenEditModal(true);
  };

  const handleUpdateAgent = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch(
        `http://localhost:3000/agents/update-agent/${editingAgent.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingAgent),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de la requête: ${errorText}`);
      }

      refresh_agent();
      setOpenEditModal(false);
      Swal.fire("Succès!", "Agent mis à jour avec succès!", "success"); // SweetAlert for success
    } catch (error) {
      Swal.fire(
        "Erreur!",
        "Erreur lors de la mise à jour de l'agent: " + error.message,
        "error"
      ); // SweetAlert for error
    }
  };

  const handleDelete = async (agentId) => {
    const confirm = await showDeleteConfirmation();
    if (confirm) {
      try {
        const response = await fetch(
          `http://localhost:3000/agents/remove-agent/${agentId}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          setAgents(agents.filter((agent) => agent.id !== agentId));
          setFilteredAgents(
            filteredAgents.filter((agent) => agent.id !== agentId)
          );
          Swal.fire("Succès!", "Agent supprimé avec succès!", "success"); // SweetAlert for success
        } else {
          const errorText = await response.text();
          throw new Error(`Erreur lors de la requête: ${errorText}`);
        }
      } catch (error) {
        Swal.fire(
          "Erreur!",
          "Erreur lors de la suppression de l'agent: " + error.message,
          "error"
        ); // SweetAlert for error
      }
    }
  };

  const togglePasswordVisibility = (id) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditingAgent(null);
  };

  const handleOpenRoleModal = () => {
    setShowRoleModal(true);
  };

  const handleCloseRoleModal = () => {
    setShowRoleModal(false);
    setNewRole("");
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/roles/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom_role: newRole }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de la requête: ${errorText}`);
      }

      Swal.fire("Succès!", "Rôle créé avec succès!", "success");
      handleCloseRoleModal();
      const updatedRoles = await fetch("http://localhost:3000/roles");
      const rolesData = await updatedRoles.json();
      setRoles(rolesData); // Refresh roles after creating a new role
    } catch (error) {
      Swal.fire(
        "Erreur!",
        "Erreur lors de la création du rôle: " + error.message,
        "error"
      );
    }
  };

  const handleOpenRoleOptionsModal = () => {
    setShowRoleOptionsModal(true);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <SideBar isVisible={true} className="w-64" />
      <div className="flex-1 w-[70%] flex flex-col">
        <TopBar position="fixed" title="Agents" />

        <div className="container h-full w-full mx-auto bg-white w-full rounded-xl shadow-xl p-6 border border-green-100 flex flex-col">
          <div className="mx-auto w-[95%] mt-24 mb-6">
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl shadow-2xl p-6 border border-green-400/30 relative">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <Settings2Icon className="text-green-300" />
                    Attribution des Actions
                  </h2>
                  <p className="text-green-100 mb-4">
                    Pour permettre aux agents d&apos;interagir avec le système,
                    vous devez leur attribuer des actions spécifiques. Chaque
                    agent peut avoir différents niveaux d&apos;accès et de
                    permissions selon son rôle.
                  </p>
                  <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2 bg-green-700/50 px-4 py-2 rounded-lg">
                      <span className="text-yellow-300">⚠️</span>
                      <span className="text-green-100 text-sm">
                        <span className="text-green-800 p-1 rounded-full bg-white font-bold text-2x1">
                          {AgentNoProfil.count}
                        </span>{" "}
                        agents nécessitent un profil avec au moins une
                        d&apos;action
                      </span>
                    </div>
                    <button
                      onClick={() => (window.location.href = "/profil")}
                      className="btn bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      Configurer les profils
                    </button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-48 h-48 relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-emerald-600/20 rounded-full animate-pulse"></div>
                    <div className="absolute inset-4 bg-gradient-to-tr from-green-500/40 to-emerald-600/40 rounded-full animate-pulse delay-75"></div>
                    <div className="absolute inset-8 bg-gradient-to-tr from-green-500/60 to-emerald-600/60 rounded-full animate-pulse delay-150"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Settings2Icon className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h4 className="text-2xl w-full font-extrabold mt-2 text-green-800 mb-4 flex items-center p-6 border-b border-green-100">
            <LayoutList size="32px" className="mr-2 text-green-600" />
            Gestion des Agents
          </h4>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 shadow-inner w-full mb-6">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Rechercher un agent..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 bg-white text-gray-800 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition-all duration-200"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>
              <button
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                onClick={handleOpenModal}
              >
                <Plus size={20} className="mr-2" />
                Nouveau
              </button>
              <button
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-5 py-2.5 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                onClick={handleOpenRoleOptionsModal}
              >
                <Plus size={20} className="mr-2" />
                Nouveau Rôle
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAgents.map((agent, index) => (
                <div
                  key={agent.id}
                  className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center gap-5 justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="avatar bg-gradient-to-r from-green-400 to-teal-500 p-2 rounded-xl">
                        <div className="mask mask-squircle h-16 w-16">
                          <img
                            src={user_icone}
                            alt="Avatar"
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-[16px] text-gray-800">
                          {agent.prenom}
                        </h3>
                        <p className="text-gray-600">{agent.nom}</p>
                      </div>
                    </div>
                    {index !== 0 && (
                      <div className="flex flex-col gap-2">
                        <Tooltip title="Modifier">
                          <button
                            onClick={() => handleEdit(agent)}
                            className="p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors duration-200"
                          >
                            <SquarePenIcon className="h-5 w-5" />
                          </button>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <button
                            onClick={() => handleDelete(agent.id)}
                            className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors duration-200"
                          >
                            <Trash2Icon className="h-5 w-5" />
                          </button>
                        </Tooltip>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-500">
                        Fonction:
                      </span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {agent.nom_role}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-500">
                        Profil:
                      </span>
                      <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                        {agent.nom_profil || "Non défini"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-500">
                        Service:
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {agent.nom_service || "Non affecté"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-500">
                        Téléphone:
                      </span>
                      <span className="text-gray-700">{agent.tel_number}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-500">
                        Email:
                      </span>
                      <span className="text-blue-600">{agent.mail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-500">
                        Identifiant:
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded-lg text-gray-800">
                        {agent.login}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-500">
                        Mot de passe:
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-gray-700">
                          {passwordVisibility[agent.id]
                            ? agent.password
                            : "••••••••"}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(agent.id)}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          {passwordVisibility[agent.id] ? (
                            <VisibilityOff className="text-gray-500 h-4 w-4" />
                          ) : (
                            <Visibility className="text-gray-500 h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`fixed inset-0 z-[99999] overflow-y-auto ${
              openModal ? "visible" : "invisible"
            }`}
          >
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={handleCloseModal}
            ></div>
            <div className="relative min-h-screen flex items-center justify-center p-4">
              <div className="relative z-50 w-full max-w-2xl bg-white rounded-xl shadow-2xl">
                <div className="sticky top-0 bg-white p-6 pb-2 z-10 flex justify-between items-center border-b border-green-100">
                  <h2 className="text-2xl font-bold text-green-800">
                    Créer un nouvel agent
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700 transition-colors rounded-full p-2 hover:bg-gray-100"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <form className="space-y-4" onSubmit={handleAddAgent}>
                    <div className="form-control w-full">
                      <label className="label">Prénom</label>
                      <input
                        type="text"
                        placeholder="Prénom"
                        name="firstName"
                        value={newAgent.firstName}
                        onChange={handleInputChange}
                        className="input input-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                        required
                      />
                    </div>
                    <div className="form-control w-full">
                      <label className="label">Nom</label>
                      <input
                        type="text"
                        placeholder="Nom"
                        name="lastName"
                        value={newAgent.lastName}
                        onChange={handleInputChange}
                        className="input input-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                        required
                      />
                    </div>
                    <div className="form-control w-full">
                      <label className="label">Numéro de téléphone</label>
                      <input
                        type="text"
                        placeholder="Numéro de téléphone"
                        name="phone"
                        value={newAgent.phone}
                        onChange={handleInputChange}
                        className="input input-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                        required
                      />
                    </div>
                    <div className="form-control w-full">
                      <label className="label">Email</label>
                      <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={newAgent.email}
                        onChange={handleInputChange}
                        className="input input-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                        required
                      />
                    </div>
                    <div className="form-control w-full">
                      <label className="label">Login</label>
                      <input
                        type="text"
                        placeholder="Login"
                        name="login"
                        value={newAgent.login}
                        onChange={handleInputChange}
                        className="input input-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                        required
                      />
                    </div>
                    <div className="form-control w-full">
                      <label className="label">Mot de passe</label>
                      <input
                        placeholder="Mot de passe"
                        name="password"
                        value={newAgent.password}
                        onChange={handleInputChange}
                        className="input input-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                        required
                      />
                    </div>
                    <div className="form-control w-full">
                      <label className="label">Service</label>
                      <select
                        name="service"
                        value={newAgent.service}
                        onChange={(e) => {
                          setNewAgent({
                            ...newAgent,
                            service: e.target.value,
                          });
                        }}
                        className="select select-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                        required
                      >
                        {servicesData.map((directory) => (
                          <optgroup
                            key={directory.directory_id}
                            label={directory.nom_directory}
                          >
                            {directory.services.map((service) => (
                              <option key={service.id} value={service.id}>
                                {service.nom_service}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                    <div className="form-control w-full">
                      <label className="label">Fonction</label>
                      <select
                        name="fonction_id"
                        value={newAgent.fonction_id}
                        onChange={handleInputChange}
                        className="select select-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                        required
                      >
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.nom_role}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="modal-action flex justify-center items-center space-x-4 sticky bottom-0 pt-4 bg-white border-t border-green-100">
                      <button
                        type="submit"
                        className="btn px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <PlusCircle className="mr-2" />
                        Créer
                      </button>
                      <button
                        type="button"
                        className="btn px-6 py-2.5 bg-white border border-red-500 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-300"
                        onClick={handleCloseModal}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`fixed inset-0 z-50 w-full h-screen flex items-center justify-center ${
              showRoleOptionsModal ? "visible" : "invisible"
            }`}
          >
            <div
              className="fixed w-full h-screen inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowRoleOptionsModal(false)}
            ></div>
            <div className="relative z-[9999] w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-6">
              <button
                onClick={() => setShowRoleOptionsModal(false)}
                className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ✕
              </button>
              <h2 className="text-3xl text-black flex items-center justify-center gap-2 font-bold mb-6">
                <Settings size={30} />
                Options de Rôle
              </h2>
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div
                  onClick={handleOpenRoleModal}
                  className="cursor-pointer bg-gradient-to-br from-gray-500 to-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-indigo-100 p-3 rounded-full mb-4">
                      <CirclePlus size={24} className="text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-white text-lg mb-2">
                      Créer un nouveau rôle
                    </h3>
                    <p className="text-white text-sm">
                      Ajouter un nouveau rôle au système
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => {
                    window.location.href = "/UserRoles";
                  }}
                  className="cursor-pointer bg-gradient-to-br from-gray-500 to-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-emerald-100 p-3 rounded-full mb-4">
                      <LayoutList size={24} className="text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-white text-lg mb-2">
                      Liste des rôles
                    </h3>
                    <p className="text-white text-sm">
                      Voir et gérer les rôles existants
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`fixed inset-0 z-50 overflow-y-auto ${
              showRoleModal ? "visible" : "invisible"
            }`}
          >
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleCloseRoleModal}
            ></div>
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="relative z-50 w-full max-w-md bg-white rounded-xl shadow-2xl">
                <div className="p-6 max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={handleCloseRoleModal}
                    className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    ✕
                  </button>
                  <h2 className="text-2xl font-bold mb-6">
                    Créer un nouveau rôle
                  </h2>
                  <form className="overflow-y-auto" onSubmit={handleCreateRole}>
                    <div className="form-control w-full">
                      <label className="label">Nom du rôle</label>
                      <input
                        type="text"
                        placeholder="Nom du rôle"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="input input-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                        required
                      />
                    </div>
                    <div className="modal-action flex justify-center items-center">
                      <button
                        type="submit"
                        className="btn flex justify-center items-center btn-primary w-[50%] bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg"
                      >
                        Créer
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-error w-[40%] mt-2"
                        onClick={handleCloseRoleModal}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`fixed mt-20 inset-0 z-[99999] overflow-y-auto ${
              openEditModal ? "visible" : "invisible"
            }`}
          >
            <div
              className="fixed mt-10 min-h-screen inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleCloseEditModal}
            ></div>
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="relative z-50 w-full max-w-2xl bg-white rounded-xl shadow-2xl">
                <div className="p-6 max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={handleCloseEditModal}
                    className="absolute right-4 text-black top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    ✕
                  </button>
                  <h2 className="text-2xl text-black font-bold mb-6">
                    Modifier l&apos;agent
                  </h2>
                  <form
                    className="overflow-y-auto"
                    onSubmit={handleUpdateAgent}
                  >
                    <div className="form-control w-full">
                      <label className="label">Prénom</label>
                      <input
                        type="text"
                        placeholder="Prénom"
                        name="prenom"
                        value={editingAgent?.prenom || ""}
                        onChange={(e) =>
                          setEditingAgent({
                            ...editingAgent,
                            prenom: e.target.value,
                          })
                        }
                        className="input input-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                        required
                      />
                    </div>
                    <div className="form-control w-full">
                      <label className="label">Nom</label>
                      <input
                        type="text"
                        placeholder="Nom"
                        name="nom"
                        value={editingAgent?.nom || ""}
                        onChange={(e) =>
                          setEditingAgent({
                            ...editingAgent,
                            nom: e.target.value,
                          })
                        }
                        className="input input-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                        required
                      />
                    </div>
                    <div className="form-control w-full">
                      <label className="label">Numéro de téléphone</label>
                      <input
                        type="text"
                        placeholder="Numéro de téléphone"
                        name="tel_number"
                        value={editingAgent?.tel_number || ""}
                        onChange={(e) =>
                          setEditingAgent({
                            ...editingAgent,
                            tel_number: e.target.value,
                          })
                        }
                        className="input input-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                        required
                      />
                    </div>
                    <div className="form-control w-full">
                      <label className="label">Email</label>
                      <input
                        type="email"
                        placeholder="Email"
                        name="mail"
                        value={editingAgent?.mail || ""}
                        onChange={(e) =>
                          setEditingAgent({
                            ...editingAgent,
                            mail: e.target.value,
                          })
                        }
                        className="input input-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                        required
                      />
                    </div>
                    <div className="form-control w-full">
                      <label className="label">Login</label>
                      <input
                        type="text"
                        placeholder="Login"
                        name="login"
                        value={editingAgent?.login || ""}
                        onChange={(e) =>
                          setEditingAgent({
                            ...editingAgent,
                            login: e.target.value,
                          })
                        }
                        className="input input-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                        required
                      />
                    </div>
                    <div className="form-control w-full">
                      <label className="label">Service</label>
                      <select
                        name="service"
                        value={editingAgent?.service || ""}
                        onChange={(e) =>
                          setEditingAgent({
                            ...editingAgent,
                            service: e.target.value,
                          })
                        }
                        className="select select-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                        required
                      >
                        {servicesData.map((directory) => (
                          <optgroup
                            key={directory.directory_id}
                            label={directory.nom_directory}
                          >
                            {directory.services.map((service) => (
                              <option key={service.id} value={service.id}>
                                {service.nom_service}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                    <div className="form-control w-full">
                      <label className="label">Fonction</label>
                      <select
                        name="fonction_id"
                        value={editingAgent?.fonction_id || ""}
                        onChange={(e) =>
                          setEditingAgent({
                            ...editingAgent,
                            fonction_id: e.target.value,
                          })
                        }
                        className="select select-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                        required
                      >
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.nom_role}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="modal-action flex justify-center items-center">
                      <button
                        type="submit"
                        className="btn flex justify-center items-center btn-primary w-[50%] bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg"
                      >
                        <PlusCircle className="mr-2" />
                        Mettre à jour
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-error w-[40%] mt-2"
                        onClick={handleCloseEditModal}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default AgentsPage;
