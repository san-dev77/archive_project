import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes for prop validation
import Select from "react-select";
import { useFilterStore } from "../store/filterStore";

const FilterButton = ({ icon: Icon, label, color = "gray", apiEndpoint }) => {
  const updateFilter = useFilterStore((state) => state.updateFilter); // Get the updateFilter function from the store

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiEndpoint);
      const result = await response.json();
      console.log(result);

      const formattedOptions = result.map((item) => ({
        value: item.id,
        label: item.nom_agence || item.nom_prenom_caissier || item.code_caisse,
      }));
      setOptions(formattedOptions);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectListItem = (item) => {
    console.log("item", item);
    updateFilter(item.label); // Mettra à jour avec null si rien n'est sélectionné
  };

  return (
    <>
      <button
        onClick={fetchOptions}
        className={`flex items-center gap-2 px-4 py-2 bg-${color}-600 text-white rounded-lg hover:bg-${color}-700 transition-colors`}
      >
        {Icon && <Icon size={20} />}
        {label}
      </button>

      <div className="mt-4">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Select
            options={options}
            onChange={(selectedOption) => {
              console.log("Selected:", selectedOption);
              selectListItem(selectedOption);
            }}
          />
        )}
      </div>
    </>
  );
};

// Prop validation
FilterButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
  apiEndpoint: PropTypes.string.isRequired, // Changed type to apiEndpoint
};

export default FilterButton;
