import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import Activities from "./pages/Activities";
import Show_service from "./pages/Show_service";
import Show_doc_type from "./pages/Show_doc_types";
import Show_meta from "./pages/Show_meta";
import Create_doc_type from "./pages/Create_doc_type";
import Login from "./pages/Login";
import Search from "./pages/Search";
import Piece_page from "./pages/Piece_page_relation";
import CreatePiece from "./pages/Create_piece";
import EditService from "./pages/update/EditService";
import EditDocumentType from "./pages/update/EditDocumentType";
import EditMetadata from "./pages/update/EditMetadata";
import EditPiece from "./pages/update/EditPiece";
import DocumentDetails from "./pages/afficher/documents/Document_details";
import SettingsPage from "./pages/Parametres";
import DocumentListShow from "./pages/afficher/Documents_page";
import UsersPage from "./pages/Users_page";
import UserRights from "./pages/UserRights";
import ProfilPage from "./pages/Profil_page";
import UserRoles from "./pages/UserRoles";
import Dashboard from "./pages/agents UI/home_UI";
import Services_UI from "./pages/agents UI/activities_UI/Services_UI";
import Type_doc_UI from "./pages/agents UI/activities_UI/Type_doc_UI";
import Pieces_UI from "./pages/agents UI/activities_UI/Pieces_UI";
import SettingsPage_UI from "./pages/agents UI/activities_UI/parametres_UI";
import TreeViewPage from "./pages/tree/TreeViewPage";
import SearchConfig from "./pages/Search-config";
import Doc_n_type from "./Components/test/Doc_n_type";
import Document_UI from "./pages/agents UI/activities_UI/Document_UI";
import Meta_UI from "./pages/agents UI/activities_UI/Meta_UI";
import Main_activities from "./pages/agence/Main_activities";
import ShowAgence from "./pages/agence/UI/Agence_page";
import Agence_createPiece from "./pages/agence/UI/Agence_createPiece";
import ShowCaisse from "./pages/agence/UI/Caisse";
import ShowGuichet from "./pages/agence/UI/Guichet";
import DocType from "./pages/agence/UI/DocTypes";
import ConfigDocType from "./pages/agence/UI/Config_docType";
import Dossier from "./pages/agence/UI/Dossier";
import Config_piece from "./pages/agence/UI/Config_piece";
import { useEffect, useState } from "react";
import LandingPage from "./pages/Landing";
import Metadata_agence from "./pages/agence/UI/Metadata";
import Search_agence from "./pages/agence/UI/search";
import Meta_dir from "./pages/Meta_dir";
import Docs_dir from "./pages/afficher/Docs_dir";
import Stats from "./pages/Stats";
import Profile from "./pages/profil/Admin_profil";
import Upload_dataPage from "./pages/agence/UI/Upload_dataPage";
import Stats_agents from "./pages/agents UI/activities_UI/Stats";
import Reports_agents from "./pages/agents UI/activities_UI/Rapports_agents";
import LinkPieceUI from "./pages/agents UI/activities_UI/Link_piece_UI";
import Home_up from "./pages/agent up/Home_up";
import Service_up from "./pages/agent up/pages/Service_up";
import ConnectionLogs from "./pages/Connexions_details";
import Agents_page from "./pages/agent up/pages/Agents_page";
import DoctypeUp from "./pages/agent up/pages/Doctype_up";
import MetaUp from "./pages/agent up/pages/Meta_up";
import Profil_up from "./pages/agent up/pages/Profil_up";
import Doc_up from "./pages/agent up/pages/Doc_up";
import ErrorPage from "./pages/ErrorPage";
import useLogoutHandler from "./hooks/useLogoutHandler";
import usePageViewTracker from "./hooks/usePageViewTracker";
import Repports from "./pages/Repports";
import Follow_up from "./pages/Follow_up";
import Piece_up from "./pages/agent up/pages/Piece_up";

