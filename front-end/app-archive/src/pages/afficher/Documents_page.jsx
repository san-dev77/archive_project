import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { InfoOutlined } from "@mui/icons-material";
import Side_bar from "../../Components/Side_bar";
import ArchiveIcon from "@mui/icons-material/Archive"; // Icone d'archivage
import PieceSelectionDialog from "./Pieces_upload";
import TopBar from "../../Components/Top_bar";
import {
  ArrowUpDown,
  Building2,
  DatabaseZap,
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
import { Avatar, CircularProgress, IconButton, Tooltip } from "@mui/material";
import Swal from "sweetalert2"; // Assurez-vous d'importer SweetAlert2

const MainContainer = ({ children }) => (
  <div className="flex w-full  bg-gray-300">{children}</div>
);

const ContentContainer = ({ children }) => (
  <div className=" mt-10 p-4 bg-gray-100 rounded-lg shadow-none flex flex-col h-screen items-stretch max-w-full w-[70%] ml-2">
    {children}
  </div>
);

const StyledBox = ({ children }) => (
  <div className="bg-white rounded-lg shadow-lg p-3 mb-4">{children}</div>
);

const ActionContainer = ({ children }) => (
  <div className="flex items-center gap-1 mb-2">{children}</div>
);

const CenteredModal = ({ open, onClose, children }) => (
  <div
    className={`modal ${open ? "modal-open" : ""}`}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: open ? "flex" : "none",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      zIndex: 1000,
    }}
  >
    <div
      className="modal-box bg-white shadow-lg rounded-lg p-3"
      style={{
        width: "80%", // Ajustez la largeur selon vos besoins
        maxWidth: "500px", // Limitez la largeur maximale pour s'adapter à l'écran
        maxHeight: "90%", // Limitez la hauteur maximale pour s'adapter à l'écran
        overflowY: "auto", // Ajoutez un défilement vertical si le contenu dépasse la hauteur
      }}
    >
      {children}
      <div className="modal-action">
        <button
          className="btn btn-outline border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
);

const DetailsTable = ({ children }) => (
  <div className="max-h-96 mt-2 overflow-auto">{children}</div>
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

  const toggleMode = () => {
    setIsPieceMode((prevMode) => !prevMode);
  };

  return (
    <CenteredModal open={open} onClose={onClose}>
      <div className="flex gap-2 items-center justify-center mb-2">
        <div className="avatar bg-gray-300 p-2 rounded-full text-black">
          <InfoOutlined />
        </div>
        <h5 className="font-bold text-center text-black">
          Détails du document
        </h5>
      </div>
      <div className="modal-content">
        <button
          onClick={toggleMode}
          className="btn btn-outline border-2 w-full justify-center border-gray-400 text-gray-800 hover:bg-gray-400 hover:text-white"
        >
          <ArrowUpDown className="mr-2" />{" "}
          {isPieceMode ? "Passer au mode Lot" : "Passer au mode Pièce"}
          {console.log(isPieceMode)}
        </button>
        <DetailsTable>
          <table className="table w-full ">
            <thead className="text-black">
              <tr>
                <th>Aperçu</th>
                <th>Metadonnées</th>
                <th>Valeurs</th>
              </tr>
            </thead>
            <tbody>
              {document &&
                metadataKeys
                  .filter(
                    (meta, index, self) =>
                      index === self.findIndex((m) => m.field === meta.field)
                  )
                  .map((meta) => (
                    <tr key={meta.field}>
                      <td>
                        <DatabaseZap className="text-gray-800" />
                      </td>
                      <td>
                        <p className="font-bold text-gray-800">{meta.field}</p>
                      </td>
                      <td>
                        <p className="text-gray-500">
                          {document[meta.field] || "N/A"}
                        </p>
                      </td>
                    </tr>
                  ))}
              <tr>
                <td colSpan={3}>
                  <p className="text-gray-800 italic text-center">
                    {document
                      ? ` Document créé le: ${document.created_at}`
                      : "Date de création non disponible"}
                  </p>
                </td>
              </tr>
              {isPieceMode
                ? // Rendu pour le mode pièce
                  Array.from(
                    new Set(document?.files?.map((file) => file.pieceName))
                  ).map((pieceName, index) => {
                    const file = document.files.find(
                      (f) => f.pieceName === pieceName
                    );
                    return (
                      <tr key={index} className="">
                        <td className="hover:bg-cyan-600 cursor-pointer w-full text-gray-800 mt-2 rounded-lg bg-cyan-500 flex items-center justify-center">
                          <FileUp
                            className="cursor-pointer"
                            onClick={() => handleFileClick(file.fileUrl)}
                          />
                        </td>
                        <td className="text-gray-800 w-full">
                          {file.pieceName}
                        </td>
                        <td>
                          <span
                            className="text-gray-800 cursor-pointer hover:text-blue-500"
                            onClick={() => handleFileClick(file.fileUrl)}
                          >
                            {file.filePath}
                          </span>
                        </td>
                      </tr>
                    );
                  }) || (
                    <tr>
                      <td colSpan="3" className="text-center">
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
                        <td className="hover:bg-cyan-600 cursor-pointer w-full text-gray-800 mt-2 rounded-lg bg-cyan-500 flex items-center justify-center">
                          <LayoutPanelTop
                            className="cursor-pointer"
                            color="white"
                            onClick={() => handleFileClick(file.fileUrl)}
                          />
                        </td>
                        <td
                          className="text-gray-800 w-full hover:text-blue-500 cursor-pointer"
                          onClick={() => handleFileClick(file.fileUrl)}
                        >
                          {file.filePath}
                        </td>
                      </tr>
                    ));
                  }) || (
                    <tr>
                      <td colSpan="3" className="text-center">
                        Aucun lot disponible
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </DetailsTable>
      </div>
    </CenteredModal>
  );
};

