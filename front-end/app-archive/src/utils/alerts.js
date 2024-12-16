import Swal from "sweetalert2";

export const showDeleteConfirmation = async () => {
  const result = await Swal.fire({
    title: "Êtes-vous sûr ?",
    text: "Cette action supprimera définitivement l'élément.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
  });
  return result.isConfirmed; // Retourne true si l'utilisateur confirme
};
