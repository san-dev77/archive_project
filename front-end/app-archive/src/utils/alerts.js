import Swal from "sweetalert2";

export const showDeleteConfirmation = async () => {
  const result = await Swal.fire({
    title: "Êtes-vous sûr ?",
    text: "Cette action supprimera définitivement l'élément.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1f2937",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
    customClass: {
      container: 'swal2-container-custom'
    }
  });

  // Ajouter un style global pour le z-index maximal
  const style = document.createElement('style');
  style.innerHTML = `
    .swal2-container-custom {
      z-index: 9999999 !important;
    }
  `;
  document.head.appendChild(style);

  return result.isConfirmed; // Retourne true si l'utilisateur confirme
};
