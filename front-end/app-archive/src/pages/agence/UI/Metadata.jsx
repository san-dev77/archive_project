import { useState, useEffect } from "react";
import axios from "axios";
import Side_bar from "../../../Components/Sidebar_agence";
import TopBar from "../../../Components/Top_bar";
import {
  Plus,
  SquarePen,
  Trash2,
  PackageCheck,
  FileSpreadsheet,
  ServerOff,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import { Tooltip } from "@mui/material";
import Swal from "sweetalert2";
import Select from "react-select"; // Importing react-select
import * as XLSX from "xlsx";

const toastOptions = {
  style: {
    backgroundColor: "#fff",
    color: "#000",
  },
  progressStyle: {
    background: "#4caf50",
  },
};

export default function Metadata_agence() {
  const [metadata, setMetadata] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMetadata, setCurrentMetadata] = useState({
    id: "",
    nom_meta: "",
    type_meta: "",
    document_type_id: "", // Added field for document type ID
  });
  const [documentTypes, setDocumentTypes] = useState([]); // State for document types
  const [selectedDocumentType, setSelectedDocumentType] = useState(null); // State for selected document type
  const [previewData, setPreviewData] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    fetchDocumentTypes(); // Fetch document types on component mount
  }, []);

  useEffect(() => {
    if (selectedDocumentType) {
      fetchMetadataByDocumentType(selectedDocumentType.value); // Fetch metadata when document type is selected
    }
  }, [selectedDocumentType]);

  const fetchMetadataByDocumentType = async (documentTypeId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/agence/metadata/nom-type/${documentTypeId}`
      );
      setMetadata(response.data); // Update metadata based on selected document type
    } catch (error) {
      console.error("Error fetching metadata by document type:", error);
      toast.error(
        "Erreur lors de la récupération des métadonnées pour le type de document sélectionné",
        toastOptions
      );
    }
  };

  const fetchDocumentTypes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/agence/document-type"
      ); // Adjust the endpoint as necessary
      setDocumentTypes(
        response.data.map((doc) => ({
          value: doc.id,
          label: doc.nom_document_type,
        }))
      ); // Map to react-select format
    } catch (error) {
      console.error("Error fetching document types:", error);
      toast.error(
        "Erreur lors de la récupération des types de documents",
        toastOptions
      );
    }
  };

  const handleDocumentTypeChange = (selectedOption) => {
    setSelectedDocumentType(selectedOption);
    setCurrentMetadata({
      ...currentMetadata,
      document_type_id: selectedOption.value, // Set document type ID in currentMetadata
    });
  };

  const handleEdit = (meta) => {
    setCurrentMetadata(meta);
    setEditMode(true);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Confirmation",
      text: "Êtes-vous sûr de vouloir supprimer cette métadonnée ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/agence/metadata/${id}`);
        fetchMetadataByDocumentType(selectedDocumentType.value); // Refresh metadata based on selected document type
        toast.success("La métadonnée est supprimée avec succès!", toastOptions);
      } catch (error) {
        console.error("Error deleting metadata:", error);
        toast.error(
          "Échec lors de la suppression de la métadonnée",
          toastOptions
        );
      }
    }
  };

  const handleMetadataCreated = async (event) => {
    event.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/agence/metadata",
        currentMetadata
      );
      fetchMetadataByDocumentType(selectedDocumentType.value); // Refresh metadata based on selected document type
      toast.success("Métadonnée créée avec succès !", toastOptions);
      setOpenModal(false);
    } catch (error) {
      console.error("Error creating metadata:", error);
      toast.error("Échec lors de la création de la métadonnée.", toastOptions);
    }
  };

  const handleGenerateExcel = () => {
    if (!metadata || metadata.length === 0) {
      toast.error("Aucune métadonnée disponible pour l'export", toastOptions);
      return;
    }

    // Créer un exemple de données pour la prévisualisation
    const previewRows = [
      // Ligne d'exemple avec des valeurs vides
      Object.fromEntries(metadata.map((meta) => [meta.nom_meta, ""])),
      // Deuxième ligne d'exemple
      Object.fromEntries(metadata.map((meta) => [meta.nom_meta, ""])),
    ];

    setPreviewData(previewRows);
    setShowPreviewModal(true);
  };

  const handleExportExcel = () => {
    try {
      // Créer les en-têtes à partir des métadonnées
      const headers = metadata.map((meta) => meta.nom_meta);

      // Préparer les données pour Excel
      const worksheetData = [
        headers,
        ...previewData.map((row) => headers.map((header) => row[header])),
      ];

      // Créer un nouveau classeur
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);

      // Ajouter la feuille au classeur
      XLSX.utils.book_append_sheet(wb, ws, "Données");

      // Générer le fichier Excel
      const documentTypeName = selectedDocumentType.label;
      XLSX.writeFile(wb, `template_${documentTypeName}.xlsx`);

      toast.success("Fichier Excel généré avec succès!", toastOptions);
      setShowPreviewModal(false);
    } catch (error) {
      console.error("Erreur lors de la génération du fichier Excel:", error);
      toast.error(
        "Erreur lors de la génération du fichier Excel",
        toastOptions
      );
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setShowPreviewModal(false);
  };

  const filteredMetadata = metadata.filter(
    (meta) =>
      meta.nom_meta.toLowerCase().includes(search.toLowerCase()) ||
      meta.type_meta.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-300">
      <Side_bar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Métadonnées" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-gray-800 w-full rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <PackageCheck className="h-8 w-8 text-[#00B7FF] mr-2" />
                Gestion des Métadonnées
              </h1>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-white mb-1">
                    Type de document
                  </label>
                  <Select
                    options={documentTypes}
                    value={selectedDocumentType}
                    onChange={handleDocumentTypeChange}
                    placeholder="Sélectionnez un type de document"
                    className="w-full"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "#3a3a3a",
                        borderColor: "#4a4a4a",
                        color: "white",
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: "#3a3a3a",
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused
                          ? "#4a4a4a"
                          : "#3a3a3a",
                        color: "white",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "white",
                      }),
                    }}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-white mb-1">
                    Rechercher
                  </label>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher par nom ou type..."
                    className="w-full px-4 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                  />
                </div>
                {selectedDocumentType && (
                  <div className="flex space-x-2 items-end">
                    <button
                      className="px-4 py-2 bg-[#00B7FF] text-white rounded-lg hover:bg-[#0096FF] transition-colors duration-200 flex items-center"
                      onClick={() => setOpenModal(true)}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Nouvelle métadonnée
                    </button>
                    <button
                      className="px-4 py-2 bg-[#00B7FF] text-white rounded-lg hover:bg-[#0096FF] transition-colors duration-200 flex items-center"
                      onClick={handleGenerateExcel}
                      disabled={!selectedDocumentType || metadata.length === 0}
                    >
                      <FileSpreadsheet className="h-5 w-5 mr-2" />
                      Template Excel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#3a3a3a] rounded-lg p-4">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#2a2a2a] text-white">
                    <th className="px-4 py-3 text-left">
                      Nom de la métadonnée
                    </th>
                    <th className="px-4 py-3 text-left">Type de métadonnée</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMetadata.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-8">
                        <ServerOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-300">
                          Aucune métadonnée disponible
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredMetadata.map((meta) => (
                      <tr
                        key={meta.id}
                        className="border-t border-[#4a4a4a] hover:bg-[#4a4a4a] transition-colors duration-200"
                      >
                        <td className="px-4 py-3 text-white">
                          {meta.nom_meta}
                        </td>
                        <td className="px-4 py-3 text-white">
                          {meta.type_meta}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(meta)}
                              className="p-2 text-[#00B7FF] hover:bg-[#2a2a2a] rounded-lg transition-colors duration-200"
                            >
                              <SquarePen className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(meta.id)}
                              className="p-2 text-red-500 hover:bg-[#2a2a2a] rounded-lg transition-colors duration-200"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
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

      {openModal && (
        <div
          className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={handleCloseModal}
        >
          <div
            className="bg-[#2a2a2a] rounded-lg shadow-xl p-6 w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                {editMode
                  ? "Modifier la métadonnée"
                  : "Ajouter une nouvelle métadonnée"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleMetadataCreated}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-1">
                  Nom de la métadonnée
                </label>
                <input
                  type="text"
                  placeholder="Nom de la métadonnée"
                  value={currentMetadata.nom_meta}
                  onChange={(e) =>
                    setCurrentMetadata({
                      ...currentMetadata,
                      nom_meta: e.target.value,
                    })
                  }
                  required
                  className="w-full px-3 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-1">
                  Type de métadonnée
                </label>
                <Select
                  options={[
                    { value: "text", label: "Text" },
                    { value: "number", label: "Number" },
                    { value: "date", label: "Date" },
                  ]}
                  value={{
                    value: currentMetadata.type_meta,
                    label: currentMetadata.type_meta,
                  }}
                  onChange={(selectedOption) =>
                    setCurrentMetadata({
                      ...currentMetadata,
                      type_meta: selectedOption.value,
                    })
                  }
                  placeholder="Sélectionnez un type de métadonnée"
                  className="w-full"
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "#3a3a3a",
                      borderColor: "#4a4a4a",
                      color: "white",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "#3a3a3a",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? "#4a4a4a" : "#3a3a3a",
                      color: "white",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: "white",
                    }),
                  }}
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-white bg-[#4a4a4a] rounded-lg hover:bg-[#5a5a5a] transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-[#00B7FF] rounded-lg hover:bg-[#0096FF] transition-colors duration-200 flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  {editMode ? "Mettre à jour" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPreviewModal && (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#2a2a2a] rounded-lg shadow-xl p-6 w-full max-w-6xl mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <FileSpreadsheet className="h-6 w-6 text-[#00B7FF] mr-2" />
                Template Excel - {selectedDocumentType.label}
              </h2>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#3a3a3a] rounded-lg p-4 mb-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    {metadata.map((meta, index) => (
                      <th
                        key={index}
                        className="px-4 py-3 bg-[#2a2a2a] text-white font-medium text-left"
                      >
                        {meta.nom_meta}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="border-t border-[#4a4a4a] hover:bg-[#4a4a4a] transition-colors duration-200"
                    >
                      {metadata.map((meta, colIndex) => (
                        <td key={colIndex} className="px-4 py-2">
                          <input
                            type="text"
                            className="w-full px-3 py-2 bg-[#2a2a2a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                            value={row[meta.nom_meta]}
                            onChange={(e) => {
                              const newData = [...previewData];
                              newData[rowIndex][meta.nom_meta] = e.target.value;
                              setPreviewData(newData);
                            }}
                            placeholder={`Exemple ${meta.nom_meta}...`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  const newData = [
                    ...previewData,
                    Object.fromEntries(
                      metadata.map((meta) => [meta.nom_meta, ""])
                    ),
                  ];
                  setPreviewData(newData);
                }}
                className="px-4 py-2 bg-[#4a4a4a] text-white rounded-lg hover:bg-[#5a5a5a] transition-colors duration-200 flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Ajouter une ligne
              </button>
              <button
                onClick={handleExportExcel}
                className="px-4 py-2 bg-[#00B7FF] text-white rounded-lg hover:bg-[#0096FF] transition-colors duration-200 flex items-center"
              >
                <FileSpreadsheet className="h-5 w-5 mr-2" />
                Exporter en Excel
              </button>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