// Nouveau composant pour afficher les fichiers
const FilePreviewModal = ({ open, onClose, fileUrl }) => (
  <div
    className={`modal ${open ? "modal-open" : ""}`}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: open ? "flex" : "none",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      zIndex: 1000,
    }}
  >
    <div
      className="modal-box bg-white shadow-lg rounded-lg p-3"
      style={{
        width: "90%", // Largeur spécifique pour cette modale
        maxWidth: "800px", // Largeur maximale spécifique
        height: "80vh", // Hauteur spécifique
        overflowY: "auto",
      }}
    >
      <div className="modal-content" style={{ height: "100%" }}>
        <iframe src={fileUrl} className="w-full h-full" title="File Preview" />
      </div>
      <div className="modal-action">
        <button
          className="btn btn-outline border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
);

const DocumentListShow = () => {
  const [servicesData, setServicesData] = useState([]); // Utiliser pour stocker les données structurées
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
  const [selectedServiceName, setSelectedServiceName] = useState("");
  const [selectedDocTypeName, setSelectedDocTypeName] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/services/directory"
        );
        const data = response.data.map((directory) => {
          const services = directory.services
            .split("|")
            .map((service) => JSON.parse(service));
          return {
            ...directory,
            services,
          };
        });
        setServicesData(data);
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
      const fetchDocTypesByService = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/document-types/services/${selectedService}/document-types`
          );
          setDocTypes(response.data);
        } catch (error) {
          setErrorMessage("Failed to fetch document types");
        }
      };

      fetchDocTypesByService();
    }
  }, [selectedService]);

  useEffect(() => {
    if (selectedDocType) {
      const fetchMetadataAndDocuments = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/metadata/type/${selectedDocType}`
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
        setDocumentLot(docResponseLot.data);
      }
    } catch (error) {
      console.error("Erreur chargement lots:", error);
      toast.error("Failed to fetch document lots");
    }
  };

  const handleOpenPieceDialog = (id) => {
    setPieceDialogOpen(true);
    setSelectedDocumentId(id);
  };

  const handleSavePieces = () => {
    // Implémentez la logique pour sauvegarder les pièces sélectionnées
  };

  const refreshDocuments = async () => {
    if (!selectedDocType) return;

    try {
      const docResponse = await axios.get(
        `http://localhost:3000/documents/type/pieces/${selectedDocType}`
      );
      if (docResponse.data) {
        setDocuments(docResponse.data);
      }
    } catch (error) {
      console.error("Erreur chargement documents:", error);
      toast.error("Échec du chargement des documents");
    }
  };

  const handleServiceChange = (event) => {
    const serviceId = event.target.value;
    const serviceName =
      servicesData
        .flatMap((directory) => directory.services)
        .find((service) => service.id === serviceId)?.nom_service || "";
    setSelectedService(serviceId);
    setSelectedServiceName(serviceName);
    setSelectedDocType("");
    setMetadataKeys([]);
    setDocuments([]);
    setSelectedDocument(null);
  };

  const handleDocTypeChange = (event) => {
    const docTypeId = event.target.value;
    const docTypeName =
      docTypes.find((docType) => docType.id === docTypeId)?.name || "";
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
        serviceName: selectedServiceName,
        docTypeName: selectedDocTypeName,
        documentTypeId: selectedDocumentTypeId,
      };

      await axios.post("http://localhost:3000/documents", dataToSend, {
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
        await axios.delete(`http://localhost:3000/documents/${docId}`);
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
        metadataKeys.some((key) =>
          (doc.metadata[key.field] || "").toLowerCase().includes(term)
        )
      );
    })
    .map((doc) => {
      const formattedDoc = {
        id: doc.id,
        created_at: new Date(doc.created_at).toLocaleDateString(),
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
            color="primary"
            onClick={() => handleOpenDetails(params.row)}
          >
            <Avatar className="bg-gray-500">
              <FolderCheckIcon style={{ color: "FFF" }} />
            </Avatar>
          </IconButton>
        </Tooltip>
      ),
    },
    { field: "created_at", headerName: "Date création", flex: 1 },
    ...metadataKeys,
    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
      renderCell: (params) => (
        <ActionContainer>
          <Tooltip title="View Details">
            <IconButton
              color="primary"
              onClick={() => handleOpenDetails(params.row)}
            >
              <ScanEye />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Document">
            <IconButton
              color="secondary"
              onClick={() => handleEdit(params.row)}
            >
              <SquarePen />
            </IconButton>
          </Tooltip>
          <Tooltip title="Select Pieces">
            <IconButton
              color="primary"
              onClick={() => handleOpenPieceDialog(params.row.id)}
            >
              <Link />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Document">
            <IconButton
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              <Trash2 />
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
        `http://localhost:3000/documents/${editFormData.id}`,
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
    <MainContainer>
      <Side_bar isVisible={true} />
      <ContentContainer>
        <TopBar />
        <h4 className=" font-bold text-gray-800 mb-1 text-xl mt-10 text-left w-full">
          <ArchiveIcon
            sx={{ fontSize: "32px" }}
            className="text-gray-800 mr-2 "
          />
          Liste des dossiers archivés
        </h4>

        <StyledBox>
          <div className="flex justify-between mb-3 gap-2">
            <div className="form-control w-1/2">
              <label className="label w-full flex items-center justify-start">
                <Building2 className="mr-2" />
                Liste des services
              </label>
              <select
                className="select select-bordered text-black bg-gray-200 border-gray-300"
                value={selectedService}
                onChange={(e) => handleServiceChange(e)}
              >
                <option value="">Sélectionner un service</option>
                {servicesData.map((directory) => (
                  <optgroup
                    className="text-black"
                    key={directory.directory_id}
                    label={directory.nom_directory}
                  >
                    {directory.services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.nom_service}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            {selectedService && (
              <div className="form-control w-1/2">
                <label className="label w-full flex items-center justify-start">
                  <Layers3 className="mr-2" />
                  Le type du document
                </label>
                <select
                  className="select select-bordered text-black bg-gray-200 border-gray-300"
                  value={selectedDocType}
                  onChange={(e) => handleDocTypeChange(e)}
                >
                  <option value="">Sélectionner un type de document</option>
                  {docTypes.map((docType) => (
                    <option key={docType.id} value={docType.id}>
                      {docType.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </StyledBox>

        <StyledBox>
          <div className="flex justify-between mb-3">
            <div className="form-control w-1/2">
              <label className="label w-full flex items-center justify-start">
                <Search className="mr-2" />
                Rechercher des documents...
              </label>
              <input
                type="text"
                placeholder="Rechercher des documents..."
                className="input input-bordered bg-gray-200 border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus />
              Nouveau
            </button>
          </div>

          <DataGrid
            rows={formattedDocuments}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            autoHeight
          />
        </StyledBox>

        <DetailsDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          document={selectedDocument}
          metadataKeys={metadataKeys}
          documentLot={documentLot}
          refreshDocuments={refreshDocuments}
          handleFileClick={handleFileClick} // Pass the function here
        />

        <CenteredModal
          open={createDialogOpen}
          onClose={handleCloseCreateDialog}
        >
          <div className="flex gap-2 justify-center items-center">
            <div className="avatar bg-gray-500 p-2 rounded-full">
              <FolderPlusIcon size="35px" color="white" />
            </div>
            <h5 className="font-bold text-gray-800 text-lg">
              Création d'un nouveau document
            </h5>
          </div>
          <div className="modal-content">
            <div className="grid grid-cols-1 gap-4 text-black">
              {metadataKeys.map((meta) => (
                <div key={meta.field} className="text-black">
                  <label className="label text-black">
                    <span className="label-text">{meta.headerName}</span>
                  </label>
                  <input
                    type={meta.metaType}
                    className="input input-bordered w-full bg-gray-400 hover:shadow- border-gray-300"
                    value={formData[meta.field] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [meta.field]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="modal-action">
            <button
              className="btn btn-outline border-2 w-full justify-center border-gray-400 text-gray-800 hover:bg-gray-400 hover:text-white"
              onClick={handleCreateDocument}
              disabled={loadingForm}
            >
              <Plus />{" "}
              {loadingForm ? <CircularProgress size={24} /> : "Créer document"}
            </button>
          </div>
        </CenteredModal>

        <PieceSelectionDialog
          open={pieceDialogOpen}
          onClose={() => setPieceDialogOpen(false)}
          onSave={handleSavePieces}
          documentId={selectedDocumentId}
          documentTypeId={selectedDocumentTypeId}
          onLoadAll={refreshDocuments}
        />

        <CenteredModal open={editDialogOpen} onClose={handleCloseEditDialog}>
          <div className="flex gap-2 justify-center items-center">
            <div className="avatar bg-gray-500 p-2 rounded-full">
              <SquarePen size="35px" color="white" />
            </div>
            <h5 className="font-bold text-gray-800 text-lg">
              Modifier le document
            </h5>
          </div>
          <div className="modal-content">
            <div className="grid grid-cols-1 gap-4 text-black">
              {metadataKeys.map((meta) => (
                <div key={meta.field} className="text-black">
                  <label className="label text-black">
                    <span className="label-text">{meta.headerName}</span>
                  </label>
                  <input
                    type={meta.metaType}
                    className="input input-bordered w-full bg-gray-400 hover:shadow- border-gray-300"
                    value={editFormData[meta.field] || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        [meta.field]: e.target.value,
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="modal-action">
            <button
              className="btn  btn-outline border-2 w-full justify-center border-gray-400 text-gray-800 hover:bg-gray-400 hover:text-white"
              onClick={handleUpdateDocument}
              disabled={loadingForm}
            >
              <RefreshCcw />{" "}
              {loadingForm ? (
                <CircularProgress size={24} />
              ) : (
                "Mettre à jour le document"
              )}
            </button>
          </div>
        </CenteredModal>

        <FilePreviewModal
          open={fileModalOpen}
          onClose={() => setFileModalOpen(false)}
          fileUrl={selectedFileUrl}
        />
      </ContentContainer>

      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-30">
          <CircularProgress />
        </div>
      )}
    </MainContainer>
  );
};

export default DocumentListShow;
