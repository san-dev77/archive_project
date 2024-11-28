import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CircleUserRound,
  Plus,
  PlusCircle,
  SquarePenIcon,
  Trash2Icon,
  UserRoundCogIcon,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "../Components/Side_bar";
import TopBar from "../Components/Top_bar";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import axios from "axios";

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [services, setServices] = useState([]);
  const [roles, setRoles] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [newAgent, setNewAgent] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    service: "",
    login: "",
    password: "",
    fonction_id: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [editingAgent, setEditingAgent] = useState(null);
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      const response = await fetch("http://localhost:3000/agents/");
      const data = await response.json();
      setAgents(data);
      setFilteredAgents(data);
    };
    fetchAgents();

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
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();

    const fetchRoles = async () => {
      const response = await fetch("http://localhost:3000/roles");
      const data = await response.json();
      setRoles(data);
    };
    fetchRoles();

    const fetchProfiles = async () => {
      const response = await fetch("http://localhost:3000/profil");
      const data = await response.json();
      setProfiles(data);
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
      const response = await fetch(
        "http://localhost:3000/agents/create-agent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newAgent }),
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
      });
      toast.success("Agent créé avec succès!", toastOptions);
    } catch (error) {
      toast.error(
        "Erreur lors de l'ajout de l'agent: " + error.message,
        toastOptions
      );
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
    } catch (error) {
      return error;
    }
  };

  const handleDelete = async (agentId) => {
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
      } else {
        const errorText = await response.text();
        throw new Error(`Erreur lors de la requête: ${errorText}`);
      }
    } catch (error) {
      return error;
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

  return (
    <div className="flex min-h-screen bg-gray-300">
      <SideBar isVisible={true} className="w-64" />
      <div className="flex-1 w-[70%] flex mt-20 flex-col">
        <TopBar position="fixed" title="Agents" />
        <div className="container h-full w-[90%] mx-auto mt-2 bg-white rounded-xl shadow-2xl flex flex-col ">
          <h4 className="text-2xl font-extrabold text-gray-800 mb-4 flex items-center">
            <CircleUserRound size="32px" className="mr-2" />
            Gestion des Agents
          </h4>

          <div className="bg-white w-full rounded-lg shadow-md p-6 mb-6">
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Rechercher un agent"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="input input-bordered w-full max-w-xs bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              <button
                className="btn btn-primary ml-auto bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg shadow-md"
                onClick={handleOpenModal}
              >
                <Plus size={20} className="mr-2" />
                Nouveau
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="max-h-96 overflow-y-auto">
                <table className="table w-full border-collapse">
                  <thead className="sticky top-0 rounded-lg bg-gray-300 text-black">
                    <tr>
                      <th></th>
                      <th>Prénom</th>
                      <th>Nom</th>
                      <th>Numéro de téléphone</th>
                      <th>Email</th>
                      <th>Fonction</th>
                      <th>Login</th>
                      <th>Mot de passe</th>
                      <th>Service</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAgents.map((agent, index) => (
                      <tr
                        key={agent.id}
                        className={`hover:bg-gray-100 transition duration-200 ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td>
                          <UserRoundCogIcon className="text-blue-600 mr-2" />
                        </td>
                        <td>{agent.prenom}</td>
                        <td>{agent.nom}</td>
                        <td>{agent.tel_number}</td>
                        <td>{agent.mail}</td>
                        <td>{agent.nom_role}</td>
                        <td>{agent.login}</td>
                        <td>
                          <div>
                            <span>
                              {passwordVisibility[agent.id]
                                ? agent.password
                                : "••••••••"}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(agent.id)}
                              className="btn btn-ghost btn-xs"
                            >
                              {passwordVisibility[agent.id] ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </button>
                          </div>
                        </td>
                        <td>{agent.nom_service}</td>
                        <td className="text-right flex flex-col justify-center   gap-2 items-center p-2 text-base text-gray-800">
                          <Tooltip title="Modifier">
                            <button
                              onClick={() => handleEdit(agent)}
                              className="btn btn-outline btn-primary btn-sm mr-2 hover:bg-indigo-100 transition duration-300 rounded-md"
                            >
                              <SquarePenIcon className="text-blue-600" />
                            </button>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <button
                              onClick={() => handleDelete(agent.id)}
                              className="btn btn-outline btn-error btn-sm hover:bg-red-400 transition duration-300 rounded-md"
                            >
                              <Trash2Icon className="text-red-600" />
                            </button>
                          </Tooltip>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Modal for creating agents */}
          <div className={`modal ${openModal ? "modal-open" : ""}`}>
            <div className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg flex flex-col justify-center items-center">
              <h2 className="text-2xl font-bold mb-4">Créer un nouvel agent</h2>
              <form className="overflow-y-auto" onSubmit={handleAddAgent}>
                <div className="form-control w-full">
                  <label className="label">Prénom</label>
                  <input
                    type="text"
                    placeholder="Prénom"
                    name="prenom"
                    value={newAgent.prenom}
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
                    type={showPassword ? "text" : "password"}
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
                    onChange={handleInputChange}
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
                <div className="modal-action flex justify-center items-center">
                  <button
                    type="submit"
                    className="btn flex justify-center items-center btn-primary w-[50%] bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg"
                  >
                    <PlusCircle className="mr-2" />
                    Créer
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-error w-[40%] mt-2"
                    onClick={handleCloseModal}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Modal for editing agents */}
          <div className={`modal ${openEditModal ? "modal-open" : ""}`}>
            <div className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg flex flex-col justify-center items-center">
              <h2 className="text-2xl font-bold mb-4">Modifier l'agent</h2>
              <form className="overflow-y-auto" onSubmit={handleUpdateAgent}>
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
                      setEditingAgent({ ...editingAgent, nom: e.target.value })
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
                      setEditingAgent({ ...editingAgent, mail: e.target.value })
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

          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default AgentsPage;
