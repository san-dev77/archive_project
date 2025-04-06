import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "daisyui/dist/full.css";
import Sidebar_agence from "../../../Components/Sidebar_agence";
import TopBar from "../../../Components/Top_bar";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Eye,
  Folder,
  FolderClosed,
  Link,
  SquarePen,
  Trash2,
  ChevronDown,
  Filter,
  Plus,
  X,
} from "lucide-react";
import PieceUploadModal from "../../../Components/PieceUploadModal";
import ViewCaisseFile from "../../../Components/ViewCaisseFile";
import Loader_component from "../../../Components/Loader";
import { showDeleteConfirmation } from "../../../utils/alerts";
import Swal from "sweetalert2";
import { Tooltip } from "@mui/material";

const createAgence = async (agence) => {
  await axios.post("http://localhost:3000/agences", agence);
};

export default function Dossier() {
  const [openModal, setOpenModal] = useState(false);
  const [currentAgence, setCurrentAgence] = useState({
    id: "",
    nom_agence: "",
    code_agence: "",
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("");
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState("");
  const [selectedRowId, setSelectedRowId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [allData, setAllData] = useState([]);
  const [isRangeFilter, setIsRangeFilter] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [openDisplayModal, setOpenDisplayModal] = useState(false);
  const [agencyFilter, setAgencyFilter] = useState("");
  const [selectedId, setSelectedId] = useState(0);
  const [editData, setEditData] = useState({
    nom_prenom_caissier: "",
    code_definitif: "",
    dates: "",
  });
  const [openEditModal, setOpenEditModal] = useState(false);
  const [caissierFilter, setCaissierFilter] = useState("");
  const [caisseFilter, setCaisseFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let apiUrl;
      switch (selectedType) {
        case "journée de caisse":
          apiUrl = "http://localhost:3000/agence/dossiers/transaction-caisse";
          break;
        case "Journée de guichet":
          apiUrl = "http://localhost:3000/agence/dossiers/transaction-guichet";
          break;
        default:
          apiUrl = "http://localhost:3000/agence/dossiers/transaction-dossiers";
      }

      try {
        const response = await axios.get(apiUrl);
        setData(response.data);
        setAllData(response.data);
      } catch (error) {
        toast.error("Erreur lors de la récupération des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedType]);

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/agence/document-type"
        );
        setDocumentTypes(response.data);
        if (response.data.length > 0) {
          setSelectedDocumentTypeId(response.data[0].id);
        }
      } catch (error) {
        toast.error("Erreur lors de la récupération des types de documents.");
      }
    };

    fetchDocumentTypes();
  }, []);

  const handleLinkClick = (rowId) => {
    setOpenUploadModal(true);
    setSelectedRowId(rowId);
  };

  const handleRowClick = async (rowId) => {
    if (expandedRowId === rowId) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(rowId);
    }
  };

  const handleDisplayClick = (rowId) => {
    setOpenDisplayModal(true);
    setSelectedRowId(rowId);
  };

  const handleDelete = async (rowId) => {
    const confirm = await showDeleteConfirmation(); // Ensure confirmation is awaited
    if (confirm) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/agence/transaction_caisse/${rowId}`
        );
        if (response.status === 200) {
          toast.success("Document supprimé avec succès");

          Swal.fire({
            title: "Ligne supprimé",
            text: "Cette ligne a été supprimé avec succès !",
            icon: "success",
            confirmButtonText: "OK",
          });
          const updatedData = data.filter((row) => row.id !== rowId);
          setData(updatedData);
        }
      } catch (error) {
        toast.error("Erreur lors de la suppression du document");
      }
    }
  };
  const handleEditClick = (row) => {
    console.log(row);

    // Formatage de la date
    let formattedDate = "";
    if (row.dates) {
      const date = new Date(row.dates);
      if (!isNaN(date.getTime())) {
        formattedDate = date.toISOString().split("T")[0];
      }
    }

    setSelectedId(row.id);
    setEditData({
      nom_prenom_caissier: row.nom_prenom_caissier,
      code_definitif: row.code_definitif,
      dates: formattedDate,
    });
    setOpenEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/agence/transaction_caisse/edit/${selectedId}`,
        editData
      );
      toast.success("Document modifié avec succès");
      Swal.fire({
        title: "Element modifié",
        icon: "success",
        text: "Ligne modifié avec succès, les changements prendront effet après la reactulisation.",
        confirmButtonText: " OK",
      });
      const updatedData = data.map((row) => {
        if (row.id === selectedRowId) {
          return response.data;
        }
        return row;
      });
      setData(updatedData);
      setOpenEditModal(false);
    } catch (error) {
      toast.error("Erreur lors de la modification du document");
    }
  };

  const getColumns = () => {
    switch (selectedType) {
      case "transaction-dossiers":
        return [
          { field: "nom_agence", headerName: "Agence", width: 150 },
          { field: "code_caisse_nom", headerName: "Code Caisse", width: 150 },
          {
            field: "nom_document_type",
            headerName: "Type Document",
            width: 150,
          },
          {
            field: "dates",
            headerName: "Date",
            width: 150,
            renderCell: (params) => params.value,
          },
          {
            field: "nom_prenom_caissier",
            headerName: "Nom & Prénom",
            width: 150,
          },
          { field: "code_definitif", headerName: "Code definitif", width: 150 },
          {
            field: "actions",
            headerName: "Actions",
            width: 300,
            renderCell: (params) => (
              <div className="flex space-x-2">
                <Tooltip title="Charger fichiers">
                  <button
                    className="btn btn-default rounded-lg bg-gray-600 text-white hover:bg-blue-600 transition duration-300 shadow-md"
                    onClick={() => handleLinkClick(params.row.id)}
                  >
                    <Link size={20} />
                  </button>
                </Tooltip>
                <button
                  className="btn btn-default rounded-lg bg-gray-600 text-white hover:bg-blue-600 transition duration-300 shadow-md"
                  onClick={() => handleEditClick(params.row)}
                >
                  <SquarePen size={20} />
                </button>
                <button
                  className="btn btn-default rounded-lg bg-gray-600 text-white hover:bg-red-400 transition duration-300 shadow-md"
                  onClick={() => handleDelete(params.row.id)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ),
          },
        ];
      case "journée de caisse":
        return [
          { field: "nom_agence", headerName: "Agence", width: 100 },
          { field: "code_caisse_nom", headerName: "Code Caisse", width: 100 },
          {
            field: "dates",
            headerName: "Date",
            width: 100,
            renderCell: (params) => params.value,
          },
          {
            field: "nom_prenom_caissier",
            headerName: "Nom & Prénom",
            width: 150,
          },
          {
            field: "code_definitif",
            headerName: "Code definitif",
            width: 150,
          },
          {
            field: "actions",
            headerName: "Actions",
            width: 270,
            renderCell: (params) => (
              <div className="flex space-x-2 justify-between">
                <Tooltip title="Charger fichiers">
                  <button className="btn btn-default btn-circle bg-gray-800 text-white hover:bg-indigo-300 transition duration-300 shadow-md">
                    <Link
                      size={20}
                      onClick={() => handleLinkClick(params.row.id)}
                    />
                  </button>
                </Tooltip>
                <Tooltip title="Modifier données">
                  <button
                    className="btn btn-default btn-circle bg-gray-800 text-white hover:bg-emerald-300 transition duration-300 shadow-md"
                    onClick={() => handleEditClick(params.row)}
                  >
                    <SquarePen size={20} />
                  </button>
                </Tooltip>
                <Tooltip title="voir fichirrs">
                  <button
                    className="btn btn-default btn-circle bg-gray-800 text-white hover:bg-amber-300 transition duration-300 shadow-md"
                    onClick={() => handleDisplayClick(params.row.id)}
                  >
                    <Eye size={25} />
                  </button>
                </Tooltip>
                <Tooltip title="Supprimer">
                  <button
                    className="btn btn-default btn-circle bg-rose-500 text-white hover:bg-rose-300 transition duration-300 shadow-md"
                    onClick={() => handleDelete(params.row.id)}
                  >
                    <Trash2 size={20} />
                  </button>
                </Tooltip>
              </div>
            ),
          },
        ];
      case "Journée de guichet":
        return [
          {
            field: "",
            headerName: "",
            width: 90,
            renderCell: () => (
              <div className="flex space-x-2">
                <FolderClosed size={40} />
              </div>
            ),
          },
          { field: "nom_agence", headerName: "Agence", width: 150 },
          {
            field: "nom_prenom_caissier",
            headerName: "Nom et prenom caissier",
            width: 150,
          },
          {
            field: "dates",
            headerName: "Date",
            width: 100,
            renderCell: (params) => params.value,
          },
          { field: "code_boite", headerName: "Code Boite", width: 150 },
          {
            field: "actions",
            headerName: "Actions",
            width: 150,
            renderCell: (params) => (
              <div className="flex space-x-2">
                <button
                  className="btn btn-default rounded-lg bg-gray-600 text-white hover:bg-blue-600 transition duration-300 shadow-md"
                  onClick={() => handleEditClick(params.row)}
                >
                  <SquarePen size={20} />
                </button>
                <button
                  className="btn btn-default rounded-lg bg-gray-600 text-white hover:bg-red-400 transition duration-300 shadow-md"
                  onClick={() => handleDelete(params.row.id)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ),
          },
        ];
      default:
        return [];
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createAgence(currentAgence);
    setCurrentAgence({ id: "", nom_agence: "", code_agence: "" });
    setOpenModal(false);
  };

  const applyFilter = () => {
    let filteredData = allData;

    if (caissierFilter) {
      filteredData = filteredData.filter((item) =>
        item.nom_prenom_caissier
          .toLowerCase()
          .includes(caissierFilter.toLowerCase())
      );
    }

    if (agencyFilter) {
      filteredData = filteredData.filter((item) =>
        item.nom_agence.toLowerCase().includes(agencyFilter.toLowerCase())
      );
    }

    if (caisseFilter) {
      filteredData = filteredData.filter((item) =>
        item.code_caisse_nom?.toLowerCase().includes(caisseFilter.toLowerCase())
      );
    }

    if (isRangeFilter && startDate && endDate) {
      filteredData = filteredData.filter((item) => {
        try {
          const itemDate = new Date(item.dates).getTime();
          const start = new Date(startDate).getTime();
          const end = new Date(endDate).getTime();
          return itemDate >= start && itemDate <= end;
        } catch (error) {
          console.error("Date invalide:", item.dates);
          return false;
        }
      });
    } else if (startDate) {
      filteredData = filteredData.filter((item) => {
        try {
          // Formatage des dates pour la comparaison
          const itemDate = new Date(item.dates);
          const formattedItemDate = itemDate.toLocaleDateString("fr-FR");
          const searchDate = new Date(startDate);
          const formattedSearchDate = searchDate.toLocaleDateString("fr-FR");
          return formattedItemDate === formattedSearchDate;
        } catch (error) {
          console.error("Date invalide:", item.dates);
          return false;
        }
      });
    }

    if (filteredData.length === 0) {
      toast.warn("Aucune donnée ne correspond aux critères de filtrage.");
    } else {
      toast.success(`${filteredData.length} résultat(s) trouvé(s)`);
    }

    setData(filteredData);
    setIsFilterModalOpen(false);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader_component className="loader" />
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <Sidebar_agence isVisible={true} className="w-1/4" />
      <div className=" flex-1 mr-5 flex overflow-x-auto ml-10   flex-col ">
        <TopBar position="fixed" title="Dossiers" />

        <div className="container flex items-center justify-center mx-auto px-4 py-8 mt-20 w-[90%] ">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-gray-800 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-[#00B7FF]/10 rounded-lg">
                    <Folder className="h-8 w-8 text-[#00B7FF]" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      Gestion des Dossiers
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                      Gérez et organisez vos documents
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Total Documents</p>
                    <p className="text-white text-xl font-bold">
                      {data.length}
                    </p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Types de Documents</p>
                    <p className="text-white text-xl font-bold">
                      {documentTypes.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-b border-gray-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex-1 w-full">
                  <div className="relative">
                    <select
                      value={selectedType || "Sélectionnez un type"}
                      onChange={(e) => {
                        setSelectedType(e.target.value);
                        const selectedTypeObj = documentTypes.find(
                          (type) => type.nom_document_type === e.target.value
                        );
                        if (selectedTypeObj) {
                          setSelectedDocumentTypeId(selectedTypeObj.id);
                        }
                      }}
                      className="w-full px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent appearance-none cursor-pointer"
                    >
                      <option value="Sélectionnez un type">
                        Sélectionnez un type de document
                      </option>
                      {documentTypes.map((type) => (
                        <option key={type.id} value={type.nom_document_type}>
                          {type.nom_document_type}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-x-auto ">
              <DataGrid
                rows={data}
                columns={getColumns()}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10 },
                  },
                  sorting: {
                    sortModel: [{ field: "dates", sort: "desc" }],
                  },
                }}
                pageSizeOptions={[5, 10, 25, 50]}
                autoHeight
                loading={loading}
                components={{
                  Toolbar: GridToolbar,
                }}
                getRowClassName={(params) =>
                  params.id === expandedRowId ? "expanded-row" : ""
                }
                sx={{
                  width: "100%",
                  "& .MuiDataGrid-root": {
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    maxWidth: "100%",
                  },
                  "& .MuiDataGrid-cell": {
                    borderColor: "#e5e7eb",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f9fafb",
                    borderBottom: "2px solid #e5e7eb",
                  },
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#f9fafb",
                  },
                  "& .MuiDataGrid-virtualScroller": {
                    overflowX: "auto",
                  },
                  "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell": {
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="bg-gray-800 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtrer les données
              </h3>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom et Prénom du Caissier
                  </label>
                  <input
                    type="text"
                    value={caissierFilter}
                    onChange={(e) => setCaissierFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B7FF] focus:border-transparent"
                    placeholder="Rechercher un caissier..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={applyFilter}
                  className="px-4 py-2 text-white bg-[#00B7FF] rounded-lg hover:bg-[#0096CC] transition-colors"
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {openModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={() => setOpenModal(false)}
        >
          <div
            className="bg-[#2a2a2a] rounded-lg shadow-xl p-6 w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setOpenModal(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg">
              {currentAgence.id
                ? "Modifier l'agence"
                : "Creer une nouvelle agence"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-control mt-4">
                <label className="label">Code de l&apos;agence</label>
                <input
                  type="text"
                  value={currentAgence.code_agence}
                  onChange={(e) =>
                    setCurrentAgence({
                      ...currentAgence,
                      code_agence: e.target.value,
                    })
                  }
                  className="input input-bordered border-2 border-gray-300 bg-white text-black"
                  required
                />
              </div>
              <div className="form-control mt-4">
                <label className="label">Nom de l&apos;agence</label>
                <input
                  type="text"
                  value={currentAgence.nom_agence}
                  onChange={(e) =>
                    setCurrentAgence({
                      ...currentAgence,
                      nom_agence: e.target.value,
                    })
                  }
                  className="input input-bordered border-2 border-gray-300 bg-white text-black"
                  required
                />
              </div>
              <div className="modal-action flex justify-center items-center">
                <button
                  type="submit"
                  className="btn border-t-neutral-700 w-[40%] bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg"
                >
                  {currentAgence.id ? "Mettre à jour" : "Ajouter"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-error w-[40%] mt-2"
                  onClick={() => setOpenModal(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {openUploadModal && (
        <PieceUploadModal
          onClose={() => {
            setOpenUploadModal(false);
          }}
          documentTypeId={String(selectedDocumentTypeId)}
          rowId={String(selectedRowId)}
        />
      )}

      {openDisplayModal && (
        <ViewCaisseFile
          onClose={() => setOpenDisplayModal(false)}
          documentTypeId={String(selectedDocumentTypeId)}
        />
      )}

      {openEditModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 100,
          }}
          onClick={() => setOpenEditModal(false)}
        >
          <div
            className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setOpenEditModal(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg">Modifier le document</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-control mt-4">
                <label className="label">Nom du caissier</label>
                <input
                  type="text"
                  value={editData.nom_prenom_caissier}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      nom_prenom_caissier: e.target.value,
                    })
                  }
                  className="input input-bordered border-2 border-gray-300 bg-white text-black"
                  required
                />
              </div>
              <div className="form-control mt-4">
                <label className="label">Code définitif</label>
                <input
                  type="text"
                  value={editData.code_definitif}
                  onChange={(e) =>
                    setEditData({ ...editData, code_definitif: e.target.value })
                  }
                  className="input input-bordered border-2 border-gray-300 bg-white text-black"
                  required
                />
              </div>
              <div className="form-control mt-4">
                <label className="label">Date</label>
                <input
                  type="date"
                  value={editData.dates}
                  onChange={(e) =>
                    setEditData({ ...editData, dates: e.target.value })
                  }
                  className="input input-bordered border-2 border-gray-300 bg-white text-black"
                  required
                />
              </div>
              <div className="modal-action flex justify-center items-center">
                <button
                  type="submit"
                  className="btn border-t-neutral-700 w-[40%] bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg"
                >
                  Mettre à jour
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-error w-[40%] mt-2"
                  onClick={() => setOpenEditModal(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
