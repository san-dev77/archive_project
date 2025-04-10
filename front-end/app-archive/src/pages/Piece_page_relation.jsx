import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Side_bar from "../Components/Side_bar";
import TopBar from "../Components/Top_bar";
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
import "./styles/piece_page_relation.css"; // Importez le fichier CSS
import { Tooltip } from "@mui/material";
import Swal from "sweetalert2";

const LinkPieceToDocumentType = () => {
  const [pieces, setPieces] = useState([]);
  const [services, setServices] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [relations, setRelations] = useState([]);
  const [selectedPieces, setSelectedPieces] = useState([]);
  const [selectedService, setSelectedService] = useState(() => {
    return sessionStorage.getItem("selectedService") || "";
  });
  const [selectedDocumentType, setSelectedDocumentType] = useState(() => {
    return sessionStorage.getItem("selectedDocType") || "";
  });
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [servicesData, setServicesData] = useState([]); // Ajoutez cette ligne
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
        await axios.post("http://localhost:3000/pieces/link", {
          piece_ids: selectedPieces,
          document_type_id: selectedDocumentType,
        });
        const response = await axios.get(
          `http://localhost:3000/pieces/relations/${selectedDocumentType}`
        );
        setRelations(response.data);

        // Show SweetAlert success message
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

      // Show SweetAlert success message
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

  // Utilisez `filteredRelations` pour afficher les relations filtrées
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
      fetchPieces(); // Refresh the list of pieces

      // Show SweetAlert success message
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

  const handleServiceChange = (e) => {
    const newService = e.target.value;
    setSelectedService(newService);
    localStorage.setItem("selectedService", newService);
    // Réinitialiser le type de document quand le service change
    setSelectedDocumentType("");
    localStorage.removeItem("selectedDocumentType");
  };

  const handleDocumentTypeChange = (e) => {
    const newDocType = e.target.value;
    setSelectedDocumentType(newDocType);
    localStorage.setItem("selectedDocumentType", newDocType);
  };

  return (
    <div className="flex min-h-screen bg-[#f0f4f8]">
      <Side_bar isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-white w-full rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-[#1e3a8a] flex items-center">
                <Cable className="h-8 w-8 text-[#10b981] mr-2" />
                Configuration des Relations
              </h1>
            </div>

            <div className="bg-[#f8fafc] rounded-lg p-6 border border-[#e2e8f0]">
              {/* Service Selection */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="form-control">
                  <label className="block text-sm font-medium text-[#1e3a8a] mb-2">
                    <span className="flex items-center gap-2">
                      <Building2 className="text-[#10b981]" />
                      Service
                    </span>
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-white text-[#1e293b] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981]"
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
                  <div className="form-control">
                    <label className="block text-sm font-medium text-[#1e3a8a] mb-2">
                      <span className="flex items-center gap-2">
                        <Layers3 className="text-[#10b981]" />
                        Type de document
                      </span>
                    </label>
                    <select
                      className="w-full px-4 py-2 bg-white text-[#1e293b] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981]"
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
                )}
              </div>

              {selectedDocumentType && (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Rechercher une relation..."
                        className="w-full px-4 py-2 bg-white text-[#1e293b] border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981]"
                        value={searchTerm}
                        onChange={handleRelationSearchChange}
                      />
                    </div>
                    <button
                      className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg flex items-center gap-2 transition-colors duration-200"
                      onClick={handleDialogOpen}
                    >
                      <GitBranchPlus size={20} />
                      Nouvelle liaison
                    </button>
                    <button
                      className="px-4 py-2 bg-[#64748b] hover:bg-[#475569] text-white rounded-lg flex items-center gap-2 transition-colors duration-200"
                      onClick={() => setCreatePieceDialogOpen(true)}
                    >
                      <PlusCircleIcon size={20} />
                      Nouvelle pièce
                    </button>
                  </div>

                  <div className="bg-white rounded-lg overflow-hidden border border-[#e2e8f0]">
                    <table className="w-full">
                      <thead className="bg-[#f1f5f9] text-[#1e293b]">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">
                            Code
                          </th>
                          <th className="px-6 py-4 text-left font-semibold">
                            Nom
                          </th>
                          <th className="px-6 py-4 text-right font-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRelations.map((relation, index) => (
                          <tr
                            key={relation.id}
                            className={`border-t border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors duration-200`}
                          >
                            <td className="px-6 py-4">
                              <span className="flex items-center gap-2">
                                <Ungroup className="text-[#10b981]" />
                                {relation.code_piece}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-[#475569]">
                              {relation.nom_piece}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-end gap-3">
                                <Tooltip title="Voir">
                                  <button
                                    className="p-2 text-[#10b981] hover:bg-[#f1f5f9] rounded-lg transition-colors duration-200"
                                    onClick={() => handleView(relation)}
                                  >
                                    <ScanEye size={20} />
                                  </button>
                                </Tooltip>
                                <Tooltip title="Détacher">
                                  <button
                                    className="p-2 text-[#ef4444] hover:bg-[#f1f5f9] rounded-lg transition-colors duration-200"
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
          <div className="modal-box bg-white text-[#1e293b] rounded-2xl shadow-2xl transform transition-all duration-300 max-w-2xl w-full p-8">
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={handleDialogClose}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg text-center text-[#1e3a8a]">
              <ListTodo className="inline-block mr-2 text-[#10b981]" />
              Liste des pièces disponibles
            </h3>
            <div className="form-control w-full mt-4">
              <input
                type="text"
                placeholder="Recherche"
                className="input input-bordered w-full bg-[#f8fafc] text-[#1e293b] border-[#cbd5e1]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="mt-4 h-64 w-full overflow-auto">
              <ul className="menu bg-base-100 w-full flex bg-[#f8fafc]">
                {filteredPieces.map((piece) => (
                  <li
                    key={piece.id}
                    className="flex items-center justify-end flex-row-reverse w-full btn btn-outline hover:bg-[#f1f5f9] text-[#1e293b] border-[#cbd5e1] mb-1"
                  >
                    <span>{`${piece.nom_piece} (${piece.code_piece})`}</span>
                    <label className="cursor-pointer label">
                      <input
                        type="checkbox"
                        className="checkbox bg-[#f1f5f9] border-[#cbd5e1] checked:bg-[#10b981]"
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
                className="btn text-white bg-[#10b981] hover:bg-[#059669] hover:text-white hover:border-white"
                onClick={handleLink}
              >
                <Link className="mr-2" />
                Lier les pièces
              </button>
              <button
                className="btn btn-outline text-[#ef4444] border-[#ef4444] hover:bg-[#ef4444] hover:text-white"
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
          <div className="modal-box bg-white text-[#1e293b] rounded-lg shadow-lg transform transition-all duration-300 flex flex-col justify-center items-center p-6">
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setViewDialogOpen(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg text-center text-[#1e3a8a]">
              Détails de la pièce
            </h3>
            <div className="mt-4 text-[#1e293b]">
              <p className="text-lg">
                <strong className="text-[#1e3a8a]">
                  Code de la pièce: {selectedRow.code_piece || "N/A"}{" "}
                </strong>{" "}
              </p>
              <p className="text-lg">
                <strong className="text-[#1e3a8a]">
                  Nom de la pièce: {selectedRow.nom_piece || "N/A"}{" "}
                </strong>{" "}
              </p>
              {/* Ajoutez d'autres détails de la pièce ici si nécessaire */}
            </div>
          </div>
        </div>
      )}

      {createPieceDialogOpen && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-box bg-white text-[#1e293b] rounded-lg shadow-lg transform transition-all duration-300 flex flex-col justify-center items-center p-6">
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setCreatePieceDialogOpen(false)}
            >
              ✕
            </button>
            <h3 className="font-bold flex justify-center items-center text-lg text-center text-[#1e3a8a]">
              <PlusCircleIcon className="mr-1 text-[#10b981]" />
              Créer une nouvelle pièce
            </h3>
            <div className="form-control w-full mt-4">
              <input
                type="text"
                placeholder="Code de la pièce"
                className="input input-bordered w-full bg-[#f8fafc] text-[#1e293b] border-[#cbd5e1]"
                value={newPieceCode}
                onChange={(e) => setNewPieceCode(e.target.value)}
              />
            </div>
            <div className="form-control w-full mt-4">
              <input
                type="text"
                placeholder="Nom de la pièce"
                className="input input-bordered w-full bg-[#f8fafc] text-[#1e293b] border-[#cbd5e1]"
                value={newPieceName}
                onChange={(e) => setNewPieceName(e.target.value)}
              />
            </div>
            <div className="modal-action">
              <button
                className="btn text-white bg-[#10b981] hover:bg-[#059669] hover:text-white hover:border-white"
                onClick={handleCreatePiece}
              >
                Créer la pièce
              </button>
              <button
                className="btn btn-outline text-[#ef4444] border-[#ef4444] hover:bg-[#ef4444] hover:text-white"
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

export default LinkPieceToDocumentType;
