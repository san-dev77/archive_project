import { useState } from "react";
import DataUpload from "../../../Components/DataUpload";
import SideBar_agence from "../../../Components/Sidebar_agence";
import TopBar from "../../../Components/Top_bar";
import { Upload, FileUp } from "lucide-react";

const Upload_dataPage = () => {
  const [fileModalOpen, setFileModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-300">
      <SideBar_agence isVisible={true} />
      <div className="flex-1 flex flex-col">
        <TopBar position="fixed" title="Import de données" />
        <div className="container w-full mx-auto px-4 py-8 mt-20">
          <div className="bg-gray-800 w-full rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <FileUp className="h-8 w-8 text-[#00B7FF] mr-2" />
                Import de fichiers
              </h1>
            </div>

            <div className="bg-[#3a3a3a] rounded-lg p-8">
              <div className="text-center">
                <div className="mb-6">
                  <Upload className="h-16 w-16 text-[#00B7FF] mx-auto mb-4" />
                  <p className="text-gray-300 mb-4">
                    Cliquez sur le bouton ci-dessous pour importer vos fichiers
                  </p>
                </div>
                <button
                  onClick={() => setFileModalOpen(true)}
                  className="bg-[#00B7FF] hover:bg-[#0096FF] text-white px-6 py-3 rounded-lg flex items-center mx-auto transition-colors duration-200"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Importer des fichiers
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {fileModalOpen && <DataUpload onClose={() => setFileModalOpen(false)} />}
    </div>
  );
};

export default Upload_dataPage;
