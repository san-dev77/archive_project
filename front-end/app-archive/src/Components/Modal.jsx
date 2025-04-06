import { X } from "lucide-react";
import Loader_component from "./Loader";
import PropTypes from "prop-types";
import React, { useState } from "react";

export const Modal = ({ isOpen, onClose, title, children, loading }) => {
  const [selectedValue, setSelectedValue] = useState(null); // Local state to hold the selected value

  const handleSelectChange = (selectedOption) => {
    console.log("Selected option:", selectedOption.label); // Pour déboguer
    if (selectedOption && selectedOption.value !== undefined) {
      setSelectedValue(selectedOption.value);
    } else {
      setSelectedValue(selectedOption); // Si selectedOption est déjà la valeur directe
    }
  };

  const handleClose = () => {
    onClose(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-10 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <Loader_component />
          </div>
        ) : (
          <>
            {React.cloneElement(children, {
              onSelect: handleSelectChange,
              onChange: handleSelectChange,
            })}
            <button
              disabled={!selectedValue}
              className={`mt-4 text-white rounded px-4 py-2 ${
                selectedValue
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Confirm
            </button>
          </>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  loading: PropTypes.bool,
};
