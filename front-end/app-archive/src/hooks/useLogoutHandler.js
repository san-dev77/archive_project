import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function useLogoutHandler() {
    const location = useLocation();
    const isNavigating = useRef(false);
    const userId = localStorage.getItem("id_user")
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (!isNavigating.current && userId) {
                // Création des données à envoyer


                // Envoi des données avec sendBeacon (garanti d'être exécuté même si la page se ferme immédiatement)
                navigator.sendBeacon(`http://localhost:3000/stats/logout/${userId}`);

                // Message de confirmation (utile pour certains navigateurs)
                event.returnValue = "Êtes-vous sûr de vouloir quitter ?";
                localStorage.removeItem("token");
                localStorage.removeItem("permissions");
                localStorage.removeItem("profilName");
                localStorage.removeItem("firstName");
                localStorage.removeItem("lastName");
                localStorage.removeItem("id_user");
                localStorage.removeItem("role");
                localStorage.removeItem("service");
                localStorage.removeItem("serviceId");
            }
        };

        const handleNavigation = () => {
            isNavigating.current = true;
        };

        // Ajouter l'écouteur d'événement
        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handleNavigation);

        // Nettoyer l'écouteur lors du démontage
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handleNavigation);
        };
    }, [location, userId]); // Réexécuter si l'utilisateur change
}
