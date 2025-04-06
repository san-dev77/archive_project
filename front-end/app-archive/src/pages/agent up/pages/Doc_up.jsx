import { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { InfoOutlined } from "@mui/icons-material";
import ArchiveIcon from "@mui/icons-material/Archive";
import {
  ArrowUpDown,
  Building2,
  CircleX,
  DatabaseZap,
  Layers3,
  Search,
  FolderCheckIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress, IconButton, Tooltip, Avatar } from "@mui/material";
import Swal from "sweetalert2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import SideBar_up from "../components/Sidebar_up";
import TopBar_up from "../components/Topbar_up";

const MainContainer = ({ children }) => (
  <div className="flex w-full bg-gray-300">{children}</div>
);

const ContentContainer = ({ children }) => (
  <div className="mt-24 p-1 bg-gray-100 rounded-lg shadow-none flex flex-col h-screen overflow-auto mr-10 w-full ml-7">
    {children}
  </div>
);

const StyledBox = ({ children }) => (
  <div className="bg-white rounded-lg shadow-lg p-3 mb-4 overflow-x-auto">
    {children}
  </div>
);

const StyledBox2 = ({ children }) => (
  <div className="bg-gray-800 rounded-lg shadow-2xl p-3 mb-4 overflow-x-auto">
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
        className={`bg-[#2a2a2a] rounded-lg shadow-xl p-6 w-full ${maxWidthClasses[maxWidth]} mx-4`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const Doc_up = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState("");
  const [selectedDocType, setSelectedDocType] = useState("");
  const [servicesData, setServicesData] = useState([]);
  const [docTypes, setDocTypes] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading] = useState(false);
  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [metadataKeys, setMetadataKeys] = useState([]);
  const [documentLot, setDocumentLot] = useState([]);

  useEffect(() => {
    const dirId = localStorage.getItem("directory_id");
    if (dirId) {
      fetchServices(dirId);
    }
  }, []);

  const fetchServices = async (dirId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/services/directory/${dirId}`
      );
      setServicesData([
        {
          directory_id: dirId,
          nom_directory: "Services",
          services: response.data,
        },
      ]);
    } catch (error) {
      console.error("Erreur chargement services:", error);
      toast.error("Échec du chargement des services");
    }
  };

  useEffect(() => {
    if (selectedService) {
      fetchDocTypes();
    }
  }, [selectedService]);

  const fetchDocTypes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/document-types/services/${selectedService}/document-types`
      );
      setDocTypes(response.data);
    } catch (error) {
      console.error("Erreur chargement types:", error);
      toast.error("Échec du chargement des types de documents");
    }
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

      const lotResponse = await axios.get(
        `http://localhost:3000/documents/type/lot/${selectedDocType}`
      );

      if (lotResponse.data) {
        setDocumentLot(lotResponse.data);
      }
    } catch (error) {
      console.error("Erreur chargement documents:", error);
      toast.error("Échec du chargement des documents");
    }
  };

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
          }));

          setMetadataKeys(columns);
          await refreshDocuments();
        } catch (error) {
          console.error("Erreur chargement metadata:", error);
          toast.error("Échec du chargement des métadonnées");
        }
      };

      fetchMetadataAndDocuments();
      setSelectedDocumentTypeId(selectedDocType);
    }
  }, [selectedDocType]);

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
    setSelectedDocType("");
    setMetadataKeys([]);
    setDocuments([]);
    setSelectedDocument(null);
  };

  const handleDocTypeChange = (event) => {
    setSelectedDocType(event.target.value);
    setMetadataKeys([]);
    setDocuments([]);
    setSelectedDocument(null);
  };

  const handleFileClick = (fileUrl) => {
    setSelectedFileUrl(fileUrl);
    setFileModalOpen(true);
  };

  const columns = [
    {
      field: "preview",
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
    ...metadataKeys.map((key) => ({
      field: key.field,
      headerName: key.headerName,
      flex: 1,
      renderCell: (params) => (
        <div className="text-white">
          {params.row.metadata?.[key.field] || "N/A"}
        </div>
      ),
    })),
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
                background: "linear-gradient(to right, #00B7FF, #3b82f6)",
                color: "white",
                padding: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                ":hover": {
                  background: "linear-gradient(to right, #0091cc, #2563eb)",
                },
                transition: "all 0.2s ease",
              }}
              onClick={() => handleOpenDetails(params.row)}
            >
              <InfoOutlined />
            </IconButton>
          </Tooltip>
        </ActionContainer>
      ),
    },
  ];

  const formattedDocuments = documents
    .filter((doc) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        doc.created_at?.toLowerCase().includes(term) ||
        doc.code_unique?.toLowerCase().includes(term) ||
        metadataKeys.some((key) =>
          (doc.metadata?.[key.field] || "").toLowerCase().includes(term)
        )
      );
    })
    .map((doc) => {
      const formattedDoc = {
        id: doc.id,
        created_at: doc.created_at
          ? new Date(doc.created_at).toLocaleDateString()
          : "N/A",
        codification: doc.code_unique || "N/A",
        metadata: doc.metadata || {},
      };

      // Ajouter les métadonnées comme propriétés directes
      metadataKeys.forEach((key) => {
        formattedDoc[key.field] = doc.metadata?.[key.field] || "";
      });

      return formattedDoc;
    });

  const handleOpenDetails = (doc) => {
    const documentWithFiles = {
      ...doc,
      files: documents.find((d) => d.id === doc.id)?.files || [],
    };
    setSelectedDocument(documentWithFiles);
    setDialogOpen(true);
  };

  const DetailsDialog = ({
    open,
    onClose,
    document,
    metadataKeys,
    documentLot,
    refreshDocuments,
    handleFileClick,
    selectedDocType,
    setDocuments,
    setDocumentLot,
  }) => {
    const [isPieceMode, setIsPieceMode] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    return (
      <CenteredModal open={open} onClose={onClose} maxWidth="lg">
        <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-3">
          <div className="flex items-center">
            <InfoOutlined className="text-[#00B7FF] mr-2" />
            <h3 className="text-xl font-bold text-white">
              Détails du document
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition-all duration-200"
          >
            <CircleX size={18} />
          </button>
        </div>

        <button
          onClick={() => setIsPieceMode(!isPieceMode)}
          className="w-full px-4 py-3 mb-4 text-sm font-medium text-black transition-all duration-300 hover:text-white bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 rounded-lg flex items-center justify-center gap-2 shadow-md"
        >
          <ArrowUpDown />
          {isPieceMode ? "Passer au mode Lot" : "Passer au mode Pièce"}
        </button>

        <div className="bg-gradient-to-b from-[#3a3a3a] to-[#2a2a2a] rounded-lg p-4 max-h-[60vh] overflow-y-auto shadow-inner border border-gray-700">
          <table className="w-full table-fixed">
            <thead className="bg-[#1f1f1f] text-white sticky top-0 z-10">
              <tr>
                <th className="w-1/6 p-3 text-left rounded-tl-md">Aperçu</th>
                <th className="w-2/6 p-3 text-left">Metadonnées</th>
                <th className="w-3/6 p-3 text-left rounded-tr-md">Valeurs</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {document &&
                metadataKeys
                  .filter(
                    (meta, index, self) =>
                      index === self.findIndex((m) => m.field === meta.field)
                  )
                  .map((meta, index) => (
                    <tr
                      key={meta.field}
                      className={index % 2 === 0 ? "bg-[#333333]" : ""}
                    >
                      <td className="w-1/6 text-white border-b border-gray-600 p-3">
                        <div className="flex justify-center">
                          <DatabaseZap className="text-cyan-400" />
                        </div>
                      </td>
                      <td className="w-2/6 text-white border-b border-gray-600 p-3">
                        <p className="font-bold text-gray-100 truncate">
                          {meta.field}
                        </p>
                      </td>
                      <td className="w-3/6 p-3 text-white border-b border-gray-600">
                        <p className="text-gray-100 truncate">
                          {document.metadata?.[meta.field] || "N/A"}
                        </p>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </CenteredModal>
    );
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDocument(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-300">
      <SideBar_up isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar_up position="fixed" title="Documents" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-gray-800 w-full rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <ArchiveIcon
                  sx={{ fontSize: "32px" }}
                  className="text-[#00B7FF] mr-2"
                />
                Liste des dossiers archivés par services
              </h1>
            </div>

            <div className="bg-[#3a3a3a] rounded-lg p-4 mb-6">
              <div className="flex gap-4 mb-4">
                <div className="form-control w-1/2">
                  <label className="label w-full flex text-white items-center justify-start">
                    <Building2 className="mr-2" />
                    Liste des services
                  </label>
                  <select
                    className="select select-bordered text-black bg-gray-200 border-gray-300 w-full"
                    value={selectedService}
                    onChange={handleServiceChange}
                  >
                    <option value="">Sélectionner un service</option>
                    {servicesData.map((directory) => (
                      <optgroup
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
                    <label className="label w-full flex text-white items-center justify-start">
                      <Layers3 className="mr-2" />
                      Liste type de document
                    </label>
                    <select
                      className="select select-bordered text-black bg-gray-200 border-gray-300 w-full"
                      value={selectedDocType}
                      onChange={handleDocTypeChange}
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

              <div className="flex justify-between items-center mb-4">
                <div className="form-control w-1/2">
                  <label className="label w-full flex text-white items-center justify-start">
                    <Search className="mr-2" />
                    Rechercher des documents
                  </label>
                  <input
                    type="text"
                    placeholder="Rechercher des documents..."
                    className="input input-bordered bg-[#2a2a2a] text-white border-[#4a4a4a] w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-[#2a2a2a] rounded-lg p-4">
                <DataGrid
                  rows={formattedDocuments}
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
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-30">
            <CircularProgress />
          </div>
        )}
      </div>
      <DetailsDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        document={selectedDocument}
        metadataKeys={metadataKeys}
        documentLot={documentLot}
        refreshDocuments={refreshDocuments}
        handleFileClick={handleFileClick}
        selectedDocType={selectedDocType}
        setDocuments={setDocuments}
        setDocumentLot={setDocumentLot}
      />
    </div>
  );
};

export default Doc_up;