export default function App() {
  const [hasError, setHasError] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);

  // Utiliser les hooks personnalisés
  // useLogoutHandler();
  usePageViewTracker();

  const handleKeyDown = (event) => {
    if (event.ctrlKey) {
      if (event.key === "ArrowLeft") {
        // Navigate to the previous page
        window.history.back();
      } else if (event.key === "ArrowRight") {
        // Navigate to the next page
        window.history.forward();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = sessionStorage.getItem("token");
      if (token) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Gestionnaire d'erreurs global pour l'application
  useEffect(() => {
    const handleError = (event) => {
      console.error("Erreur détectée:", event);
      // Forcer l'affichage de la page d'erreur pour toutes les erreurs React DOM
      if (
        (event.message && event.message.includes("insertBefore")) ||
        event.message.includes("Node")
      ) {
        setHasError(true);
        setErrorInfo({
          message: "Erreur d'affichage de l'interface",
          details:
            "Un problème est survenu lors du rendu de la page. Veuillez rafraîchir la page ou vous reconnecter.",
        });
        return;
      }

      setHasError(true);
      setErrorInfo({
        message: event.message || "Une erreur inattendue s'est produite",
        stack: event.error?.stack || "Détails non disponibles",
      });
    };

    window.addEventListener("error", handleError);

    // Gestionnaire pour les erreurs de promesses non gérées (comme les appels API échoués)
    window.addEventListener("unhandledrejection", (event) => {
      console.error("Promesse rejetée non gérée:", event);
      setHasError(true);
      setErrorInfo({
        message: "Erreur de connexion ou problème avec le serveur",
        stack: event.reason?.stack || "Détails non disponibles",
      });
    });

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleError);
    };
  }, []);

  // Si une erreur est détectée, afficher la page d'erreur
  if (hasError) {
    return (
      <ErrorPage error={errorInfo} resetError={() => setHasError(false)} />
    );
  }

  const token = sessionStorage.getItem("token");

  return (
    <div className="app">
      {/* <FloatingGuideButton /> */}
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/error" element={<ErrorPage />}></Route>
        <Route
          path="/settings"
          element={token ? <SettingsPage /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/app-archive"
          element={token ? <Activities /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/services"
          element={token ? <Show_service /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/agents_UI"
          element={token ? <Dashboard /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/stats_agents"
          element={token ? <Stats_agents /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/rapports_agents"
          element={token ? <Reports_agents /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/agence/meta_agence"
          element={token ? <Metadata_agence /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/search"
          element={token ? <Search /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/stats"
          element={token ? <Stats /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/suivi"
          element={token ? <Follow_up /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/agence/upload"
          element={token ? <Upload_dataPage /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/reports"
          element={token ? <Repports /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/meta_dir"
          element={token ? <Meta_dir /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/docs_dir"
          element={token ? <Docs_dir /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/agence/search"
          element={token ? <Search_agence /> : <Navigate to="/" />}
        ></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/tree"
          element={token ? <TreeViewPage /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/services_UI"
          element={token ? <Services_UI /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/type_doc_UI"
          element={token ? <Type_doc_UI /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/pieces"
          element={token ? <Piece_page /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/settings_UI"
          element={token ? <SettingsPage_UI /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/pieces_UI"
          element={token ? <Pieces_UI /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/agences"
          element={token ? <Main_activities /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/agence_page"
          element={token ? <ShowAgence /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/caisse"
          element={token ? <ShowCaisse /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/guichet"
          element={token ? <ShowGuichet /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/agence/document-type"
          element={token ? <DocType /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/dossier"
          element={token ? <Dossier /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/connexions-details"
          element={token ? <ConnectionLogs /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/agent_up"
          element={token ? <Home_up /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/service_up"
          element={token ? <Service_up /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/type_doc_up"
          element={token ? <DoctypeUp /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/doc_up"
          element={token ? <Doc_up /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/piece_up"
          element={token ? <Piece_up /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/profil_up"
          element={token ? <Profil_up /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/meta_up"
          element={token ? <MetaUp /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/agent_data_up"
          element={token ? <Agents_page /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/agence/config-piece"
          element={token ? <Config_piece /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/agence/config-docType/:id"
          element={token ? <ConfigDocType /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/agence_createPiece"
          element={token ? <Agence_createPiece /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/users"
          element={token ? <UsersPage /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/meta_UI"
          element={token ? <Meta_UI /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/document_UI/:docTypeId"
          element={token ? <Document_UI /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/doc_n_type/:serviceId"
          element={token ? <Doc_n_type /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/profil"
          element={token ? <ProfilPage /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/link_piece_UI"
          element={token ? <LinkPieceUI /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/search-config"
          element={token ? <SearchConfig /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/rights"
          element={token ? <UserRights /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/userRoles"
          element={token ? <UserRoles /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/edit-service/:category/:id"
          element={token ? <EditService /> : <Navigate to="/" />}
        />
        <Route
          path="/edit-document-type/:category/:id"
          element={token ? <EditDocumentType /> : <Navigate to="/" />}
        />
        <Route
          path="/edit-metadata/:id"
          element={token ? <EditMetadata /> : <Navigate to="/" />}
        />
        <Route
          path="/edit-piece/:category/:id"
          element={token ? <EditPiece /> : <Navigate to="/" />}
        />
        <Route
          path="/create-piece"
          element={token ? <CreatePiece /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/documents"
          element={token ? <DocumentListShow /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/documents/:id"
          element={token ? <DocumentDetails /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/documents/edit/:id"
          element={token ? <DocumentDetails /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/metadata"
          element={token ? <Show_meta /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/"
          element={token ? <Show_meta /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/document-types"
          element={token ? <Show_doc_type /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/create-document-type"
          element={token ? <Create_doc_type /> : <Navigate to="/" />}
        ></Route>
        {/* Ajout d'une route catch-all pour les URLs non gérées */}
        <Route
          path="*"
          element={
            <ErrorPage
              error={{
                message: "Page introuvable",
                details:
                  "L'URL demandée n'existe pas ou n'est plus disponible.",
              }}
              isNotFound={true}
            />
          }
        ></Route>
      </Routes>
    </div>
  );
}
