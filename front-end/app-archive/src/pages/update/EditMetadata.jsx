import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'daisyui/dist/full.css';

const EditMetadata = ({ id, onClose, onUpdate }) => {
  const [metadata, setMetadata] = useState({ cle: '', metaType: '', documentTypeId: '' });
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/metadata/${id}`);
        setMetadata(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching metadata:', error);
        setLoading(false);
      }
    };

    const fetchDocumentTypes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/document-types');
        setDocumentTypes(response.data);
      } catch (error) {
        console.error('Error fetching document types:', error);
      }
    };

    fetchMetadata();
    fetchDocumentTypes();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMetadata((prevMetadata) => ({
      ...prevMetadata,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/metadata/${id}`, metadata);
      toast.success('Métadonnée mise à jour avec succès!');
      onUpdate();
      onClose(); // Fermer la modale après la mise à jour
    } catch (error) {
      console.error('Error updating metadata:', error);
      toast.error('Échec de la mise à jour de la métadonnée.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="modal modal-open" onClick={onClose}>
      <div className="modal-box bg-white text-black" onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={onClose}>✕</button>
        <h2 className="text-2xl font-bold mb-4">Modifier MetaDonnée</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">Nom Metadata</label>
            <input
              type="text"
              className="input  input-bordered w-full mb-4 bg-gray-200 text-black"
              name="cle"
              value={metadata.cle}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">Type de Donnée</label>
            <select
              className="select select-bordered w-full mb-4 bg-gray-200 text-black"
              name="metaType"
              value={metadata.metaType}
              onChange={handleChange}
              required
            >
              <option value="text">Texte</option>
              <option value="Date">Date</option>
              <option value="number">Nombre</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label">Type de Document</label>
            <select
              className="select select-bordered w-full mb-4 bg-gray-200 text-black"
              name="documentTypeId"
              value={metadata.documentTypeId}
              onChange={handleChange}
              required
            >
              {documentTypes.map((documentType) => (
                <option key={documentType.id} value={documentType.id}>
                  {documentType.name}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-action">
            <button type="submit" className="btn btn-primary w-600 bg-gray-400 hover:bg-gray-600 text-white">Mettre à jour</button>
            <button type="button" className="btn btn-outline btn-error w-600" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditMetadata;
