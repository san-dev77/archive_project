import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar_UI from '../components_UI/Sidebar_UI';
import { FileBadge2, Grid, Grip, LayoutDashboard, SquarePen, Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'daisyui/dist/full.css';
import TopBar_UI from '../components_UI/Top_bar_UI';
import { Tooltip } from '@mui/material';

const Pieces_UI = () => {
  const [pieces, setPieces] = useState([]);
  const [newPiece, setNewPiece] = useState({ code_piece: '', nom_piece: '' });
  const [editingPiece, setEditingPiece] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPieces();
  }, []);

  const fetchPieces = async () => {
    try {
      const response = await axios.get('http://localhost:3000/pieces');
      setPieces(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des pièces:", error);
      toast.error('Erreur lors de la récupération des pièces');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPiece({ ...newPiece, [name]: value });
  };

  const handleAddPiece = async () => {
    try {
      const response = await axios.post('http://localhost:3000/pieces', newPiece);
      setPieces([...pieces, response.data]);
      setNewPiece({ code_piece: '', nom_piece: '' });
      toast.success('Pièce ajoutée avec succès !');
    } catch (error) {
      console.error("Erreur lors de l'ajout de la pièce:", error);
      toast.error("Erreur lors de l'ajout de la pièce");
    }
  };

  const handleDeletePiece = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette pièce ?')) {
      try {
        await axios.delete(`http://localhost:3000/pieces/${id}`);
        setPieces(pieces.filter(piece => piece.id !== id));
        toast.success('Pièce supprimée avec succès !');
      } catch (error) {
        console.error("Erreur lors de la suppression de la pièce:", error);
        toast.error("Erreur lors de la suppression de la pièce");
      }
    }
  };

  const handleEditClick = (piece) => {
    setEditingPiece(piece);
    setNewPiece({ code_piece: piece.code_piece, nom_piece: piece.nom_piece });
    setIsEditing(true);
  };

  const handleUpdatePiece = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/pieces/${editingPiece.id}`, newPiece);
      setPieces(pieces.map(p => p.id === editingPiece.id ? response.data : p));
      setNewPiece({ code_piece: '', nom_piece: '' });
      setIsEditing(false);
      setEditingPiece(null);
      toast.success('Pièce modifiée avec succès !');
    } catch (error) {
      console.error("Erreur lors de la modification de la pièce:", error);
      toast.error("Erreur lors de la modification de la pièce");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar_UI  isVisible={true}/>
      <TopBar_UI  />

      <div className="flex-1 flex flex-col">
        <div className="container w-[90%] mx-auto mt-24 bg-white rounded-xl shadow-2xl flex flex-col h-screen">
          <h1 className="text-2xl font-extrabold text-gray-800 flex justify-center items-center gap-2">
            <LayoutDashboard  size="30" />
            Liste des pièces
          </h1>
          <div className="divider"></div>
          <div className="bg-white w-full rounded-lg shadow-md p-6 mb-6">
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Code de la pièce..."
                name="code_piece"
                value={newPiece.code_piece}
                onChange={handleInputChange}
                className="input input-bordered w-full max-w-xs bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
              />
              <input
                type="text"
                placeholder="Nom de la pièce..."
                name="nom_piece"
                value={newPiece.nom_piece}
                onChange={handleInputChange}
                className="input input-bordered w-full max-w-xs bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
              />
              <button
                className="btn btn-primary ml-auto bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg shadow-md"
                onClick={isEditing ? handleUpdatePiece : handleAddPiece}
              >
                {isEditing ? 'Modifier Pièce' : 'Ajouter Pièce'}
              </button>
            </div>
            <div className="divider" style={{ borderTop: '1px solid #000', margin: '1.5rem 0'}}></div>
            <div className="overflow-x-auto">
              <div className="max-h-96 overflow-y-auto">
                <table className="table w-full border-collapse">
                  <thead className="sticky top-0 rounded-lg bg-gray-400 text-black">
                    <tr>
                      <th className="text-lg p-4"></th>
                      
                      <th className="text-lg p-4">Code</th>
                      <td className="">|</td>
                      <th className="text-lg p-4">Nom</th>
                      <td className="">|</td>
                      <th className="text-lg p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pieces.map((piece, index) => (
                      <tr key={piece.id} className={`hover:bg-gray-100 transition duration-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <td className="flex items-center justify-center p-2 text-base text-gray-800">
                        <FileBadge2 style={{color:"#333"}}  size="30" />
                        </td>
                        <td className="">|</td>
                        <td className="flex items-center justify-center p-2 text-base text-gray-800">
                          {piece.code_piece}
                        </td>
                        <td className="">|</td>
                        <td className="flex items-center p-4 text-base text-gray-800">
                          {piece.nom_piece}
                        </td>
                        <td className="">|</td>
                        <td className="text-right p-4 text-base text-gray-800">
                          <div className="flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-2">
                          <Tooltip title="Modifier">
                           <button 
                             className="btn btn-outline btn-primary btn-sm w-full sm:w-auto hover:bg-indigo-100 transition duration-300 rounded-md"
                             onClick={() => handleEditClick(piece)}
                           >
                             <SquarePen size="20" />
                             
                              
                            </button>
                           
                           </Tooltip>
                           <Tooltip title="Supprimer">
                           <button 
                             className="btn btn-outline btn-error btn-sm w-full sm:w-auto hover:bg-red-100 transition duration-300 rounded-md"
                             onClick={() => handleDeletePiece(piece.id)}
                           >
                             <Trash2 size="20" />
                             
                              
                            </button>
                           
                           </Tooltip>
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
      </div>
      <ToastContainer />
    </div>
  );
};

export default Pieces_UI;
