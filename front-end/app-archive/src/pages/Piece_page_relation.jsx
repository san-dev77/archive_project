import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Side_bar from "../Components/Side_bar";
import TopBar from "../Components/Top_bar";
import {
  Building2,
  Cable,
  GitBranchPlus,
  Link,
  Link2Off,
  ListTodo,
  ScanEye,
  Ungroup,
} from "lucide-react";
import "./styles/piece_page_relation.css"; // Importez le fichier CSS
import { Tooltip } from "@mui/material";

const LinkPieceToDocumentType = () => {
  const [pieces, setPieces] = useState([]);
  const [services, setServices] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [relations, setRelations] = useState([]);
  const [selectedPieces, setSelectedPieces] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [servicesData, setServicesData] = useState([]); // Ajoutez cette ligne

  useEffect(() => {
    const fetchPieces = async () => {
      try {
        const response = await axios.get("http://localhost:3000/pieces");
        setPieces(response.data);
      } catch (error) {
        console.error("Error fetching pieces:", error);
      }
    };

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
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchPieces();
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService) {
      const fetchDocumentTypes = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/document-types/services/${selectedService}/document-types`
          );
          setDocumentTypes(response.data);
        } catch (error) {
          console.error("Error fetching document types:", error);
        }
      };

      fetchDocumentTypes();
    } else {
      setDocumentTypes([]);
    }
  }, [selectedService]);

  useEffect(() => {
    if (selectedDocumentType) {
      const fetchRelations = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/pieces/relations/${selectedDocumentType}`
          );
          setRelations(response.data);
        } catch (error) {
          console.error("Error fetching relations:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchRelations();
    } else {
      setRelations([]);
    }
  }, [selectedDocumentType]);

  const handleLink = async () => {
    if (selectedPieces.length > 0 && selectedDocumentType) {
      try {
        console.log(selectedDocumentType);

        await axios.post("http://localhost:3000/pieces/link", {
          piece_ids: selectedPieces,
          document_type_id: selectedDocumentType,
        });
        const response = await axios.get(
          `http://localhost:3000/pieces/relations/${selectedDocumentType}`
        );
        setRelations(response.data);
        toast.success("Relation créée avec succès!");
      } catch (error) {
        console.error("Error linking pieces to document type:", error);
        toast.error("Échec de la création de la relation.");
      }
    }
  };

  const handlePieceSelection = (pieceId, isChecked) => {
    setSelectedPieces((prevSelectedPieces) => {
      if (isChecked) {
        return [...prevSelectedPieces, pieceId];
      } else {
        return prevSelectedPieces.filter((id) => id !== pieceId);
      }
    });
  };

  const handleView = (row) => {
    console.log("Selected Row:", row); // Debug: Log the selected row
    setSelectedRow(row);
    setViewDialogOpen(true);
  };

  const filteredPieces = pieces.filter(
    (piece) =>
      piece.nom_piece.toLowerCase().includes(searchTerm.toLowerCase()) ||
      piece.code_piece.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/pieces/${id}/document-types/${selectedDocumentType}`
      );
      const response = await axios.get(
        `http://localhost:3000/pieces/relations/${selectedDocumentType}`
      );
      setRelations(response.data);
      toast.success("Relation supprimée avec succès!");
    } catch (error) {
      console.error("Error deleting relation:", error);
      toast.error("Échec de la suppression de la relation.");
    }
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleRelationSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Utilisez `filteredRelations` pour afficher les relations filtrées
  const filteredRelations = relations.filter(
    (relation) =>
      relation.nom_piece.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relation.code_piece.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-300">
      <Side_bar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="container px-4 mx-auto mt-28 bg-white rounded-xl shadow-2xl flex flex-col h-full max-w-4xl overflow-hidden">
          <h1 className="text-2xl mt-4 ml-2 font-extrabold text-gray-800 flex justify-start w-full">
            <Cable size="28px" className="mr-3 text-indigo-600" />
            Configuration des pièces
          </h1>
          <div className="bg-gray-100 h-full rounded-lg shadow-lg w-full p-2 mb-6">
            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text flex items-center justify-start gap-2">
                  <Building2 />
                  Service
                </span>
              </label>
              <select
                className="select select-bordered w-full bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
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
              <div className="form-control w-full mt-4">
                <label className="label">
                  <span className="label-text">Type de document</span>
                </label>
                <select
                  className="select select-bordered w-full bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  value={selectedDocumentType}
                  onChange={(e) => setSelectedDocumentType(e.target.value)}
                >
                  <option value="">Sélectionner un type de document</option>
                  {documentTypes.map((docType) => (
                    <option key={docType.id} value={docType.id}>
                      {docType.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedDocumentType && (
              <>
                <div className="flex w-full items-center justify-between mt-4">
                  <input
                    type="text"
                    placeholder="Recherche dans les relations"
                    className="input input-bordered w-96 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={handleRelationSearchChange} // Assurez-vous que cette fonction est appelée
                  />
                  <button
                    className="btn btn-primary ml-auto bg-gray-300 text-black hover:bg-gray-400 transition duration-300 rounded-lg shadow-md"
                    onClick={handleDialogOpen}
                  >
                    <GitBranchPlus className="mr-2" />
                    Nouvelle liaison
                  </button>
                </div>
                <div className="mt-4 w-full h-96 bg-white rounded-lg shadow-lg overflow-auto">
                  {loading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="loader"></div>
                    </div>
                  ) : (
                    <table className="table w-full border-collapse">
                      <thead className="sticky top-0 rounded-lg bg-gray-300 text-black">
                        <tr>
                          <th className="text-lg p-4">Code de la pièce</th>
                          <td className="">|</td>
                          <th className="text-lg p-4">Nom de la pièce</th>
                          <td className="">|</td>
                          <th className="text-lg p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRelations.map((relation) => (
                          <tr
                            key={relation.id}
                            className="hover:bg-gray-100 transition duration-200"
                          >
                            <td className="text-center text-white flex items-center justify-center gap-2 mt-2 rounded-lg p-4 bg-slate-600">
                              <Ungroup color="white" />
                              {relation.code_piece}
                            </td>
                            <td className="text-center text-gray-500">|</td>
                            <td className="text-center text-gray-500">
                              {relation.nom_piece}
                            </td>
                            <td className="text-center text-gray-500">|</td>
                            <td className="text-right flex  justify-center   gap-2 items-center p-2 text-base text-gray-800">
                              <Tooltip title="Voir">
                                <button
                                  className="btn btn-outline btn-primary btn-sm hover:bg-indigo-100 transition duration-300 rounded-md"
                                  onClick={() => handleView(relation)}
                                >
                                  <ScanEye className="mr-1" />
                                </button>
                              </Tooltip>
                              <Tooltip title="Détacher">
                                <button
                                  className="btn btn-outline btn-error btn-sm hover:bg-red-400 transition duration-300 rounded-md"
                                  onClick={() => handleDelete(relation.id)}
                                >
                                  <Link2Off className="mr-1" />
                                </button>
                              </Tooltip>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {openDialog && (
        <div className="fixed inset-0 flex items-center  justify-center bg-black bg-opacity-50">
          <div className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300  flex flex-col justify-center items-center">
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={handleDialogClose}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg text-center text-black-500">
              <ListTodo className="inline-block mr-2" />
              Liste des pièces disponibles
            </h3>
            <div className="form-control w-full mt-4">
              <input
                type="text"
                placeholder="Recherche"
                className="input  input-bordered w-full bg-gray-300 text-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="mt-4 h-64 w-full overflow-auto">
              <ul className="menu bg-base-100 w-full flex bg-gray-100 ">
                {filteredPieces.map((piece) => (
                  <li
                    key={piece.id}
                    className=" flex items-center justify-end flex-row-reverse w-full  btn btn-outline btn-neutral"
                  >
                    <span>{`${piece.nom_piece} (${piece.code_piece})`}</span>
                    <label className="cursor-pointer label">
                      <input
                        type="checkbox"
                        className="checkbox bg-gray-400 hover:bg-slate-50"
                        checked={selectedPieces.includes(piece.id)}
                        onChange={(e) =>
                          handlePieceSelection(piece.id, e.target.checked)
                        }
                      />
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal-action">
              <button
                className="btn btn-info text-white hover:bg-blue-500 hover:text-white hover:border-white"
                onClick={handleLink}
              >
                <Link className="mr-2" />
                Lier les pièces
              </button>
              <button className="btn" onClick={handleDialogClose}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {viewDialogOpen && selectedRow && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 flex flex-col justify-center items-center">
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setViewDialogOpen(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg text-center text-black-500">
              Détails de la pièce
            </h3>
            <div className="mt-4 text-black">
              <p className="text-lg">
                <strong className="text-gray-800">
                  Code de la pièce: {selectedRow.code_piece || "N/A"}{" "}
                </strong>{" "}
              </p>
              <p className="text-lg">
                <strong className="text-gray-800">
                  Nom de la pièce: {selectedRow.nom_piece || "N/A"}{" "}
                </strong>{" "}
              </p>
              {/* Ajoutez d'autres détails de la pièce ici si nécessaire */}
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default LinkPieceToDocumentType;
