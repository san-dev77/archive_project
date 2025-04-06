import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import SideBar from "../Components/Side_bar";
import TopBar from "../Components/Top_bar"; // Assurez-vous que ce composant existe
import { Plus, ShieldCheck, SquarePen, Trash2 } from "lucide-react";
import { showDeleteConfirmation } from "../utils/alerts";

const UserRoles = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [editRoleId, setEditRoleId] = useState(null);
  const [editRoleName, setEditRoleName] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:3000/roles");
        if (Array.isArray(response.data)) {
          setRoles(response.data);
        } else {
          console.error(
            "La réponse de l'API n'est pas un tableau:",
            response.data
          );
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des rôles:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleAddRole = async (e) => {
    e.preventDefault();

    if (newRole.trim()) {
      try {
        const response = await axios.post("http://localhost:3000/roles", {
          nom_role: newRole,
        });
        if (response.data && response.data.id) {
          setRoles([...roles, response.data]);
          toast.success("Rôle ajouté avec succès!");
        } else {
          console.error(
            "La réponse de l'API pour l'ajout de rôle est incorrecte:",
            response.data
          );
          toast.error("Erreur lors de l'ajout du rôle.");
        }
        setNewRole("");
      } catch (error) {
        console.error("Erreur lors de l'ajout du rôle:", error);
        toast.error("Erreur lors de l'ajout du rôle.");
      }
    }
  };

  const handleDeleteRole = async (id) => {
    const confirm = await showDeleteConfirmation();
    alert(id);
    if (confirm) {
      try {
        await axios.delete(`http://localhost:3000/roles/${id}`);
        setRoles(roles.filter((role) => role.id !== id));
        toast.success("Rôle supprimé avec succès!");
      } catch (error) {
        console.error("Erreur lors de la suppression du rôle:", error);
        toast.error("Erreur lors de la suppression du rôle.");
      }
    }
  };

  const handleEditRole = (role) => {
    setEditRoleId(role.id);
    setEditRoleName(role.nom_role);
    setOpen(true);
  };

  const handleUpdateRole = async () => {
    if (editRoleName.trim()) {
      try {
        const response = await axios.put(
          `http://localhost:3000/roles/${editRoleId}`,
          { nom_role: editRoleName }
        );
        if (response.status === 200) {
          setRoles(
            roles.map((role) =>
              role.id === editRoleId
                ? { ...role, nom_role: editRoleName }
                : role
            )
          );
          toast.success("Rôle mis à jour avec succès!");
        } else {
          console.error(
            "La réponse de l'API pour la mise à jour du rôle est incorrecte:",
            response.data
          );
          toast.error("Erreur lors de la mise à jour du rôle.");
        }
        setEditRoleId(null);
        setEditRoleName("");
        setOpen(false);
      } catch (error) {
        console.error("Erreur lors de la mise à jour du rôle:", error);
        toast.error("Erreur lors de la mise à jour du rôle.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-300">
      <SideBar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar title="Gestion des Rôles" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-gray-800 w-full rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <ShieldCheck className="h-8 w-8 text-[#00B7FF] mr-2" />
                Liste des Rôles
              </h1>
              <button
                onClick={() => setOpen(true)}
                className="bg-white hover:bg-gray-700 text-black hover:text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nouveau Rôle
              </button>
            </div>

            <div className="bg-[#3a3a3a] rounded-lg p-4">
              <div className="overflow-hidden rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#2a2a2a]">
                      <th className="p-5 text-left w-16"></th>
                      <th className="p-5 text-left text-sm font-medium text-white">
                        Nom du rôle
                      </th>
                      <th className="p-5 text-right text-sm font-medium text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role, index) => (
                      <tr
                        key={role.id}
                        className="border-t border-[#4a4a4a] hover:bg-[#2a2a2a] transition-colors duration-200"
                      >
                        <td className="p-5">
                          <div className="bg-[#00B7FF] rounded-lg p-2 w-fit">
                            <ShieldCheck size={20} className="text-white" />
                          </div>
                        </td>
                        <td className="p-5 text-white font-medium">
                          {role.nom_role}
                        </td>
                        <td className="p-5">
                          <div className="flex justify-end space-x-2">
                            {index >= 2 && (
                              <>
                                <button
                                  onClick={() => handleEditRole(role)}
                                  className="p-2 text-[#00B7FF] hover:bg-[#404040] rounded-lg transition-colors duration-200"
                                >
                                  <SquarePen className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRole(role.id)}
                                  className="p-2 text-red-500 hover:bg-[#404040] rounded-lg transition-colors duration-200"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#2a2a2a] rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  {editRoleId ? "Modifier le rôle" : "Ajouter un nouveau rôle"}
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={editRoleId ? handleUpdateRole : handleAddRole}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white mb-1">
                    Nom du rôle
                  </label>
                  <input
                    type="text"
                    value={editRoleId ? editRoleName : newRole}
                    onChange={(e) =>
                      editRoleId
                        ? setEditRoleName(e.target.value)
                        : setNewRole(e.target.value)
                    }
                    className="w-full px-3 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#4a4a4a] rounded-lg hover:bg-[#5a5a5a] focus:outline-none focus:ring-2 focus:ring-[#6a6a6a]"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-[#00B7FF] rounded-lg hover:bg-[#0096FF] focus:outline-none focus:ring-2 focus:ring-[#00B7FF]"
                  >
                    {editRoleId ? "Mettre à jour" : "Ajouter"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default UserRoles;
