import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Building2,
  Cable,
  GitBranchPlus,
  Layers3,
  Link,
  Link2Off,
  ListTodo,
  PlusCircleIcon,
  ScanEye,
  Ungroup,
} from "lucide-react";
import { Tooltip } from "@mui/material";
import Swal from "sweetalert2";
import SideBar_UI from "../components_UI/Sidebar_UI";
import TopBar_UI from "../components_UI/Top_bar_UI";
const LinkPieceUI = () => {
  const [pieces, setPieces] = useState([]);
  const [services, setServices] = useState([]);

  const [documentTypes, setDocumentTypes] = useState([]);
  const [relations, setRelations] = useState([]);
  const [selectedPieces, setSelectedPieces] = useState([]);
  const [selectedService, setSelectedService] = useState(() => {
    return localStorage.getItem("selectedService") || "";
  });
  const [selectedDocumentType, setSelectedDocumentType] = useState(() => {
    return localStorage.getItem("selectedDocType") || "";
  });
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [servicesData, setServicesData] = useState([]);
  const [newPieceCode, setNewPieceCode] = useState("");
  const [newPieceName, setNewPieceName] = useState("");
  const [createPieceDialogOpen, setCreatePieceDialogOpen] = useState(false);

  useEffect(() => {
    fetchPieces();
    fetchServices(); 
  }, []);

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

  useEffect(() => {
    const serviceId = localStorage.getItem("serviceId");
    if (serviceId) {
      setSelectedService(serviceId);
      const fetchDocumentTypes = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/document-types/services/${serviceId}/document-types`
          );
          setDocumentTypes(response.data);
        } catch (error) {
          console.error("Error fetching document types:", error);
        }
      };
      fetchDocumentTypes();
    }
  }, []);

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
        await axios.post("http://localhost:3000/pieces/link", {
          piece_ids: selectedPieces,
          document_type_id: selectedDocumentType,
        });
        const response = await axios.get(
          `http://localhost:3000/pieces/relations/${selectedDocumentType}`
        );
        setRelations(response.data);

        Swal.fire({
          icon: "success",
          title: "Succès!",
          text: "Relation créée avec succès!",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error("Error linking pieces to document type:", error);
        Swal.fire({
          icon: "error",
          title: "Erreur!",
          text: "Échec de la création de la relation.",
          confirmButtonText: "OK",
        });
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

      Swal.fire({
        icon: "success",
        title: "Succès!",
        text: "Relation supprimée avec succès!",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error deleting relation:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur!",
        text: "Échec de la suppression de la relation.",
        confirmButtonText: "OK",
      });
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

  const filteredRelations = relations.filter(
    (relation) =>
      relation.nom_piece.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relation.code_piece.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePiece = async () => {
    try {
      await axios.post("http://localhost:3000/pieces", {
        code_piece: newPieceCode,
        nom_piece: newPieceName,
      });
      setCreatePieceDialogOpen(false);
      setNewPieceCode("");
      setNewPieceName("");
      fetchPieces();

      Swal.fire({
        icon: "success",
        title: "Succès!",
        text: "Pièce créée avec succès!",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error creating piece:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur!",
        text: "Échec de la création de la pièce.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDocumentTypeChange = (e) => {
    const newDocType = e.target.value;
    setSelectedDocumentType(newDocType);
    localStorage.setItem("selectedDocumentType", newDocType);
  };

  return (
    <div className="flex min-h-screen bg-gray-300">
      <SideBar_UI />
      <div className="flex-1 flex flex-col">
        <TopBar_UI />
        <div className="container w-full mx-auto px-4 py-8 mt-20">


          <div className="bg-gray-800 w-full rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <Cable className="h-8 w-8 text-orange-500 mr-2" />
                Configuration Pièces
              </h1>
            </div>

            <div className="bg-[#3a3a3a] rounded-lg p-6">
              <div className="grid grid-cols-1 gap-6 mb-8">
                <div className="form-control">
                  <label className="block text-sm font-medium text-white mb-2">
                    <span className="flex items-center gap-2">
                      <Layers3 className="text-orange-500" />
                      Type de document
                    </span>
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-[#2a2a2a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-orange-500"
                    value={selectedDocumentType}
                    onChange={handleDocumentTypeChange}
                  >
                    <option value="">Sélectionner un type</option>
                    {documentTypes.map((docType) => (
                      <option key={docType.id} value={docType.id}>
                        {docType.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedDocumentType && (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Rechercher une relation..."
                        className="w-full px-4 py-2 bg-[#2a2a2a] text-white border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-orange-500"
                        value={searchTerm}
                        onChange={handleRelationSearchChange}
                      />
                    </div>
                    <button
                      className="px-4 py-2 bg-white hover:bg-gray-700 text-black hover:text-white rounded-lg flex items-center gap-2 transition-colors duration-200"
                      onClick={handleDialogOpen}
                    >
                      <GitBranchPlus size={20} />
                      Nouvelle liaison
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors duration-200"
                      onClick={() => setCreatePieceDialogOpen(true)}
                    >
                      <PlusCircleIcon size={20} />
                      Nouvelle pièce
                    </button>
                  </div>

                  <div className="bg-[#2a2a2a] rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-black/30 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Code</th>
                          <th className="px-6 py-4 text-left font-semibold">Nom</th>
                          <th className="px-6 py-4 text-right font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRelations.map((relation, index) => (
                          <tr
                            key={relation.id}
                            className={`border-t border-[#4a4a4a] hover:bg-[#3a3a3a] transition-colors duration-200`}
                          >
                            <td className="px-6 py-4">
                              <span className="flex items-center gap-2">
                                <Ungroup className="text-orange-500" />
                                {relation.code_piece}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-300">{relation.nom_piece}</td>
                            <td className="px-6 py-4">
                              <div className="flex justify-end gap-3">
                                <Tooltip title="Voir">
                                  <button
                                    className="p-2 text-blue-500 hover:bg-[#4a4a4a] rounded-lg transition-colors duration-200"
                                    onClick={() => handleView(relation)}
                                  >
                                    <ScanEye size={20} />
                                  </button>
                                </Tooltip>
                                <Tooltip title="Détacher">
                                  <button
                                    className="p-2 text-red-500 hover:bg-[#4a4a4a] rounded-lg transition-colors duration-200"
                                    onClick={() => handleDelete(relation.id)}
                                  >
                                    <Link2Off size={20} />
                                  </button>
                                </Tooltip>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {openDialog && (
        <div className="fixed inset-0 flex z-50 items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="modal-box bg-white text-gray-800 rounded-2xl shadow-2xl transform transition-all duration-300 max-w-2xl w-full p-8">
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
                className="input input-bordered w-full bg-gray-300 text-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="mt-4 h-64 w-full overflow-auto">
              <ul className="menu bg-base-100 w-full flex bg-gray-100">
                {filteredPieces.map((piece) => (
                  <li
                    key={piece.id}
                    className="flex items-center justify-end flex-row-reverse w-full btn btn-outline btn-neutral"
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
                className="btn btn-info text-white bg-gray-700 hover:bg-blue-500 hover:text-white hover:border-white"
                onClick={handleLink}
              >
                <Link className="mr-2" />
                Lier les pièces
              </button>
              <button
                className="btn btn-outline btn-error"
                onClick={handleDialogClose}
              >
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
            </div>
          </div>
        </div>
      )}

      {createPieceDialogOpen && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-box bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 flex flex-col justify-center items-center">
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setCreatePieceDialogOpen(false)}
            >
              ✕
            </button>
            <h3 className="font-bold flex justify-center items-center text-lg text-center text-black-500">
              <PlusCircleIcon className="mr-1" />
              Créer une nouvelle pièce
            </h3>
            <div className="form-control w-full mt-4">
              <input
                type="text"
                placeholder="Code de la pièce"
                className="input input-bordered w-full bg-gray-300 text-gray-800"
                value={newPieceCode}
                onChange={(e) => setNewPieceCode(e.target.value)}
              />
            </div>
            <div className="form-control w-full mt-4">
              <input
                type="text"
                placeholder="Nom de la pièce"
                className="input input-bordered w-full bg-gray-300 text-gray-800"
                value={newPieceName}
                onChange={(e) => setNewPieceName(e.target.value)}
              />
            </div>
            <div className="modal-action">
              <button
                className="btn btn-info text-white bg-gray-700 hover:bg-blue-500 hover:text-white hover:border-white"
                onClick={handleCreatePiece}
              >
                Créer la pièce
              </button>
              <button
                className="btn btn-outline btn-error"
                onClick={() => setCreatePieceDialogOpen(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default LinkPieceUI;
