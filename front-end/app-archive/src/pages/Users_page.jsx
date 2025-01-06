import React, { useState, useEffect } from "react";
import user_icone from "../assets/icones/user_icone.png";
import {
  CirclePlus,
  LayoutList,
  Plus,
  PlusCircle,
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

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [services, setServices] = useState([]);
  const [roles, setRoles] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
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
    <div className="flex min-h-screen bg-gray-300">
      <SideBar isVisible={true} className="w-64" />
      <div className="flex-1 w-[70%] flex mt-20 flex-col">
        <TopBar position="fixed" title="Agents" />
        <div className="container h-full w-[90%] mx-auto mt-10 bg-white rounded-xl shadow-2xl flex flex-col ">
          <h4 className="text-2xl font-extrabold mt-2 text-gray-800 mb-4 flex items-center">
            <LayoutList size="32px" className="mr-2" />
            Gestion des Agents
          </h4>

          <div className="bg-white h-full w-full rounded-lg shadow-md p-6 mb-6">
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Rechercher un agent"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="input input-bordered w-full max-w-xs bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              <button
                className="btn btn-primary ml-auto bg-gray-600 text-white hover:bg-gray-400 transition duration-300 rounded-lg shadow-md"
                onClick={handleOpenModal}
              >
                <Plus size={20} className="mr-2" />
                Nouveau
              </button>
              <button
                className="btn btn-secondary ml-2 bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg shadow-md"
                onClick={handleOpenRoleOptionsModal}
              >
                <Plus size={20} className="mr-2" />
                Nouveau Rôle
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="table rounded-lg">
                {/* head */}
                <thead className="bg-gray-700  rounded-lg text-white text-[18px]">
                  <tr>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <th>Nom et Prénom</th>
                    <th>Portable</th>
                    <th>Email</th>
                    <th>Fonction</th>
                    <th>Login</th>
                    <th>Mot de passe</th>
                    <th>Service</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {filteredAgents.map((agent, index) => (
                    <tr
                      key={agent.id}
                      className={`hover:bg-gray-100 transition duration-200 ${
                        index % 2 === 0 ? "bg-gray-200" : "bg-white"
                      }`}
                    >
                      <th>
                        <label className="">
                          <input
                            type="checkbox"
                            className="checkbox border-black"
                          />
                        </label>
                      </th>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle h-12 w-12">
                              <img src={user_icone} alt="Avatar" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{agent.prenom}</div>
                            <div className="text-sm opacity-50">
                              {agent.nom}
                            </div>
                          </div>
                        </div>
                      </td>
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

                      <td className="text-right flex flex-col justify-center gap-2 items-center p-2 text-base text-gray-800">
                        <Tooltip title="Modifier">
                          <button
                            onClick={() => handleEdit(agent)}
                            className="btn btn-outline bg-gray-600 btn-md  mr-2 hover:bg-indigo-500 transition duration-300 rounded-md"
                          >
                            <SquarePenIcon className="text-white" />
                          </button>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <button
                            onClick={() => handleDelete(agent.id)}
                            className="btn btn-outline bg-gray-600 btn-md  hover:bg-red-500 transition duration-300 rounded-md"
                          >
                            <Trash2Icon className="text-white" />
                          </button>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

          {/* Modale pour les options de rôle */}
          <div className={`modal ${showRoleOptionsModal ? "modal-open" : ""}`}>
            <div className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg flex flex-col justify-center items-center">
              <h2 className="text-2xl font-bold mb-4">Options de Rôle</h2>
              <div className="flex items-center justify-center gap-5 w-full">
                <button
                  onClick={handleOpenRoleModal}
                  className="btn btn-outline btn-default mb-2 flex items-center justify-center text-black"
                >
                  <CirclePlus /> Créer un nouveau rôle
                </button>
                <button
                  onClick={() => {
                    window.location.href = "/UserRoles";
                  }}
                  className="btn btn-outline btn-default flex items-center justify-center text-black"
                >
                  <LayoutList /> Voir la liste des rôles
                </button>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-error w-full mt-4"
                onClick={() => setShowRoleOptionsModal(false)}
              >
                Annuler
              </button>
            </div>
          </div>

          {/* Modal for creating roles */}
          <div className={`modal ${showRoleModal ? "modal-open" : ""}`}>
            <div className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg flex flex-col justify-center items-center">
              <h2 className="text-2xl font-bold mb-4">Créer un nouveau rôle</h2>
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
