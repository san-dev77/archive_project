import { FolderCog, Layers3 } from "lucide-react";

const DocumentListModal = ({ documentTypes, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#2a2a2a] rounded-lg shadow-xl p-8 w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-3xl flex items-start justify-start gap-3 font-bold text-white">
            <Layers3 size={45} />
            Types de Documents
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        <ul className="text-white">
          {documentTypes.length === 0 ? (
            <li className="text-center py-4">
              Aucun type de document disponible.
            </li>
          ) : (
            documentTypes.map((type, index) => (
              <li
                key={index}
                className="py-2 flex items-start justify-start gap-2 px-4 w-full bg-[#3a3a3a] transition-colors duration-200 rounded"
              >
                <FolderCog />
                {type.nom_document_type}
                <button className="ml-auto text-blue-500 hover:underline">
                  Détacher
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default DocumentListModal;
