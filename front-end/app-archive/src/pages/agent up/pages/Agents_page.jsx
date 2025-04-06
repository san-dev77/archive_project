import { useState, useEffect } from "react";
import user_icone from "../../../assets/icones/user_icone.png";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaUserTie,
  FaPhoneAlt,
  FaEnvelope,
  FaIdCard,
  FaBuilding,
} from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/Sidebar_up";
import { Tooltip } from "@mui/material";
import Swal from "sweetalert2";
import TopBar_up from "../components/Topbar_up";

const Agents_page = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [agentsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [editingAgent, setEditingAgent] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid ou list
  const [openModal, setOpenModal] = useState(false);
  const [newAgent, setNewAgent] = useState({
    prenom: "",
    nom: "",
    mail: "",
    tel_number: "",
    login: "",
    password: "",
    service: "",
    fonction_id: "",
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const directoryId = localStorage.getItem("directory_id");
      if (!directoryId) {
        toast.error("ID de direction non trouvé");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:3000/agents/dir_agents/${directoryId}`
      );
      setAgents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des agents:", error);
      toast.error("Erreur lors de la récupération des agents");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Voulez-vous vraiment supprimer cet agent?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/agent/remove-agent/${id}`);
        Swal.fire({
          title: "Supprimé!",
          text: "L'agent a été supprimé avec succès.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchAgents();
      } catch (error) {
        console.error("Erreur lors de la suppression de l'agent:", error);
        Swal.fire(
          "Erreur!",
          "Erreur lors de la suppression de l'agent.",
          "error"
        );
      }
    }
  };

  const handleEdit = (agent) => {
    setEditingAgent(agent);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditingAgent(null);
  };

  const handleUpdateAgent = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/agents/update-agent/${editingAgent.id}`,
        editingAgent
      );
      fetchAgents();
      setOpenEditModal(false);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Agent mis à jour avec succès!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'agent:", error);
      Swal.fire(
        "Erreur!",
        "Erreur lors de la mise à jour de l'agent.",
        "error"
      );
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewAgent({
      prenom: "",
      nom: "",
      mail: "",
      tel_number: "",
      login: "",
      password: "",
      service: "",
      fonction_id: "",
    });
  };

  const handleAddAgent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/agents/create-agent",
        newAgent
      );
      if (response.data) {
        Swal.fire({
          title: "Succès!",
          text: "Agent créé avec succès!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        handleCloseModal();
        fetchAgents();
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'agent:", error);
      Swal.fire("Erreur!", "Erreur lors de la création de l'agent.", "error");
    }
  };

  // Filtrer les agents en fonction du terme de recherche
  const filteredAgents = agents.filter(
    (agent) =>
      agent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.mail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agent.nom_service &&
        agent.nom_service.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (agent.nom_role &&
        agent.nom_role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const indexOfLastAgent = currentPage * agentsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
  const currentAgents = filteredAgents.slice(
    indexOfFirstAgent,
    indexOfLastAgent
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Pagination component
  const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center mt-6">
        <div className="flex space-x-2 bg-gray-100 p-2 rounded-lg shadow">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded-md transition-all duration-300 ${
                currentPage === number
                  ? "bg-blue-600 text-white shadow-md transform scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Fonction pour obtenir une couleur aléatoire pour les avatars
  const getRandomGradient = (id) => {
    const gradients = [
      "from-blue-600 to-violet-500",
      "from-emerald-300 to-cyan-300",
      "from-indigo-500 to-purple-700",
      "from-sky-300 to-blue-300",
      "from-teal-600 to-emerald-500",
      "from-violet-300 to-indigo-300",
      "from-cyan-500 to-sky-800",
      "from-purple-600 to-fuchsia-800",
      "from-slate-500 to-gray-700",
      "from-zinc-300 to-neutral-300",
      "from-stone-600 to-slate-600",
      "from-red-300 to-orange-300",
    ];
    return gradients[id % gradients.length];
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar_up position="fixed" title="Gestion des Agents" />
        <div className="container mx-auto px-4 py-8 mt-20">
          <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Agents de la Direction
                </h1>
                <p className="text-gray-500">
                  {filteredAgents?.length} agent(s) trouvé(s)
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un agent..."
                    className="px-4 py-3 pl-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-80 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg ${
                      viewMode === "grid"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg ${
                      viewMode === "list"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={handleOpenModal}
                  className="btn bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 py-3 rounded-xl flex items-center shadow-lg transform transition-transform hover:scale-105"
                >
                  <FaPlus className="mr-2" />
                  Ajouter un agent
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentAgents.length > 0 ? (
                  currentAgents.map((agent) => (
                    <div
                      key={agent.id}
                      className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`avatar bg-gradient-to-r ${getRandomGradient(
                              agent.id
                            )} p-2 rounded-xl shadow-lg`}
                          >
                            <div className="mask mask-squircle h-16 w-16 overflow-hidden">
                              <img
                                src={user_icone}
                                alt="Avatar"
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-bold text-xl">
                              {agent.prenom}
                            </h3>
                            <p className="text-gray-300 font-medium">
                              {agent.nom}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Tooltip title="Modifier" arrow placement="left">
                            <button
                              onClick={() => handleEdit(agent)}
                              className="btn btn-circle bg-blue-600 hover:bg-indigo-700 transition duration-300 shadow-lg"
                            >
                              <FaEdit className="text-white" />
                            </button>
                          </Tooltip>
                          <Tooltip title="Supprimer" arrow placement="left">
                            <button
                              onClick={() => handleDelete(agent.id)}
                              className="btn btn-circle bg-red-600 hover:bg-red-700 transition duration-300 shadow-lg"
                            >
                              <FaTrash className="text-white" />
                            </button>
                          </Tooltip>
                        </div>
                      </div>

                      <div className="space-y-4 mt-4">
                        <div className="flex items-center gap-3">
                          <FaUserTie className="text-blue-400" />
                          <span className="font-semibold text-gray-400">
                            Fonction:
                          </span>
                          <span className="bg-gradient-to-r from-blue-600 to-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {agent.nom_role || "Non assigné"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaBuilding className="text-blue-400" />
                          <span className="font-semibold text-gray-400">
                            Service:
                          </span>
                          <span className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                            {agent.nom_service || "Non assigné"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaPhoneAlt className="text-blue-400" />
                          <span className="font-semibold text-gray-400">
                            Téléphone:
                          </span>
                          <span>{agent.tel_number || "Non renseigné"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaEnvelope className="text-blue-400" />
                          <span className="font-semibold text-gray-400">
                            Email:
                          </span>
                          <span className="text-blue-400 underline">
                            {agent.mail}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaIdCard className="text-blue-400" />
                          <span className="font-semibold text-gray-400">
                            Identifiant:
                          </span>
                          <span className="bg-gradient-to-r from-gray-600 to-gray-700 px-3 py-1 rounded-lg font-mono">
                            {agent.login}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mx-auto text-gray-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p className="text-gray-500 text-xl">Aucun agent trouvé</p>
                    <p className="text-gray-400 mt-2">
                      Essayez de modifier vos critères de recherche
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-md">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="py-3 px-4 text-left">Agent</th>
                      <th className="py-3 px-4 text-left">Fonction</th>
                      <th className="py-3 px-4 text-left">Service</th>
                      <th className="py-3 px-4 text-left">Contact</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentAgents.length > 0 ? (
                      currentAgents.map((agent) => (
                        <tr
                          key={agent.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`avatar bg-gradient-to-r ${getRandomGradient(
                                  agent.id
                                )} p-1 rounded-full`}
                              >
                                <div className="mask mask-circle h-10 w-10">
                                  <img src={user_icone} alt="Avatar" />
                                </div>
                              </div>
                              <div>
                                <p className="font-medium">
                                  {agent.prenom} {agent.nom}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {agent.login}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              {agent.nom_role || "Non assigné"}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-lg text-[10px] truncate max-w-xs">
                              {agent.nom_service || "Non assigné"}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <p className="text-sm  text-gray-700 flex items-center">
                                <FaEnvelope className="mr-2 text-gray-700" />{" "}
                                {agent.mail}
                              </p>
                              <p className="text-sm  text-gray-700 flex items-center">
                                <FaPhoneAlt className="mr-2 text-gray-700" />{" "}
                                {agent.tel_number || "Non renseigné"}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex justify-center gap-2">
                              <Tooltip title="Modifier" arrow>
                                <button
                                  onClick={() => handleEdit(agent)}
                                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                  <FaEdit />
                                </button>
                              </Tooltip>
                              <Tooltip title="Supprimer" arrow>
                                <button
                                  onClick={() => handleDelete(agent.id)}
                                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                >
                                  <FaTrash />
                                </button>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-8 text-center text-gray-500"
                        >
                          Aucun agent trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <Pagination
              itemsPerPage={agentsPerPage}
              totalItems={filteredAgents.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>

      {/* Modal pour éditer un agent */}
      <div
        className={`fixed inset-0 z-50 overflow-y-auto ${
          openEditModal ? "visible" : "invisible"
        }`}
      >
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleCloseEditModal}
        ></div>
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="relative z-50 w-full max-w-2xl bg-white rounded-xl shadow-2xl">
            <div className="p-8 max-h-[90vh] overflow-y-auto">
              <button
                onClick={handleCloseEditModal}
                className="absolute right-4 text-black top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ✕
              </button>
              <h2 className="text-2xl text-black font-bold mb-6 border-b pb-4">
                Modifier l&apos;agent
              </h2>
              <form className="overflow-y-auto" onSubmit={handleUpdateAgent}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control w-full">
                    <label className="label font-medium">Prénom</label>
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
                      className="input input-bordered w-full mb-4 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label font-medium">Nom</label>
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
                      className="input input-bordered w-full mb-4 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="form-control w-full">
                  <label className="label font-medium">Email</label>
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
                    className="input input-bordered w-full mb-4 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label font-medium">Téléphone</label>
                  <input
                    type="text"
                    placeholder="Téléphone"
                    name="tel_number"
                    value={editingAgent?.tel_number || ""}
                    onChange={(e) =>
                      setEditingAgent({
                        ...editingAgent,
                        tel_number: e.target.value,
                      })
                    }
                    className="input input-bordered w-full mb-4 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="modal-action flex justify-center items-center gap-4 mt-8">
                  <button
                    type="submit"
                    className="btn flex justify-center items-center btn-primary w-[50%] bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 transition duration-300 rounded-lg py-3"
                  >
                    <FaEdit className="mr-2" />
                    Mettre à jour
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white w-[40%] transition-all duration-300 rounded-lg py-3"
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

      {/* Modal pour créer un agent */}
      <div
        className={`fixed inset-0 z-50 overflow-y-auto ${
          openModal ? "visible" : "invisible"
        }`}
      >
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleCloseModal}
        ></div>
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="relative z-50 w-full max-w-2xl bg-white rounded-xl shadow-2xl">
            <div className="p-6 max-h-[90vh] overflow-y-auto text-black">
              <button
                onClick={handleCloseModal}
                className="absolute p-2 rounded-full bg-gray-900 text-white right-4 top-4 hover:bg-gray-100 hover:text-black transition-colors"
              >
                ✕
              </button>
              <h2 className="text-2xl text-black font-bold mb-6">
                Créer un nouvel agent
              </h2>
              <form className="overflow-y-auto" onSubmit={handleAddAgent}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control w-full">
                    <label className="label font-medium">Prénom</label>
                    <input
                      type="text"
                      placeholder="Prénom"
                      value={newAgent.prenom}
                      onChange={(e) =>
                        setNewAgent({ ...newAgent, prenom: e.target.value })
                      }
                      className="input input-bordered w-full mb-4 bg-gray-50 text-gray-800"
                      required
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label font-medium">Nom</label>
                    <input
                      type="text"
                      placeholder="Nom"
                      value={newAgent.nom}
                      onChange={(e) =>
                        setNewAgent({ ...newAgent, nom: e.target.value })
                      }
                      className="input input-bordered w-full mb-4 bg-gray-50 text-gray-800"
                      required
                    />
                  </div>
                </div>
                <div className="form-control w-full">
                  <label className="label font-medium">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={newAgent.mail}
                    onChange={(e) =>
                      setNewAgent({ ...newAgent, mail: e.target.value })
                    }
                    className="input input-bordered w-full mb-4 bg-gray-50 text-gray-800"
                    required
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label font-medium">Téléphone</label>
                  <input
                    type="text"
                    placeholder="Téléphone"
                    value={newAgent.tel_number}
                    onChange={(e) =>
                      setNewAgent({ ...newAgent, tel_number: e.target.value })
                    }
                    className="input input-bordered w-full mb-4 bg-gray-50 text-gray-800"
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label font-medium">Login</label>
                  <input
                    type="text"
                    placeholder="Login"
                    value={newAgent.login}
                    onChange={(e) =>
                      setNewAgent({ ...newAgent, login: e.target.value })
                    }
                    className="input input-bordered w-full mb-4 bg-gray-50 text-gray-800"
                    required
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label font-medium">Mot de passe</label>
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    value={newAgent.password}
                    onChange={(e) =>
                      setNewAgent({ ...newAgent, password: e.target.value })
                    }
                    className="input input-bordered w-full mb-4 bg-gray-50 text-gray-800"
                    required
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label font-medium">Service</label>
                  <input
                    type="text"
                    placeholder="Service"
                    value={newAgent.service}
                    onChange={(e) =>
                      setNewAgent({ ...newAgent, service: e.target.value })
                    }
                    className="input input-bordered w-full mb-4 bg-gray-50 text-gray-800"
                    required
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label font-medium">Fonction</label>
                  <input
                    type="text"
                    placeholder="Fonction"
                    value={newAgent.fonction_id}
                    onChange={(e) =>
                      setNewAgent({ ...newAgent, fonction_id: e.target.value })
                    }
                    className="input input-bordered w-full mb-4 bg-gray-50 text-gray-800"
                    required
                  />
                </div>
                <div className="modal-action flex justify-center items-center gap-4">
                  <button
                    type="submit"
                    className="btn flex justify-center items-center btn-primary w-[50%] bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
                  >
                    <FaPlus className="mr-2" />
                    Créer
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-error w-[40%]"
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

      <ToastContainer position="top-right" />
    </div>
  );
};

export default Agents_page;
