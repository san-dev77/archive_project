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
} from "lucide-react";
import PieceUploadModal from "../../../Components/PieceUploadModal";
import ViewCaisseFile from "../../../Components/ViewCaisseFile";
import Loader_component from "../../../Components/Loader";

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
  const [agencyFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let apiUrl;
      switch (selectedType) {
        // case "transaction-dossiers":
        //   apiUrl = "http://localhost:3000/agence/dossiers/transaction-dossiers";
        //   break;
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
    console.log("Link button clicked");
    setOpenUploadModal(true);
    setSelectedRowId(rowId);
  };

  const handleRowClick = async (rowId) => {
    if (expandedRowId === rowId) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(rowId);
      try {
        const response = await axios.get(
          `http://localhost:3000/agence/dossiers/${rowId}`
        );
        console.log(response.data);
      } catch (error) {
        toast.error(
          "Erreur lors de la récupération des données supplémentaires."
        );
      }
    }
  };

  const handleDisplayClick = (rowId) => {
    console.log("Display button clicked");
    setOpenDisplayModal(true);
    setSelectedRowId(rowId);
  };

  const getColumns = () => {
    console.log(selectedType);

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
                <button
                  className="btn btn-default rounded-lg bg-gray-600 text-white hover:bg-blue-600 transition duration-300 shadow-md"
                  onClick={() => handleLinkClick(params.row.id)}
                >
                  <Link size={20} />
                </button>

                <button className="btn btn-default rounded-lg bg-gray-600 text-white hover:bg-blue-600 transition duration-300 shadow-md">
                  <SquarePen size={20} />
                </button>
                <button className="btn btn-default rounded-lg bg-gray-600 text-white hover:bg-red-400 transition duration-300 shadow-md">
                  <Trash2 size={20} />
                </button>
              </div>
            ),
          },
          {
            field: "expand",
            headerName: "Détails",
            width: 100,
            renderCell: (params) => (
              <button onClick={() => handleRowClick(params.row.id)}>
                {expandedRowId === params.row.id ? "Réduire" : "Étendre"}
              </button>
            ),
          },
        ];
      case "journée de caisse":
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
          { field: "code_caisse_nom", headerName: "Code Caisse", width: 150 },
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
          {
            field: "actions",
            headerName: "Actions",
            width: 270,
            renderCell: (params) => (
              <div className="flex space-x-2">
                <button className="btn btn-default rounded-lg bg-gray-600 text-white hover:bg-blue-300 transition duration-300 shadow-md">
                  <Link
                    size={20}
                    onClick={() => handleLinkClick(params.row.id)}
                  />
                </button>
                <button className="btn btn-default rounded-lg bg-gray-600 text-white hover:bg-blue-600 transition duration-300 shadow-md">
                  <SquarePen size={20} />
                </button>

                <button
                  className="btn btn-default rounded-lg bg-gray-600 text-white hover:bg-orange-400 transition duration-300 shadow-md"
                  onClick={() => handleDisplayClick(params.row.id)}
                >
                  <Eye size={25} />
                </button>
                <button className="btn btn-default rounded-lg bg-gray-600 text-white hover:bg-red-400 transition duration-300 shadow-md">
                  <Trash2 size={20} />
                </button>
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
            width: 250,
          },
          {
            field: "dates",
            headerName: "Date",
            width: 150,
            renderCell: (params) => params.value,
          },
          {
            field: "code_boite",
            headerName: "Code Boite",
            width: 150,
          },
          {
            field: "actions",
            headerName: "Actions",
            width: 150,
            renderCell: () => (
              <div className="flex space-x-2">
                <button className="btn btn-default rounded-lg bg-gray-600 text-white hover:bg-blue-600 transition duration-300 shadow-md">
                  <SquarePen size={20} />
                </button>
                <button className="btn btn-default rounded-lg bg-gray-600 text-white hover:bg-red-400 transition duration-300 shadow-md">
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

    // Filtrage par terme dans toutes les colonnes
    if (agencyFilter) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some((value) => {
          // Convertir la valeur en chaîne et normaliser
          const stringValue = value ? value.toString().toLowerCase() : "";
          return stringValue.includes(agencyFilter.toLowerCase());
        })
      );
    }

    if (isRangeFilter) {
      // Filtrage par intervalle de dates
      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.dates);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return itemDate >= start && itemDate <= end;
      });
    } else {
      // Filtrage par date unique (date de début)
      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.dates);
        const start = new Date(startDate);
        return itemDate === start;
      });
    }

    // Vérifiez si filteredData est vide
    if (filteredData.length === 0) {
      toast.warn("Aucune donnée ne correspond aux critères de filtrage.");
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
    <div className="flex min-h-screen mt-8 bg-gray-300 to-gray-900">
      <Sidebar_agence isVisible={true} className="w-1/4" />
      <div className="flex flex-col w-3/4">
        <TopBar position="fixed" title="Agences" />

        <div className="container w-[90%] mx-auto mt-16 bg-white rounded-xl shadow-2xl flex flex-col h-auto">
          <div className="w-full">
            <h1 className="w-full flex items-center p-5 rounded-md justify-start gap-2 text-black font-bold text-lg bg-gray-400 mt-2">
              <Folder size={35} />
              Dossiers
            </h1>
          </div>
          <div className="w-full flex items-center justify-between p-4">
            <h1 className="text-2xl font-extrabold text-gray-800 mb-4">
              {selectedType === "journée de caisse"
                ? "Journée de caisse"
                : selectedType === "Journée de guichet"
                ? "Journée de guichet"
                : selectedType === "transaction-dossiers"
                ? "transaction-dossiers"
                : "Sélectionnez un type"}
            </h1>
            <div className="flex justify-end mb-4 w-1/2">
              <select
                value={selectedType || "Sélectionnez un type"}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  const selectedTypeObj = documentTypes.find(
                    (type) => type.nom_document_type === e.target.value
                  );
                  console.log(selectedTypeObj);
                  if (selectedTypeObj) {
                    setSelectedDocumentTypeId(selectedTypeObj.id);
                  }
                }}
                className="select select-bordered bg-gray-300 text-black w-full max-w-xs"
              >
                <option value="Sélectionnez un type">
                  Sélectionnez un type
                </option>
                {documentTypes.map((type) => (
                  <option key={type.id} value={type.nom_document_type}>
                    {type.nom_document_type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white w-full rounded-lg shadow-md p-6">
            {/* <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="mb-4"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select> */}
            <DataGrid
              rows={data}
              columns={getColumns()}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5, 15, 30, 50, 100]}
              rowsPerPageOptions={[5, 15, 30, 50, 100]}
              autoHeight
              loading={loading}
              components={{
                Toolbar: GridToolbar,
              }}
              getRowClassName={(params) =>
                params.id === expandedRowId ? "expanded-row" : ""
              }
            />
          </div>
        </div>
      </div>

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
            className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg w-full mx-4"
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
            console.log("Modal closed");
            console.log(selectedRowId);

            setOpenUploadModal(false);
          }}
          documentTypeId={String(selectedDocumentTypeId)}
          rowId={String(selectedRowId)}
        />
      )}

      {isFilterModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={() => setIsFilterModalOpen(false)}
        >
          <div
            className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setIsFilterModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg">Saisir les dates de filtrage</h3>
            <div className="form-control mt-4">
              <label className="label">Date de début</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input input-bordered"
              />
            </div>
            {isRangeFilter && (
              <div className="form-control mt-4">
                <label className="label">Date de fin</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input input-bordered"
                />
              </div>
            )}
            <div className="form-control mt-4">
              <label className="label">
                <input
                  type="checkbox"
                  checked={isRangeFilter}
                  onChange={(e) => setIsRangeFilter(e.target.checked)}
                  className="checkbox"
                />
                Filtrer par intervalle de dates
              </label>
            </div>
            <div className="modal-action flex justify-center items-center mt-4">
              <button onClick={applyFilter} className="btn btn-primary">
                Appliquer le filtre
              </button>
            </div>
          </div>
        </div>
      )}

      {openDisplayModal && (
        <ViewCaisseFile
          onClose={() => setOpenDisplayModal(false)}
          documentTypeId={String(selectedDocumentTypeId)}
        />
      )}

      <ToastContainer />
    </div>
  );
}
