import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  Search,
  Plus,
  FolderPlusIcon,
  SquarePen,
  RefreshCcw,
  ArrowUpDown,
  ScanEye,
  SquarePenIcon,
  Trash2,
  DatabaseZap,
  FileUp,
  Link,
  LayoutPanelTop,
  FolderCheckIcon,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar_UI from "../components_UI/Sidebar_UI";
import TopBar from "../../../Components/Top_bar";
import PieceSelectionDialog from "../../../pages/afficher/Pieces_upload";
import { InfoOutlined } from "@mui/icons-material";
import TopBar_UI from "../components_UI/Top_bar_UI";
import { CircularProgress, IconButton, Tooltip, Avatar } from "@mui/material";
import { useParams } from "react-router-dom";
import ReactDOM from "react-dom";

const MainContainer = ({ children }) => (
  <div className="flex w-full  bg-gray-300">{children}</div>
);

const ContentContainer = ({ children }) => (
  <div className="flex-1 flex flex-col">
    <div className="container w-full mx-auto px-4 py-8 mt-20">
      <div className="bg-gray-800 w-full rounded-lg shadow-lg p-6">
        {children}
      </div>
    </div>
  </div>
);

const StyledBox = ({ children }) => (
  <div className="bg-[#3a3a3a] rounded-lg p-4">{children}</div>
);

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 m-4 max-w-xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const DetailsTable = ({ children }) => (
  <div className="max-h-96 mt-2 overflow-auto">{children}</div>
);

