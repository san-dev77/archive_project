import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { InfoOutlined } from "@mui/icons-material";
import Side_bar from "../../Components/Side_bar";
import ArchiveIcon from "@mui/icons-material/Archive"; // Icone d'archivage
import PieceSelectionDialog from "./Pieces_upload";
import TopBar from "../../Components/Top_bar";
import {
  ArrowLeftRight,
  ArrowUpDown,
  Building2,
  CircleX,
  DatabaseZap,
  FileChartColumn,
  FileUp,
  FolderCheckIcon,
  FolderPlusIcon,
  Layers3,
  LayoutPanelTop,
  Link,
  Plus,
  RefreshCcw,
  ScanEye,
  Search,
  SquarePen,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import {
  Avatar,
  CircularProgress,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import Swal from "sweetalert2"; // Assurez-vous d'importer SweetAlert2
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";

const MainContainer = ({ children }) => (
  <div className="flex w-full bg-gradient-to-br from-green-50 to-emerald-100">
    {children}
  </div>
);

const ContentContainer = ({ children }) => (
  <div className="mt-24 p-1 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg shadow-none flex flex-col h-screen overflow-auto mr-10 w-full ml-7">
    {children}
  </div>
);

const StyledBox = ({ children }) => (
  <div className="bg-white rounded-lg shadow-lg p-3 mb-4 overflow-x-auto">
    {children}
  </div>
);

const StyledBox2 = ({ children }) => (
  <div className="bg-white rounded-lg shadow-2xl p-3 mb-4 overflow-x-auto">
    {children}
  </div>
);

const ActionContainer = ({ children }) => (
  <div className="flex justify-between mt-1 items-center gap-2 mb-2">
    {children}
  </div>
);

const CenteredModal = ({ open, onClose, children, maxWidth = "lg" }) => {
  const maxWidthClasses = {
    sm: "max-w-lg",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full mx-4",
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
        open ? "" : "hidden"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-xl p-6 w-full ${maxWidthClasses[maxWidth]} mx-4`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const DetailsTable = ({ children }) => (
  <div className="max-h-96 mt-2 w-full overflow-auto">{children}</div>
);

const DetailsDialog = ({
  open,
  onClose,
  document,
  metadataKeys,
  documentLot,
  handleFileClick,
}) => {
  const [isPieceMode, setIsPieceMode] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <CenteredModal open={open} onClose={onClose} maxWidth="lg">
      <div className="flex justify-between items-center mb-4 border-b border-green-200 pb-3">
        <div className="flex items-center">
          <InfoOutlined className="text-green-600 mr-2" sx={{ fontSize: 24 }} />
          <h3 className="text-xl font-bold text-green-800">
            Détails du document
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-200"
        >
          <CircleX size={18} />
        </button>
      </div>

      <button
        onClick={() => setIsPieceMode(!isPieceMode)}
        className="w-full px-4 py-3 mb-4 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg flex items-center justify-center gap-2 shadow-md"
      >
        <ArrowUpDown />
        {isPieceMode ? "Passer au mode Lot" : "Passer au mode Pièce"}
      </button>

      <div className="bg-gradient-to-b from-green-50 to-emerald-50 rounded-lg p-4 max-h-[60vh] overflow-y-auto shadow-inner border border-green-100">
        <table className="w-full table-fixed">
          <thead className="bg-gradient-to-r from-green-600 to-emerald-600 text-white sticky top-0 z-10">
            <tr>
              <th className="w-1/6 p-3 text-left rounded-tl-md">Aperçu</th>
              <th className="w-2/6 p-3 text-left">Metadonnées</th>
              <th className="w-3/6 p-3 text-left rounded-tr-md">Valeurs</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {document &&
              metadataKeys
                .filter(
                  (meta, index, self) =>
                    index === self.findIndex((m) => m.field === meta.field)
                )
                .map((meta, index) => (
                  <tr
                    key={meta.field}
                    className={index % 2 === 0 ? "bg-green-50" : ""}
                  >
                    <td className="w-1/6 text-gray-800 border-b border-green-100 p-3">
                      <div className="flex justify-center">
                        <DatabaseZap className="text-green-600" />
                      </div>
                    </td>
                    <td className="w-2/6 text-gray-800 border-b border-green-100 p-3">
                      <p className="font-bold text-gray-700 truncate">
                        {meta.field}
                      </p>
                    </td>
                    <td className="w-3/6 p-3 text-gray-800 border-b border-green-100">
                      <p className="text-gray-700 truncate">
                        {document[meta.field] || "N/A"}
                      </p>
                    </td>
                  </tr>
                ))}
            <tr>
              <td colSpan={3} className="p-3">
                <p className="text-gray-700 italic text-center">
                  {document
                    ? ` Document créé le: ${document.created_at}`
                    : "Date de création non disponible"}
                </p>
              </td>
            </tr>
            {isPieceMode
              ? // Rendu pour le mode pièce
                (() => {
                  const uniqueFilesByPiece = {};

                  document?.files?.forEach((file) => {
                    if (!uniqueFilesByPiece[file.pieceName]) {
                      uniqueFilesByPiece[file.pieceName] = [];
                    }
                    if (
                      !uniqueFilesByPiece[file.pieceName].some(
                        (f) => f.filePath === file.filePath
                      )
                    ) {
                      uniqueFilesByPiece[file.pieceName].push(file);
                    }
                  });

                  return (
                    <tr>
                      <td colSpan="3" className="p-0">
                        <div className="grid gap-2 w-full mt-3">
                          {Object.entries(uniqueFilesByPiece).map(
                            ([pieceName, files], index) => (
                              <Accordion
                                className=""
                                key={index}
                                sx={{
                                  color: "black",
                                  fontWeight: "bold",
                                  borderRadius: "8px",
                                  marginBottom: "8px",
                                  width: "100%",
                                  background: "#fff",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  ":hover": { background: "#f0f9f0" },
                                }}
                              >
                                <AccordionSummary
                                  sx={{
                                    width: "100%",
                                    background:
                                      "linear-gradient(to right, #10b981, #059669)",
                                  }}
                                  expandIcon={
                                    <ExpandMoreIcon sx={{ color: "white" }} />
                                  }
                                  aria-controls={`panel${index}-content`}
                                  id={`panel${index}-header`}
                                >
                                  <Typography className="text-white flex items-center justify-start p-2 rounded-lg font-bold truncate">
                                    <FileChartColumn className="mr-2 text-green-300" />
                                    {pieceName}
                                  </Typography>
                                </AccordionSummary>
                                <AccordionDetails
                                  sx={{ background: "#f0f9f0" }}
                                >
                                  <table className="w-full">
                                    <tbody>
                                      {files.map((file, fileIndex) => (
                                        <tr
                                          key={fileIndex}
                                          className={
                                            fileIndex % 2 === 0
                                              ? "bg-green-50"
                                              : ""
                                          }
                                        >
                                          <td className="w-1/6 p-2">
                                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 cursor-pointer text-white rounded-lg p-2 flex justify-center transition-all duration-200 shadow-md">
                                              <FileUp
                                                className="cursor-pointer"
                                                onClick={() =>
                                                  handleFileClick(file.fileUrl)
                                                }
                                              />
                                            </div>
                                          </td>
                                          <td className="w-5/6 pl-2">
                                            <p
                                              className="text-gray-700 truncate hover:text-green-600 transition-colors duration-200 cursor-pointer"
                                              onClick={() =>
                                                handleFileClick(file.fileUrl)
                                              }
                                            >
                                              {file.filePath}
                                            </p>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </AccordionDetails>
                              </Accordion>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })() || (
                  <tr>
                    <td colSpan="3" className="text-center p-4 text-gray-500">
                      Aucun fichier disponible
                    </td>
                  </tr>
                )
              : // Rendu pour le mode lot
                documentLot?.map((lot, index) => {
                  const uniqueFiles = Array.from(
                    new Set(lot.files.map((file) => file.filePath))
                  ).map((filePath) =>
                    lot.files.find((file) => file.filePath === filePath)
                  );

                  return uniqueFiles.map((file, fileIndex) => (
                    <tr key={`${index}-${fileIndex}`}>
                      <td className="w-1/6 p-2">
                        <div className="flex gap-2">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 cursor-pointer text-white rounded-lg p-2 flex justify-center transition-all duration-200 shadow-md">
                            <FileUp
                              className="cursor-pointer"
                              onClick={() => handleFileClick(file.fileUrl)}
                            />
                          </div>
                        </div>
                      </td>
                      <td colSpan="2" className="w-5/6 p-2">
                        <p
                          className="text-gray-700 truncate hover:text-green-600 transition-colors duration-200 cursor-pointer"
                          onClick={() => handleFileClick(file.fileUrl)}
                        >
                          {file.filePath}
                        </p>
                      </td>
                    </tr>
                  ));
                }) || (
                  <tr>
                    <td colSpan="3" className="text-center p-4 text-gray-500">
                      Aucun lot disponible
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>
      {isDeleting && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <CircularProgress color="success" />
        </div>
      )}
    </CenteredModal>
  );
};

// Nouveau composant pour afficher les fichiers
const FilePreviewModal = ({ open, onClose, fileUrl }) => (
  <CenteredModal open={open} onClose={onClose}>
    <div className="flex justify-between items-center mb-4 border-b border-green-200 pb-3">
      <h3 className="text-xl font-bold text-green-800 flex items-center">
        <FileChartColumn className="mr-2 text-green-600" />
        Aperçu du fichier
      </h3>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-200"
      >
        <CircleX size={18} />
      </button>
    </div>
    <div
      className="bg-green-50 rounded-lg p-4 border border-green-100 shadow-inner"
      style={{ height: "70vh" }}
    >
      <iframe
        src={fileUrl}
        className="w-full h-full rounded-md"
        title="File Preview"
      />
    </div>
    <div className="flex justify-end mt-4">
      <button
        onClick={onClose}
        className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-lg transition-all duration-200 shadow-md flex items-center gap-2"
      >
        <CircleX size={16} />
        Fermer
      </button>
    </div>
  </CenteredModal>
);

const CreateEditModal = ({
  open,
  onClose,
  formData,
  setFormData,
  handleSubmit,
  isEditing,
  metadataKeys,
  loadingForm,
}) => (
  <div className="w-full">
    <div className="flex justify-between items-center mb-6 border-b border-green-200 pb-4">
      <div className="flex items-center">
        {isEditing ? (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-full mr-3 shadow-lg">
            <SquarePen size={24} className="text-white" />
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-full mr-3 shadow-lg">
            <FolderPlusIcon size={24} className="text-white" />
          </div>
        )}
        <h3 className="text-xl font-bold text-green-800">
          {isEditing ? "Modifier le document" : "Ajouter un nouveau document"}
        </h3>
      </div>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-200"
      >
        <CircleX size={18} />
      </button>
    </div>

    <div className="bg-gradient-to-b from-green-50 to-emerald-50 rounded-lg p-5 mb-6 shadow-inner border border-green-100">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {metadataKeys.map((meta) => (
            <div key={meta.field} className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <DatabaseZap className="mr-2 text-green-600" size={16} />
                {meta.headerName}
              </label>
              <div className="relative">
                <input
                  type={meta.metaType || "text"}
                  value={formData[meta.field] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [meta.field]: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white text-gray-800 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder={`Saisir ${meta.headerName.toLowerCase()}...`}
                />
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>

    <div className="flex justify-end space-x-4 mt-6">
      <button
        type="button"
        onClick={onClose}
        className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-lg transition-all duration-200 shadow-md flex items-center gap-2"
      >
        <CircleX size={16} />
        Annuler
      </button>
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={loadingForm}
        className={`px-6 py-3 text-sm font-medium text-white ${
          isEditing
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
        } rounded-lg transition-all duration-200 shadow-md flex items-center gap-2`}
      >
        {loadingForm ? (
          <CircularProgress size={20} color="inherit" />
        ) : isEditing ? (
          <RefreshCcw size={16} />
        ) : (
          <Plus size={16} />
        )}
        {isEditing ? "Mettre à jour" : "Créer document"}
      </button>
    </div>
  </div>
);

const Docs_dir = () => {
  const [directoryData, setDirectoryData] = useState([]); // Utiliser pour stocker les données structurées
  const [services, setServices] = useState([]); // Supprimez cette ligne si elle n'est plus nécessaire
  const [docTypes, setDocTypes] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDocType, setSelectedDocType] = useState("");
  const [metadataKeys, setMetadataKeys] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [documentLot, setDocumentLot] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [loadingForm, setLoadingForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pieceDialogOpen, setPieceDialogOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState(null);
  const [selectedDirName, setSelectedDirName] = useState("");
  const [selectedDocTypeName, setSelectedDocTypeName] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/services/directory"
        );
        const data = response.data.map((directory) => ({
          directory_id: directory.directory_id,
          nom_directory: directory.nom_directory,
        }));
        setDirectoryData(data);
        setLoading(false);
      } catch (error) {
        setErrorMessage("Failed to fetch services");
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService) {
      const fetchDocTypesBydirectory = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/document-types/doctype/${selectedService}`
          );
          setDocTypes(response.data);
        } catch (error) {
          setErrorMessage("Failed to fetch document types");
        }
      };

      fetchDocTypesBydirectory();
    }
  }, [selectedService]);

  useEffect(() => {
    if (selectedDocType) {
      const fetchMetadataAndDocuments = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/metadata/meta_dir/${selectedDocType}`
          );

          const metadata = response.data || [];
          const columns = metadata.map((meta) => ({
            field: meta.cle,
            headerName: meta.cle,
            metaType: meta.metaType,
            flex: 1,
            renderHeader: () => (
              <span className="text-sm text-gray-500">{meta.cle}</span>
            ),
          }));

          setMetadataKeys(columns);

          // Charger les documents et les lots
          await Promise.all([refreshDocuments(), fetchDocumentLot()]);
        } catch (error) {
          console.error("Erreur chargement metadata:", error);
          toast.error("Failed to fetch metadata");
        }
      };

      fetchMetadataAndDocuments();
    }
  }, [selectedDocType]);

  const fetchDocumentLot = async () => {
    if (!selectedDocType) return;

    try {
      const docResponseLot = await axios.get(
        `http://localhost:3000/documents/type/lot/${selectedDocType}`
      );
      if (docResponseLot.data) {
        console.log("lot data", docResponseLot.data);

        setDocumentLot(docResponseLot.data);
      }
    } catch (error) {
      console.error("Erreur chargement lots:", error);
      toast.error("Failed to fetch document lots");
    }
  };

  const handleSavePieces = () => {
    // Implémentez la logique pour sauvegarder les pièces sélectionnées
  };

  const refreshDocuments = async () => {
    if (!selectedDocType) return;

    try {
      const docResponse = await axios.get(
        `http://localhost:3000/documents/dir/pieces/${selectedDocType}`
      );
      console.log("pieces datas", docResponse.data);

      if (docResponse.data) {
        setDocuments(docResponse.data);
      }
    } catch (error) {
      console.error("Erreur chargement documents:", error);
      toast.error("Échec du chargement des documents");
    }
  };

  const handleServiceChange = (event) => {
    const dirId = event.target.value;
    console.log(dirId);

    const dirName =
      directoryData.find((directory) => directory.directory_id === dirId)
        ?.nom_directory || "";
    setSelectedDirName(dirName);
    setSelectedService(dirId); // Ajout de cette ligne pour mettre à jour selectedService
    setSelectedDocType("");
    setMetadataKeys([]);
    setDocuments([]);
    setSelectedDocument(null);
  };

  const handleDocTypeChange = (event) => {
    const docTypeId = event.target.value;
    const docTypeName =
      docTypes.find((docType) => docType.id === docTypeId)?.name_doc_type || "";
    setSelectedDocType(docTypeId);
    setSelectedDocTypeName(docTypeName);
    setSelectedDocumentTypeId(docTypeId);
    setFormData({ ...formData, documentTypeId: docTypeId });
    setMetadataKeys([]);
    setDocuments([]);
    setSelectedDocument(null);
  };

  const handleCreateDocument = async (event) => {
    event.preventDefault();
    if (!selectedDocumentTypeId) return;

    setIsLoading(true);
    try {
      const dataToSend = {
        ...formData,
        serviceName: selectedDirName,
        docTypeName: selectedDocTypeName,
        documentTypeId: selectedDocumentTypeId,
      };

      await axios.post("http://localhost:3000/documents/dir", dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Réinitialiser le formulaire et les états
      setFormData({});
      setCreateDialogOpen(false);

      // Attendre un court instant avant de rafraîchir
      setTimeout(async () => {
        await refreshDocuments();
        Swal.fire("Créé !", "Le document a été créé avec succès.", "success");
      }, 100);
    } catch (error) {
      console.error("Erreur création document:", error);
      Swal.fire(
        "Erreur !",
        "Une erreur est survenue lorsde la création du document. Veuillez réessayer...",
        "error"
      );
    } finally {
      setIsLoading(false);
      setLoadingForm(false);
    }
  };

  const handleDelete = async (docId) => {
    const { value: confirmed } = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action supprimera définitivement le document.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (confirmed) {
      try {
        await axios.delete(`http://localhost:3000/documents/dir/${docId}`);
        refreshDocuments(); // Rafraîchir la liste des documents
        Swal.fire(
          "Supprimé !",
          "Le document a été supprimé avec succès.",
          "success"
        ); // Afficher une modale de succès
      } catch (error) {
        console.error("Erreur lors de la suppression du document :", error);
        Swal.fire(
          "Erreur !",
          "Échec lors de la suppression du document.",
          "error"
        ); // Afficher une modale d'erreur
      }
    } else {
      Swal.fire("Annulé", "La suppression a été annulée.", "info"); // Afficher une modale d'annulation
    }
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const formattedDocuments = documents
    .filter((doc) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        doc.created_at.toLowerCase().includes(term) ||
        doc.code_unique?.toLowerCase().includes(term) ||
        metadataKeys.some((key) =>
          (doc.metadata[key.field] || "").toLowerCase().includes(term)
        )
      );
    })
    .map((doc) => {
      const formattedDoc = {
        id: doc.id,
        created_at: new Date(doc.created_at).toLocaleDateString(),
        codification: doc.code_unique || "N/A",
      };
      metadataKeys.forEach((column) => {
        formattedDoc[column.field] = doc.metadata[column.field] || "";
      });
      return formattedDoc;
    });

  const columns = [
    {
      renderCell: (params) => (
        <Tooltip title="View Details">
          <IconButton
            className="bg-green-600 p-2"
            onClick={() => handleOpenDetails(params.row)}
          >
            <Avatar sx={{ borderRadius: "50%", background: "#fff" }}>
              <FolderCheckIcon style={{ color: "green" }} />
            </Avatar>
          </IconButton>
        </Tooltip>
      ),
    },
    { field: "created_at", headerName: "Date création", flex: 1 },
    { field: "codification", headerName: "Codification", flex: 1 },
    ...metadataKeys,
    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
      renderCell: (params) => (
        <ActionContainer>
          <Tooltip title="Voir détails">
            <IconButton
              sx={{
                borderRadius: "8px",
                background: "linear-gradient(to right, #2563eb, #3b82f6)",
                color: "white",
                padding: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                ":hover": {
                  background: "linear-gradient(to right, #1d4ed8, #2563eb)",
                },
                transition: "all 0.2s ease",
              }}
              onClick={() => handleOpenDetails(params.row)}
            >
              <ScanEye size={18} style={{ color: "white" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier document">
            <IconButton
              sx={{
                borderRadius: "8px",
                background: "linear-gradient(to right, #7c3aed, #8b5cf6)",
                color: "white",
                padding: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                ":hover": {
                  background: "linear-gradient(to right, #6d28d9, #7c3aed)",
                },
                transition: "all 0.2s ease",
              }}
              onClick={() => handleEdit(params.row)}
            >
              <SquarePen size={18} style={{ color: "white" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer document">
            <IconButton
              sx={{
                borderRadius: "8px",
                background: "linear-gradient(to right, #dc2626, #ef4444)",
                color: "white",
                padding: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                ":hover": {
                  background: "linear-gradient(to right, #b91c1c, #dc2626)",
                },
                transition: "all 0.2s ease",
              }}
              onClick={() => handleDelete(params.row.id)}
            >
              <Trash2 size={18} style={{ color: "white" }} />
            </IconButton>
          </Tooltip>
        </ActionContainer>
      ),
    },
  ];

  const handleOpenDetails = (doc) => {
    const documentWithFiles = {
      ...doc,
      files: documents.find((d) => d.id === doc.id)?.files || [],
    };
    setSelectedDocument(documentWithFiles);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDocument(null);
  };

  const handleEdit = (doc) => {
    const documentWithFiles = {
      ...doc,
      files: documents.find((d) => d.id === doc.id)?.files || [],
      lots: documentLot.find((d) => d.id === doc.id)?.files || [],
    };
    setEditFormData(documentWithFiles);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditFormData({});
  };

  const handleUpdateDocument = async (event) => {
    event.preventDefault();
    if (!selectedDocumentTypeId || !editFormData.id) return;

    setIsLoading(true);
    try {
      const dataToSend = {
        ...editFormData,
        documentTypeId: selectedDocumentTypeId,
      };

      await axios.put(
        `http://localhost:3000/documents/dir/${editFormData.id}`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Réinitialiser le formulaire et les états
      setEditFormData({});
      setEditDialogOpen(false);

      // Attendre un court instant avant de rafraîchir
      setTimeout(async () => {
        await refreshDocuments();
        Swal.fire(
          "Mis à jour !",
          "Le document a été mis à jour avec succès.",
          "success"
        );
      }, 100);
    } catch (error) {
      console.error("Erreur mise à jour document:", error);
      Swal.fire(
        "Erreur !",
        "Échec lors de la mise à jour du document.",
        "error"
      );
    } finally {
      setIsLoading(false);
      setLoadingForm(false);
    }
  };

  const handleFileClick = (fileUrl) => {
    setSelectedFileUrl(fileUrl);
    setFileModalOpen(true);
  };

  // Ajout d'un useEffect pour le nettoyage
  useEffect(() => {
    return () => {
      setDocuments([]);
      setMetadataKeys([]);
      setFormData({});
      setEditFormData({});
      setSelectedDocument(null);
      setDocumentLot([]);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Side_bar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Documents" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-white w-full rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <ArchiveIcon
                  sx={{ fontSize: "32px" }}
                  className="text-green-600 mr-2"
                />
                Liste des dossiers archivés par direction
              </h1>
            </div>

            <div className="bg-green-50 rounded-lg p-4 mb-6 shadow-sm border border-green-100">
              <div className="flex gap-4 mb-4">
                <div className="form-control w-1/2">
                  <label className="label w-full flex text-gray-700 items-center justify-start">
                    <Building2 className="mr-2 text-green-600" />
                    Liste des services
                  </label>
                  <select
                    className="select select-bordered text-gray-800 bg-white border-blue-200 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={selectedService}
                    onChange={handleServiceChange}
                  >
                    <option value="">Sélectionner une direction</option>
                    {directoryData.map((directory) => (
                      <option
                        key={directory.directory_id}
                        value={directory.directory_id}
                      >
                        {directory.nom_directory}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedService && (
                  <div className="form-control w-1/2">
                    <label className="label w-full flex text-gray-700 items-center justify-start">
                      <Layers3 className="mr-2 text-green-600" />
                      Liste type de document
                    </label>
                    <select
                      className="select select-bordered text-gray-800 bg-white border-blue-200 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={selectedDocType}
                      onChange={handleDocTypeChange}
                    >
                      <option value="">Sélectionner un type de document</option>
                      {docTypes.map((docType) => (
                        <option key={docType.id} value={docType.id}>
                          {docType.name_doc_type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="form-control w-1/2">
                  <label className="label w-full flex text-gray-700 items-center justify-start">
                    <Search className="mr-2 text-green-600" />
                    Rechercher des documents
                  </label>
                  <input
                    type="text"
                    placeholder="Rechercher des documents..."
                    className="input input-bordered bg-white text-gray-800 border-blue-200 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn bg-green-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200 shadow-md"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Nouveau
                  </button>
                  <button
                    className="btn bg-green-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200 shadow-md"
                    onClick={() => navigate("/documents")}
                  >
                    <ArrowLeftRight className="h-5 w-5 mr-2" />
                    Mode service
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-md">
              <DataGrid
                rows={formattedDocuments}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                autoHeight
                className="bg-white"
                sx={{
                  "& .MuiDataGrid-cell": {
                    color: "#333",
                    borderColor: "#e5e7eb",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    borderColor: "#e5e7eb",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    backgroundColor: "#f9fafb",
                    color: "#374151",
                    borderColor: "#e5e7eb",
                  },
                  "& .MuiTablePagination-root": {
                    color: "#374151",
                  },
                  "& .MuiIconButton-root": {
                    color: "#4b5563",
                  },
                }}
              />
            </div>

            <DetailsDialog
              open={dialogOpen}
              onClose={handleCloseDialog}
              document={selectedDocument}
              metadataKeys={metadataKeys}
              documentLot={documentLot}
              handleFileClick={handleFileClick}
            />

            <CenteredModal
              open={createDialogOpen}
              onClose={handleCloseCreateDialog}
            >
              <CreateEditModal
                open={createDialogOpen}
                onClose={handleCloseCreateDialog}
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleCreateDocument}
                isEditing={false}
                metadataKeys={metadataKeys}
                loadingForm={loadingForm}
              />
            </CenteredModal>

            <PieceSelectionDialog
              open={pieceDialogOpen}
              onClose={() => setPieceDialogOpen(false)}
              onSave={handleSavePieces}
              documentId={selectedDocumentId}
              documentTypeId={selectedDocumentTypeId}
              onLoadAll={refreshDocuments}
            />

            <CenteredModal
              open={editDialogOpen}
              onClose={handleCloseEditDialog}
            >
              <CreateEditModal
                open={editDialogOpen}
                onClose={handleCloseEditDialog}
                formData={editFormData}
                setFormData={setEditFormData}
                handleSubmit={handleUpdateDocument}
                isEditing={true}
                metadataKeys={metadataKeys}
                loadingForm={loadingForm}
              />
            </CenteredModal>

            <FilePreviewModal
              open={fileModalOpen}
              onClose={() => setFileModalOpen(false)}
              fileUrl={selectedFileUrl}
            />
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-30">
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default Docs_dir;
