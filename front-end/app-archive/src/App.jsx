import "./App.css";
import { Route, Routes } from "react-router-dom";
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
export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/settings" element={<SettingsPage />}></Route>
        <Route path="/app-archive" element={<Activities />}></Route>
        <Route path="/services" element={<Show_service />}></Route>
        <Route path="/agents" element={<Dashboard />}></Route>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/tree" element={<TreeViewPage />}></Route>
        <Route path="/services_UI" element={<Services_UI />}></Route>
        <Route path="/type_doc_UI" element={<Type_doc_UI />}></Route>
        <Route path="/pieces" element={<Piece_page />}></Route>
        <Route path="/settings_UI" element={<SettingsPage_UI />}></Route>
        <Route path="/pieces_UI" element={<Pieces_UI />}></Route>
        <Route path="/agences" element={<Main_activities />}></Route>
        <Route path="/agence_page" element={<ShowAgence />}></Route>
        <Route path="/caisse" element={<ShowCaisse />}></Route>
        <Route path="/guichet" element={<ShowGuichet />}></Route>
        <Route path="/agence/document-type" element={<DocType />}></Route>
        <Route path="/dossier" element={<Dossier />}></Route>
        <Route path="/agence/config-piece" element={<Config_piece />}></Route>
        <Route
          path="/agence/config-docType/:id"
          element={<ConfigDocType />}
        ></Route>
        <Route
          path="/agence_createPiece"
          element={<Agence_createPiece />}
        ></Route>
        <Route path="/users" element={<UsersPage />}></Route>
        <Route path="/meta_UI" element={<Meta_UI />}></Route>
        <Route path="/document_UI/:docTypeId" element={<Document_UI />}></Route>
        <Route path="/doc_n_type/:serviceId" element={<Doc_n_type />}></Route>
        <Route path="/profil" element={<ProfilPage />}></Route>
        <Route path="/search-config" element={<SearchConfig />}></Route>
        <Route path="/rights" element={<UserRights />}></Route>
        <Route path="/userRoles" element={<UserRoles />}></Route>
        <Route path="/edit-service/:category/:id" element={<EditService />} />
        <Route
          path="/edit-document-type/:category/:id"
          element={<EditDocumentType />}
        />
        <Route path="/edit-metadata/:id" element={<EditMetadata />} />
        <Route path="/edit-piece/:category/:id" element={<EditPiece />} />
        <Route path="/create-piece" element={<CreatePiece />}></Route>
        <Route path="/documents" element={<DocumentListShow />}></Route>
        <Route path="/documents/:id" element={<DocumentDetails />}></Route>
        <Route path="/documents/edit/:id" element={<DocumentDetails />}></Route>
        <Route path="/metadata" element={<Show_meta />}></Route>
        <Route path="/document-types" element={<Show_doc_type />}></Route>
        <Route
          path="/create-document-type"
          element={<Create_doc_type />}
        ></Route>
      </Routes>
    </div>
  );
}
