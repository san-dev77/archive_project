import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'daisyui/dist/full.css';
import SideBar from '../Components/Side_bar';
import TopBar from '../Components/Top_bar'; // Assurez-vous que ce composant existe
import { LayoutList, Plus, SquarePen, Trash2 } from 'lucide-react';

const UserRoles = () => {
    const [roles, setRoles] = useState([]);
    const [newRole, setNewRole] = useState('');
    const [editRoleId, setEditRoleId] = useState(null);
    const [editRoleName, setEditRoleName] = useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('http://localhost:3000/roles');
                if (Array.isArray(response.data)) {
                    setRoles(response.data);
                } else {
                    console.error('La réponse de l\'API n\'est pas un tableau:', response.data);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des rôles:', error);
            }
        };

        fetchRoles();
    }, []);

    const handleAddRole = async (e) => {
        e.preventDefault();

        if (newRole.trim()) {
            try {
                const response = await axios.post('http://localhost:3000/roles', { nom_role: newRole });
                if (response.data && response.data.id) {
                    setRoles([...roles, response.data]);
                    toast.success('Rôle ajouté avec succès!');
                } else {
                    console.error('La réponse de l\'API pour l\'ajout de rôle est incorrecte:', response.data);
                    toast.error('Erreur lors de l\'ajout du rôle.');
                }
                setNewRole('');
            } catch (error) {
                console.error('Erreur lors de l\'ajout du rôle:', error);
                toast.error('Erreur lors de l\'ajout du rôle.');
            }
        }
    };

    const handleDeleteRole = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/roles/${id}`);
            setRoles(roles.filter(role => role.id !== id));
            toast.success('Rôle supprimé avec succès!');
        } catch (error) {
            console.error('Erreur lors de la suppression du rôle:', error);
            toast.error('Erreur lors de la suppression du rôle.');
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
                const response = await axios.put(`http://localhost:3000/roles/${editRoleId}`, { nom_role: editRoleName });
                if (response.status === 200) {
                    setRoles(roles.map(role => role.id === editRoleId ? { ...role, nom_role: editRoleName } : role));
                    toast.success('Rôle mis à jour avec succès!');
                } else {
                    console.error('La réponse de l\'API pour la mise à jour du rôle est incorrecte:', response.data);
                    toast.error('Erreur lors de la mise à jour du rôle.');
                }
                setEditRoleId(null);
                setEditRoleName('');
                setOpen(false);
            } catch (error) {
                console.error('Erreur lors de la mise à jour du rôle:', error);
                toast.error('Erreur lors de la mise à jour du rôle.');
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-300">
            <SideBar isVisible={true} />
            <div className="flex-1  flex flex-col">
                <TopBar title="Gestion des Rôles" /> {/* Assurez-vous que TopBar accepte un titre */}
                <div className="container w-[90%] mx-auto mt-2 bg-white rounded-xl shadow-2xl flex flex-col h-screen">
                    <h1 className="text-2xl font-extrabold text-gray-800 flex justify-start w-full">
                        <LayoutList size="28px" className="mr-3 text-gray-800" />
                        Liste des Rôles
                    </h1>
                    <div className="divider"></div>
                    <div className="bg-white w-full rounded-lg shadow-md p-6 mb-6">
                        <div className="flex gap-4 mb-6">
                            <input
                                type="text"
                                placeholder="Nouveau rôle"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                className="input input-bordered w-full max-w-xs bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                            />
                            <button
                                className="btn btn-primary bg-gray-500 text-white hover:bg-gray-800 transition duration-300 rounded-lg shadow-md"
                                onClick={handleAddRole}
                            >
                                <Plus size={20} className="mr-2" />
                                Ajouter
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <div className="max-h-96 overflow-y-auto">
                                <table className="table w-full border-collapse">
                                    <thead className="sticky top-0 rounded-lg bg-gray-300 text-black">
                                        <tr>
                                            <th className="text-lg p-4">Nom du rôle</th>
                                            <th className="text-lg p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roles.map((role, index) => (
                                            <tr key={role.id} className={`hover:bg-gray-100 transition duration-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                                <td className="p-4 text-base text-gray-800">{role.nom_role}</td>
                                                <td className="text-right p-4 text-base text-gray-800">
                                                    <button className="btn btn-outline btn-primary btn-sm mr-2 hover:bg-indigo-100 transition duration-300 rounded-md" onClick={() => handleEditRole(role)}>
                                                        <SquarePen className="mr-1" />
                                                    </button>
                                                    <button className="btn btn-outline btn-error btn-sm hover:bg-red-400 transition duration-300 rounded-md" onClick={() => handleDeleteRole(role.id)}>
                                                        <Trash2 className="mr-1" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {open && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setOpen(false)}>
                    <div className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg w-full flex flex-col justify-center items-center" onClick={(e) => e.stopPropagation()}>
                        <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => setOpen(false)}>✕</button>
                        <h2 className="text-2xl font-bold mb-4">
                            {editRoleId ? 'Modifier le rôle' : 'Créer un nouveau rôle'}
                        </h2>
                        
                        <form onSubmit={editRoleId ? handleUpdateRole : handleAddRole} className="w-full">
                            <div className="form-control w-full">
                                <label className="label">Nom du rôle</label>
                                <input
                                    type="text"
                                    placeholder="Nom du rôle"
                                    value={editRoleId ? editRoleName : newRole}
                                    onChange={(e) => editRoleId ? setEditRoleName(e.target.value) : setNewRole(e.target.value)}
                                    required
                                    className="input input-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                                />
                            </div>
                            <div className="modal-action flex justify-center items-center">
                                <button type="submit" className="btn flex justify-center items-center btn-primary w-[50%] bg-indigo-600 text-white hover:bg-indigo-700 transition duration-300 rounded-lg">
                                    <Plus className="mr-2" />
                                    {editRoleId ? 'Mettre à jour' : 'Créer'}
                                </button>
                                <button type="button" className="btn btn-outline btn-error w-[40%] mt-2" onClick={() => setOpen(false)}>Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default UserRoles;