const DetailsDialog = ({
  open,
  onClose,
  document,
  metadataKeys,
  documentLot,
  refreshDocuments,
}) => {
  const [isPieceMode, setIsPieceMode] = useState(true);

  if (!open) return null;

  const toggleMode = () => {
    setIsPieceMode(!isPieceMode);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const handleDeleteFile = async (pieceName, type) => {
    console.log(pieceName);
    try {
      // Rechercher les fichiers associés à la pièce
      const filesToDelete = document.files.filter(
        (file) => file.pieceName === pieceName
      );

      // Supprimer chaque fichier associé
      for (const file of filesToDelete) {
        await axios.delete(
          `http://localhost:3000/documents/${document.id}/delete-replace`,
          {
            data: {
              type,
              filePath: file.filePath,
              documentId: document.id,
              piece: file.pieceName, // Assurez-vous que pieceId est disponible dans file
            },
          }
        );
      }

      toast.success("Fichier(s) supprimé(s) avec succès!");
      // Actualiser les documents après suppression
      refreshDocuments();
    } catch (error) {
      toast.error("Échec de la suppression du fichier");
    }
  };

  const handleReplaceFile = async (fileId, type, newFile) => {
    const formData = new FormData();
    formData.append("file", newFile);
    formData.append("type", type);
    formData.append("documentId", document.id);
    try {
      await axios.put(
        `http://localhost:3000/documents/${document.id}/delete-replace`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Fichier remplacé avec succès!");
      // Actualiser les documents après remplacement
      refreshDocuments();
    } catch (error) {
      toast.error("Échec du remplacement du fichier");
    }
  };

  const handleFileChange = (fileId, type) => (event) => {
    const newFile = event.target.files[0];
    handleReplaceFile(fileId, type, newFile);
  };

  return (
    <div className="flex flex-col">
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
        </button>
        <DetailsTable>
          <table className="table w-full">
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
                            onClick={() => window.open(file.fileUrl, "_blank")}
                          />
                        </td>
                        <td className="text-gray-800 w-full">
                          {file.pieceName}
                        </td>
                        <td>
                          <span
                            className="text-gray-800 cursor-pointer hover:text-blue-500"
                            onClick={() => window.open(file.fileUrl, "_blank")}
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
                          <FileUp
                            className="cursor-pointer"
                            onClick={() => window.open(file.fileUrl, "_blank")}
                          />
                        </td>
                        <td
                          className="text-gray-800 w-full hover:text-blue-500 cursor-pointer"
                          onClick={() => window.open(file.fileUrl, "_blank")}
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
    </div>
  );
};

const ActionContainer = ({ children }) => (
  <div className="flex justify-between items-center gap-1">{children}</div>
);

const Document_UI = () => {
  const [metadataKeys, setMetadataKeys] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [pieceDialogOpen, setPieceDialogOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [editFormData, setEditFormData] = useState({});
  const [loadingForm, setLoadingForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const documentTypeId = useParams().docTypeId;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (documentTypeId) {
      fetchMetadataByType();
      fetchDocuments();
    }
  }, [documentTypeId]);

  const fetchMetadataByType = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/metadata/type/${documentTypeId}`
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
    } catch (error) {
      toast.error("Failed to fetch metadata");
    }
  };

  const fetchDocuments = async () => {
    if (!documentTypeId) return;

    try {
      const response = await axios.get(
        `http://localhost:3000/documents/type/pieces/${documentTypeId}`
      );
      if (response.data) {
        setDocuments(response.data);
      }
    } catch (error) {
      console.error("Erreur chargement documents:", error);
      toast.error("Échec du chargement des documents");
    }
  };

  const handleOpenPieceDialog = (id) => {
    setPieceDialogOpen(true);
    setSelectedDocument(id);
  };

  const handleSavePieces = (selectedPieces) => {
    // Implémentez la logique pour sauvegarder les pièces sélectionnées
  };

  const handleCreateDocument = async (event) => {
    event.preventDefault();
    if (!documentTypeId) return;

    setIsLoading(true);
    try {
      const dataToSend = {
        ...formData,
        documentTypeId: documentTypeId,
        // La codification sera générée côté serveur
      };

      await axios.post("http://localhost:3000/documents", dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setFormData({});
      setCreateDialogOpen(false);

      setTimeout(async () => {
        await fetchDocuments();
        toast.success("Document créé avec succès!");
      }, 100);
    } catch (error) {
      console.error("Erreur création document:", error);
      toast.error("Échec de la création du document");
    } finally {
      setIsLoading(false);
      setLoadingForm(false);
    }
  };

  const handleUpdateDocument = async (event) => {
    event.preventDefault();
    if (!documentTypeId || !editFormData.id) return;

    setIsLoading(true);
    try {
      const dataToSend = {
        ...editFormData,
        documentTypeId: documentTypeId,
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
        await fetchDocuments();
        toast.success("Document mis à jour avec succès!");
      }, 100);
    } catch (error) {
      console.error("Erreur mise à jour document:", error);
      toast.error("Échec de la mise à jour du document");
    } finally {
      setIsLoading(false);
      setLoadingForm(false);
    }
  };

  const handleDelete = async (docId) => {
    try {
      await axios.delete(`http://localhost:3000/documents/${docId}`);
      fetchDocuments();
      toast.success("Document supprimé avec succès!");
    } catch (error) {
      toast.error("Échec de la suppression du document");
    }
  };

  const formattedDocuments = documents.map((doc) => {
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

  const filteredDocuments = formattedDocuments.filter((doc) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      doc.created_at.toLowerCase().includes(term) ||
      doc.codification?.toLowerCase().includes(term) ||
      metadataKeys.some((key) =>
        (doc[key.field] || "").toLowerCase().includes(term)
      )
    );
  });

  const columns = [
    {
      field: "icon",
      headerName: "",
      width: 70,
      renderCell: (params) => (
        <Tooltip title="View Details">
          <IconButton
            className="bg-gray-800 p-2"
            onClick={() => handleOpenDetails(params.row)}
          >
            <Avatar sx={{ borderRadius: "50%", background: "#fff" }}>
              <FolderCheckIcon style={{ color: "#333" }} />
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
          <Tooltip title="View Details">
            <IconButton
              sx={{
                borderRadius: "50%",
                background: "#0059b3",
                color: "white",
                ":hover": { color: "black" },
              }}
              onClick={() => handleOpenDetails(params.row)}
            >
              <ScanEye />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Document">
            <IconButton
              sx={{
                borderRadius: "50%",
                background: "#862d86",
                color: "white",
                ":hover": { color: "black" },
              }}
              onClick={() => handleEdit(params.row)}
            >
              <SquarePen />
            </IconButton>
          </Tooltip>
          <Tooltip title="Select Pieces">
            <IconButton
              sx={{
                borderRadius: "50%",
                background: "#6666ff",
                color: "white",
                ":hover": { color: "black" },
              }}
              onClick={() => handleOpenPieceDialog(params.row.id)}
            >
              <Link />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Document">
            <IconButton
              sx={{
                borderRadius: "50%",
                background: "crimson",
                color: "white",
                ":hover": { color: "black" },
              }}
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
    setSelectedDocument(doc);
    setDialogOpen(true);
  };

  const handleEdit = (doc) => {
    setEditFormData(doc);
    setEditDialogOpen(true);
  };

  // Ajout d'un useEffect pour gérer le nettoyage
  useEffect(() => {
    return () => {
      setDocuments([]);
      setMetadataKeys([]);
      setFormData({});
      setEditFormData({});
      setSelectedDocument(null);
    };
  }, []);

  return (
    <MainContainer>
      <SideBar_UI isVisible={true} />
      <ContentContainer>
        <TopBar_UI />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <LayoutPanelTop className="h-8 w-8 text-[#00B7FF] mr-2" />
            Liste des dossiers archivés
          </h1>
          <button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-white hover:bg-gray-700 text-black hover:text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau Document
          </button>
        </div>

        <StyledBox>
          <div className="flex justify-between mb-6">
            <div className="flex-1 mr-4">
              <label className="block text-sm font-medium text-white mb-1">
                Rechercher des documents
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher des documents..."
                  className="w-full px-4 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-[#2a2a2a] rounded-lg p-4">
            <DataGrid
              rows={filteredDocuments}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              autoHeight
              className="bg-[#2a2a2a] text-white"
              sx={{
                "& .MuiDataGrid-cell": {
                  color: "white",
                  borderColor: "#4a4a4a",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#1f1f1f",
                  color: "black",
                  borderColor: "#4a4a4a",
                },
                "& .MuiDataGrid-footerContainer": {
                  backgroundColor: "#1f1f1f",
                  color: "white",
                  borderColor: "#4a4a4a",
                },
                "& .MuiTablePagination-root": {
                  color: "white",
                },
                "& .MuiIconButton-root": {
                  color: "white",
                },
              }}
            />
          </div>
        </StyledBox>

        {dialogOpen && (
          <Modal open={true} onClose={() => setDialogOpen(false)}>
            <DetailsDialog
              open={true}
              document={selectedDocument}
              metadataKeys={metadataKeys}
              documentLot={documents}
              refreshDocuments={fetchDocuments}
            />
          </Modal>
        )}

        {createDialogOpen && (
          <Modal open={true} onClose={() => setCreateDialogOpen(false)}>
            <div className="bg-[#2a2a2a] rounded-lg shadow-xl p-6 w-full max-w-lg">
              <div className="flex gap-2 justify-center items-center mb-4">
                <div className="avatar bg-[#00B7FF] p-2 rounded-full">
                  <FolderPlusIcon size="35px" color="white" />
                </div>
                <h5 className="font-bold text-white text-lg">
                  Création d'un nouveau document
                </h5>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {metadataKeys.map((meta) => (
                  <div key={meta.field}>
                    <label className="block text-sm font-medium text-white mb-1">
                      {meta.headerName}
                    </label>
                    <input
                      type={meta.metaType}
                      className="w-full px-3 py-2 bg-[#3a3a3a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                      value={formData[meta.field] || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [meta.field]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-[#4a4a4a] rounded-lg hover:bg-[#5a5a5a]"
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Annuler
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-[#00B7FF] rounded-lg hover:bg-[#0096FF]"
                  onClick={handleCreateDocument}
                  disabled={loadingForm}
                >
                  {loadingForm ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Créer document"
                  )}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {editDialogOpen && (
          <Modal open={true} onClose={() => setEditDialogOpen(false)}>
            <div className="flex gap-2 justify-center items-center mb-4">
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
                className="btn btn-outline border-2 w-full justify-center border-gray-400 text-gray-800 hover:bg-gray-400 hover:text-white"
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
          </Modal>
        )}

        <PieceSelectionDialog
          open={pieceDialogOpen}
          onClose={() => setPieceDialogOpen(false)}
          onSave={handleSavePieces}
          documentId={selectedDocument}
          documentTypeId={documentTypeId}
        />

        {isLoading && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-30">
            <CircularProgress />
          </div>
        )}
      </ContentContainer>
    </MainContainer>
  );
};

export default Document_UI;
