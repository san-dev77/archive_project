import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'daisyui/dist/full.css';
import Side_bar from '../components_UI/Sidebar_UI';
import TopBar from '../components_UI/Top_bar_UI';
import EditMetadata from '../../update/EditMetadata';
import { CirclePlus, DatabaseZap, SquarePen, Trash2, LayoutList, Plus, Layers3 } from 'lucide-react';
import { Tooltip } from '@mui/material';

export default function ShowMeta() {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState('');
  const [selectedDocumentTypeName, setSelectedDocumentTypeName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [key, setKey] = useState('');
  const [metaType, setMetaType] = useState('text');
  const [modalOpen, setModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMeta, setCurrentMeta] = useState({ id: '', key: '', metaType: '' });
  const [editMetadataId, setEditMetadataId] = useState(null);
  const serviceName = localStorage.getItem('service');

  const navigate = useNavigate();

  const handleDocumentTypeSelect = (docTypeId, docTypeName) => {
    setSelectedDocumentTypeId(docTypeId);
    setSelectedDocumentTypeName(docTypeName);
  };

  useEffect(() => {
    const savedServiceId = localStorage.getItem('serviceId');

    if (savedServiceId) {
      const fetchDocumentTypes = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/document-types/services/${savedServiceId}/document-types`);
          setDocumentTypes(response.data);
        } catch (error) {
          console.error('Error fetching document types:', error);
          setError('Failed to fetch document types');
        } finally {
          setLoading(false);
        }
      };

      fetchDocumentTypes();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDocumentTypeId) {
      const fetchMetadata = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/metadata/type/${selectedDocumentTypeId}`);
          setMetadata(response.data);
        } catch (error) {
          console.error('Error fetching metadata:', error);
          setError('Failed to fetch metadata');
        }
      };

      fetchMetadata();
    } else {
      setMetadata([]);
    }
  }, [selectedDocumentTypeId]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/metadata/${id}`);
      toast.success('Metadonnée supprimée avec succès !');
      setMetadata((prevMetadata) => prevMetadata.filter(meta => meta.id !== id));
    } catch (error) {
      console.error('Error deleting metadata:', error);
      toast.error('Erreur lors de la suppression de la metadonnée');
    }
  };

  const fetchMetadataRefresh = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/metadata/type/${selectedDocumentTypeId}`);
      setMetadata(response.data);
    } catch (error) {
      console.error('Error fetching metadata:', error);
      setError('Failed to fetch metadata');
    }
  };

  const handleEdit = (meta) => {
    setCurrentMeta(meta);
    setEditMetadataId(meta.id);
    setEditMode(true);
  };

  const handleCreateNew = () => {
    setEditMode(false);
    setModalOpen(true);
    setMetaType('text');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await axios.put(`http://localhost:3000/metadata/${currentMeta.id}`, {
        cle: currentMeta.cle,
        metaType: currentMeta.metaType,
        documentTypeId: selectedDocumentTypeId,
      });
      setModalOpen(false);
      setEditMode(false);
      toast.success('Métadonnée modifiée avec succès!');
      await fetchMetadataRefresh();
    } catch (error) {
      console.error('Error updating metadata:', error);
      toast.error('Échec de la modification de la métadonnée.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await axios.post('http://localhost:3000/metadata', {
        key,
        metaType,
        documentTypeId: selectedDocumentTypeId,
      });
      setKey('');
      setMetaType('text');
      toast.success('Métadonnée créée avec succès!');
      await fetchMetadataRefresh();
    } catch (error) {
      console.error('Error creating metadata:', error);
      toast.error('Échec de la création de la métadonnée.');
    } finally {
      setFormLoading(false);
      setModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-300">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-300">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-300 overflow-hidden">
      <Side_bar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="container w-[90%] mx-auto mt-2 bg-white rounded-xl shadow-2xl flex flex-col h-full">
          <h1 className="text-3x mt-32 ml-2 font-extrabold text-gray-800 flex justify-start w-full">
            <LayoutList size="28px" className="mr-3 text-indigo-600" />
            Liste des Métadonnées pour le &nbsp;<em> {serviceName}</em>
          </h1>
          <div className="divider border-t-2 border-gray-900" ></div>
          <div className="bg-white mt-[-30px] w-full rounded-lg shadow-md p-4 mb-6 flex-1 overflow-y-auto">
            <div className="flex gap-4 mb-6 w-full">
              <div className="w-full">
                <div className="form-control w-full">
                  <label className="label text-black flex items-center gap-2 justify-start" >
                    <Layers3 className="text-lg"/>
                        Choisissez un type de document
                  </label>
                  <select
                    className="select select-bordered w-full text-black bg-gray-300 hover:bg-gray-200 transition-colors duration-200"
                    onChange={(e) => handleDocumentTypeSelect(e.target.value, e.target.options[e.target.selectedIndex].text)}
                    value={selectedDocumentTypeId}
                  >
                    <option value="" disabled>Sélectionner un type de document</option>
                    {documentTypes.map(docType => (
                      <option key={docType.id} value={docType.id}>
                        {docType.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Rechercher une métadonnée"
                className="input input-bordered w-full max-w-xs bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800"
                onChange={(e) => {
                  const searchTerm = e.target.value.toLowerCase();
                  const filteredMetadata = metadata.filter(meta =>
                    meta.cle.toLowerCase().includes(searchTerm)
                  );
                  if (searchTerm === "") fetchMetadataRefresh();
                  setMetadata(filteredMetadata);
                }}
              />
              {selectedDocumentTypeId && (
                <button className="btn btn-primary ml-auto bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg shadow-md" onClick={handleCreateNew}>
                  <Plus size={20} className="mr-2" />
                  Nouvelle
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <div className="max-h-96 overflow-y-auto">
                <table className="table w-full border-collapse">
                  <thead className="sticky top-0 rounded-lg bg-gray-300 text-black">
                    <tr>
                      <th className="text-lg p-4"></th>
                      <th className="text-lg p-4">|</th>
                      <th className="text-lg p-4">Nom métadonnées</th>
                      <th className="text-lg p-4">|</th>
                      <th className="text-lg p-4">Type des métadonnées</th>
                      <th className="text-lg p-4">|</th>
                      <th className="text-lg p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metadata.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center text-gray-500 py-4">
                          <div className="flex flex-col items-center">
                            <DatabaseZap className="text-gray-400 mb-2" size={48} />
                            <span>Aucune métadonnée disponible</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      metadata.map((meta) => (
                        <tr key={meta.id} className="hover:bg-gray-100 transition duration-200">
                          <td className="flex items-center justify-center bg-gray-400 rounded-lg text-white text-base mt-2">
                            <DatabaseZap className="mr-2" />
                          </td>
                          <td className="text-base text-gray-900">|</td>
                          <td className="text-base text-gray-900">
                            {meta.cle}
                          </td>
                          <td className="text-base text-gray-900">|</td>
                          <td className="flex items-center text-base text-gray-900">
                            {meta.metaType}
                          </td>
                          <td className="text-base text-gray-900">|</td>
                          <td className="text-right text-base text-gray-900">
                            <Tooltip title="Modifier">
                              <button className="btn btn-outline btn-primary btn-sm mr-2 hover:bg-indigo-100 transition duration-300 rounded-md" onClick={() => handleEdit(meta)}>
                                <SquarePen className="mr-1" />
                              </button>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                              <button className="btn btn-outline btn-error btn-sm hover:bg-red-400 transition duration-300 rounded-md" onClick={() => handleDelete(meta.id)}>
                                <Trash2 className="mr-1" />
                              </button>
                            </Tooltip>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && !editMode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setModalOpen(false)}>
          <div className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg w-full flex flex-col justify-center items-center" onClick={(e) => e.stopPropagation()}>
            <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => setModalOpen(false)}>✕</button>
            <h2 className="text-2xl font-bold mb-4">Créer une nouvelle métadonnée</h2>
            <form onSubmit={handleSubmit} className="w-full">
              <div className="form-control w-full">
                <label className="label">Nom du champ</label>
                <input
                  type="text"
                  className="input  input-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">Type du champ</label>
                <select
                  className="select select-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                  value={metaType}
                  onChange={(e) => setMetaType(e.target.value)}
                  required
                >
                  <option disabled selected>Sélectionner un type</option>
                  <option value="text">Texte</option>
                  <option value="Date">Date</option>
                  <option value="number">Nombre</option>
                </select>
              </div>
              <div className="modal-action flex justify-center items-center">
                <button type="submit" className="btn flex justify-center items-center btn-primary w-[50%] bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg">
                  <Plus className="mr-2" />
                  Créer
                </button>
                <button type="button" className="btn btn-outline btn-error w-[40%] mt-2" onClick={() => setModalOpen(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editMetadataId && (
        <EditMetadata
          id={editMetadataId}
          onClose={() => setEditMetadataId(null)}
          onUpdate={fetchMetadataRefresh}
        />
      )}

      <ToastContainer />
    </div>
  );
}
