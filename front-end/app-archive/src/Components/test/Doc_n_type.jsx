import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Side_bar from '../Side_bar';
import TopBar from '../Top_bar';
import { ChevronDown, ChevronUp, Plus, LayoutList, FileType } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'daisyui/dist/full.css';
import { Tooltip } from '@mui/material';

const toastOptions = {
  style: {
    backgroundColor: '#fff',
    color: '#000',
  },
  progressStyle: {
    background: '#4caf50',
  },
};

export default function ServiceDocTypes() {
  const { serviceId } = useParams();
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDocType, setExpandedDocType] = useState(null);
  const [documentDetails, setDocumentDetails] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [newDocType, setNewDocType] = useState({ name: '', serviceId: serviceId });
  const [searchText, setSearchText] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [directoryName, setDirectoryName] = useState('');

  useEffect(() => {
    fetchDocumentTypes();
    fetchServiceName();
  }, [serviceId]);

  const fetchDocumentTypes = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/document-types/services/${serviceId}/document-types`);

      setDocumentTypes(response.data);
    } catch (error) {
      console.error('Error fetching document types:', error);
      setError('Failed to fetch document types');
      toast.error('Échec lors de la récupération des types de documents.', toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceName = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/services/name/${serviceId}`);
      console.log(response.data);
      
      setServiceName(response.data.name);
    } catch (error) {
      console.error('Error fetching service name:', error);
      toast.error('Échec lors de la récupération du nom du service.', toastOptions);
    }
  };

  const fetchDocumentDetails = async (docTypeId) => {
    try {
      const response = await axios.get(`http://localhost:3000/documents/all/${docTypeId}`);
      setDocumentDetails(prevDetails => ({
        ...prevDetails,
        [docTypeId]: response.data
      }));
    } catch (error) {
      console.error('Error fetching document details:', error);
      toast.error('Échec lors de la récupération des détails du document.', toastOptions);
    }
  };

  const toggleExpand = (docTypeId) => {
    if (expandedDocType === docTypeId) {
      setExpandedDocType(null);
    } else {
      setExpandedDocType(docTypeId);
      if (!documentDetails[docTypeId]) {
        fetchDocumentDetails(docTypeId);
      }
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewDocType({ name: '', serviceId: serviceId });
  };

  const handleDocumentTypeCreated = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:3000/document-types', newDocType);
      setNewDocType({ name: '', serviceId: serviceId });
      setOpenModal(false);
      fetchDocumentTypes();
      toast.success('Type de document créé avec succès !', toastOptions);
    } catch (error) {
      console.error('Error creating document type:', error);
      toast.error('Échec lors de la création du type de document.', toastOptions);
    }
  };

  const renderTable = (documents) => {
    if (!documents || documents.length === 0) return <p className="text-gray-500 italic">Aucun document disponible pour ce type.</p>;

    const metadataKeys = [...new Set(documents.flatMap(doc => Array.isArray(doc.metadata) ? doc.metadata.map(meta => meta.cle) : []))];

    return (
      <div className="overflow-x-auto">
        <table className="table w-full border-collapse">
          <thead className="sticky top-0 rounded-lg bg-gray-300 text-black">
            <tr>
              {metadataKeys.map(key => (
                <th key={key} className="text-lg p-4">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <tr key={doc.id} className={`hover:bg-gray-100 transition duration-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                {metadataKeys.map(key => {
                  const meta = Array.isArray(doc.metadata) ? doc.metadata.find(meta => meta.cle === key) : null;
                  return (
                    <td key={key} className="p-4 text-base text-gray-800">
                      {meta ? meta.value : 'N/A'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const filteredDocumentTypes = documentTypes.filter((docType) =>
    docType.name.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-300">
      <Side_bar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="container mt-10 w-[90%] mx-auto bg-white rounded-xl shadow-2xl flex flex-col h-screen">
          <h1 className="text-3x2 font-extrabold text-gray-800 flex justify-start w-full mt-4 ml-4">
            <LayoutList size="28px" className="mr-3 text-indigo-600" />
          <span className='text-gray-800'>{serviceName.serviceName} -  {serviceName.directoryName}</span>
             
          </h1>
          <div className="divider"></div>
          <div className="bg-white w-full rounded-lg shadow-md p-6 mb-6">
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Rechercher un type de document"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="input input-bordered w-full max-w-xs bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              <button
                className="btn btn-primary ml-auto bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg shadow-md"
                onClick={handleOpenModal}
              >
                <Plus size={20} className="mr-2" />
                Nouveau Type
              </button>
            </div>
            <span className='text-gray-800'>Types de documents</span>
            <ul className="mt-4">
              {filteredDocumentTypes.map(docType => (
                <li key={docType.id} className="border-b-2 bg-gray-50 py-4 text-xl w-full border-gray-200 cursor-pointer hover:bg-gray-100 rounded-md mb-2">
                  <button onClick={() => toggleExpand(docType.id)} className="flex items-center w-full text-left px-4">
                    {expandedDocType === docType.id ? <ChevronUp className="text-indigo-600" /> : <ChevronDown className="text-indigo-600" />}
                    <FileType size={20} className="ml-2 mr-2 text-indigo-600" />
                    <span className="ml-2 text-gray-800">{docType.name}</span>
                  </button>
                  {expandedDocType === docType.id && (
                    <div className="mt-4 px-4">
                      {documentDetails[docType.id] ? (
                        renderTable(documentDetails[docType.id])
                      ) : (
                        <p className="text-gray-500 italic">Chargement des données...</p>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setOpenModal(false)}>
          <div className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => setOpenModal(false)}>✕</button>
            <h2 className="text-2xl font-bold mb-4">Ajouter un nouveau type de document</h2>
            <form onSubmit={handleDocumentTypeCreated}>
              <div className="form-control">
                <label className="label">Nom du type de document</label>
                <input
                  type="text"
                  value={newDocType.name}
                  onChange={(e) => setNewDocType({ ...newDocType, name: e.target.value })}
                  className="input input-bordered w-full mb-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                  required
                />
              </div>
              <div className="modal-action flex justify-center items-center">
                <button type="submit" className="btn flex justify-center items-center btn-primary w-[50%] bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg">
                  <Plus className="mr-2" />
                  Créer
                </button>
                <button type="button" className="btn btn-outline btn-error w-[40%] mt-2" onClick={() => setOpenModal(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
