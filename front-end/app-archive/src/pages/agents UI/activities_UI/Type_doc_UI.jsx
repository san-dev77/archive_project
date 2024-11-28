import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Side_bar from '../components_UI/Sidebar_UI';
import TopBar from '../../../Components/Top_bar';
import { Layers3, Plus, ServerOff, SquarePen, Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'daisyui/dist/full.css';
import SideBar_UI from '../components_UI/Sidebar_UI';
import TopBar_UI from '../components_UI/Top_bar_UI';

export default function Type_doc_UI() {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newDocType, setNewDocType] = useState({ name: '', serviceId: '' });
  const [selectedDocType, setSelectedDocType] = useState(null);
  const serviceId = localStorage.getItem('serviceId'); // Assurez-vous que l'ID du service est stocké

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const fetchDocumentTypes = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/document-types/services/${serviceId}/document-types`);
      setDocumentTypes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching document types:', error);
      setError('Failed to fetch document types');
      setLoading(false);
    }
  };

  const handleEdit = (docType) => {
    setSelectedDocType(docType);
    setEditModalOpen(true);
  };

  const handleDelete = async (docTypeId) => {
    try {
      await axios.delete(`http://localhost:3000/document-types/${docTypeId}`);
      setDocumentTypes(documentTypes.filter(docType => docType.id !== docTypeId));
      toast.success('Type de document supprimé avec succès');
    } catch (error) {
      console.error('Error deleting document type:', error);
      toast.error('Erreur lors de la suppression du type de document');
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/document-types', { ...newDocType, serviceId });
      setDocumentTypes([...documentTypes, response.data]);
      toast.success('Type de document créé avec succès');
      setOpenModal(false);
      setNewDocType({ name: '', serviceId: '' });
    } catch (error) {
      console.error('Error creating document type:', error);
      toast.error('Erreur lors de la création du type de document');
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:3000/document-types/${selectedDocType.id}`, selectedDocType);
      fetchDocumentTypes();
      toast.success('Type de document mis à jour avec succès');
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating document type:', error);
      toast.error('Erreur lors de la mise à jour du type de document');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-300 to-gray-900">
      <SideBar_UI isVisible={true} />
      <div className="flex-1 flex flex-col ">
        <TopBar_UI position="fixed" title="Types de documents" />
        
        <div className="container w-[90%] mx-auto mt-32 bg-white rounded-xl shadow-2xl flex justify-start flex-col h-screen">
         
          <div className="bg-white w-full rounded-lg shadow-md p-6 ">
            <div className="flex justify-between items-center ">
              <h1 className="text-2xl font-extrabold text-gray-800 flex justify-start w-full">
                <Layers3 size="28px" className="mr-3 ml-2 text-red-600" />
                Types de documents
              </h1>
              <button
                className="btn btn-primary ml-auto mb-4 bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg shadow-md"
                onClick={() => setOpenModal(true)}
              >
                <Plus size={20} className="mr-2" />
                Nouveau
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="max-h-[600px] bg-gray-100 px-10 overflow-y-auto">
                {documentTypes.length === 0 ? (
                  <div className="text-center text-gray-900 mt-4">
                    <ServerOff className="text-red-500 mr-2" size={30} />
                    Aucun type de document disponible.
                  </div>
                ) : (
                  <table className="table w-full mt-2">
                    <thead className="sticky top-0 rounded-lg bg-gray-400 text-black">
                      <tr>
                        <th className="text-lg p-4">Type de document</th>
                        <th className="text-lg p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documentTypes.map((docType) => (
                        <tr key={docType.id} className="hover:bg-gray-200 rounded-lg bg-gray-100 transition duration-200">
                          <td className="flex items-center p-4 text-base text-gray-800">
                            <Layers3 size={20} className="mr-2" />
                            {docType.name}
                          </td>
                          <td className="text-right p-4 text-base text-gray-800">
                            <button className="btn btn-outline btn-primary btn-sm mr-2 hover:bg-indigo-100 transition duration-300 rounded-md" onClick={() => handleEdit(docType)}>
                              <SquarePen size={20} className="mr-2" />
                           
                            </button>
                            <button className="btn btn-outline btn-error btn-sm hover:bg-red-100 transition duration-300 rounded-md" onClick={() => handleDelete(docType.id)}>
                              <Trash2 size={20} className="mr-2" />
                           
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {openModal && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={() => setOpenModal(false)}>
          <div className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => setOpenModal(false)}>✕</button>
            <h3 className="font-bold text-lg">Ajouter un nouveau type de document</h3>
            <form onSubmit={handleCreate}>
              <div className="form-control mt-4">
                <label className="label">Nom du type de document</label>
                <input
                  type="text"
                  value={newDocType.name}
                  onChange={(e) => setNewDocType({ ...newDocType, name: e.target.value })}
                  className="input input-bordered border-2 border-gray-300 bg-white text-black"
                  required
                />
              </div>
              <div className="modal-action flex justify-center items-center">
                <button type="submit" className="btn border-t-neutral-700 w-[40%] bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg">
                  Ajouter
                </button>
                <button type="button" className="btn btn-outline btn-error w-[40%] mt-2" onClick={() => setOpenModal(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={() => setEditModalOpen(false)}>
          <div className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => setEditModalOpen(false)}>✕</button>
            <h3 className="font-bold text-lg">Modifier le type de document</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-control mt-4">
                <label className="label">Nom du type de document</label>
                <input
                  type="text"
                  value={selectedDocType?.name || ''}
                  onChange={(e) => setSelectedDocType({ ...selectedDocType, name: e.target.value })}
                  className="input input-bordered border-2 border-gray-300 bg-white text-black"
                  required
                />
              </div>
              <div className="modal-action flex justify-center items-center">
                <button type="submit" className="btn border-t-neutral-700 w-[40%] bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg">
                  Mettre à jour
                </button>
                <button type="button" className="btn btn-outline btn-error w-[40%] mt-2" onClick={() => setEditModalOpen(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}