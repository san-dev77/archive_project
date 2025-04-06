import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const usePageViewTracker = () => {
    const location = useLocation();
    const previousPathRef = useRef(null);

    // Mapping des chemins URL vers des noms lisibles
    const pageNameMapping = {
        '/': 'Page d\'accueil',
        '/login': 'Connexion',
        '/app-archive': 'Archives',
        '/services': 'Services',
        '/agents': 'Tableau de bord agents',
        '/profile': 'Profil',
        '/stats_agents': 'Statistiques agents',
        '/rapports_agents': 'Rapports agents',
        '/agence/meta_agence': 'Métadonnées agence',
        '/search': 'Recherche',
        '/stats': 'Statistiques',
        '/agence/upload': 'Téléchargement de données',
        '/reports': 'Suivi',
        '/meta_dir': 'Répertoire métadonnées',
        '/docs_dir': 'Répertoire documents',
        '/agence/search': 'Recherche agence',
        '/tree': 'Vue arborescente',
        '/services_UI': 'Interface services',
        '/type_doc_UI': 'Types de documents',
        '/pieces': 'Pièces',
        '/settings_UI': 'Paramètres',
        '/pieces_UI': 'Interface pièces',
        '/agences': 'Activités principales',
        '/agence_page': 'Page agence',
        '/caisse': 'Caisse',
        '/guichet': 'Guichet',
        '/agence/document-type': 'Types de documents agence',
        '/dossier': 'Dossier',
        '/connexions-details': 'Détails connexions',
        '/agent_up': 'Accueil agent',
        '/service_up': 'Service agent',
        '/type_doc_up': 'Types de documents agent',
        '/doc_up': 'Documents agent',
        '/piece_up': 'Pièces agent',
        '/profil_up': 'Profil agent',
        '/meta_up': 'Métadonnées agent',
        '/agent_data_up': 'Données agents',
        '/agence/config-piece': 'Configuration pièces',
        '/users': 'Utilisateurs',
        '/meta_UI': 'Interface métadonnées',
        '/profil': 'Profil utilisateur',
        '/link_piece_UI': 'Liaison pièces',
        '/search-config': 'Configuration recherche',
        '/rights': 'Droits utilisateurs',
        '/userRoles': 'Rôles utilisateurs',
        '/create-piece': 'Création pièce',
        '/documents': 'Liste documents',
        '/metadata': 'Métadonnées',
        '/document-types': 'Types de documents',
        '/create-document-type': 'Création type document',
        '/settings': 'Paramètres'
    };

    // Fonction pour enregistrer la vue de page
    const recordPageView = async (pageId, pageName) => {
        try {
            await axios.post('http://localhost:3000/stats/page-views', {
                pageId,
                pageName
            });
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement de la vue de page:', error);
        }
    };

    // Fonction pour vérifier si la page a déjà été visitée dans cette session
    const shouldRecordPageView = (pageId) => {
        // Récupérer les pages visitées du stockage local
        const visitedPages = JSON.parse(localStorage.getItem('visitedPages') || '{}');

        // Vérifier si la page a déjà été visitée
        if (visitedPages[pageId]) {
            // Vérifier si la dernière visite date de plus de 30 minutes
            const lastVisit = new Date(visitedPages[pageId]);
            const now = new Date();
            const timeDiff = now - lastVisit; // différence en millisecondes

            // Si moins de 30 minutes se sont écoulées, ne pas compter comme une nouvelle vue
            if (timeDiff < 30 * 60 * 1000) {
                return false;
            }
        }

        // Mettre à jour le stockage local avec l'heure actuelle
        visitedPages[pageId] = new Date().toISOString();
        localStorage.setItem('visitedPages', JSON.stringify(visitedPages));

        return true;
    };

    useEffect(() => {
        // Obtenir le chemin actuel
        const currentPath = location.pathname;

        // Ne rien faire si c'est le même chemin (pour éviter les rerenders)
        if (previousPathRef.current === currentPath) {
            return;
        }

        // Mettre à jour la référence du chemin précédent
        previousPathRef.current = currentPath;

        // Gérer les chemins dynamiques (avec paramètres)
        let pageId = currentPath;
        let pageName = pageNameMapping[currentPath];

        // Si le chemin contient des paramètres, extraire la partie principale
        if (!pageName) {
            // Essayer de faire correspondre les chemins dynamiques
            const dynamicPaths = [
                { pattern: /^\/document_UI\/[^/]+$/, name: 'Interface document', id: '/document_UI/:id' },
                { pattern: /^\/doc_n_type\/[^/]+$/, name: 'Document et type', id: '/doc_n_type/:id' },
                { pattern: /^\/edit-service\/[^/]+\/[^/]+$/, name: 'Édition service', id: '/edit-service/:category/:id' },
                { pattern: /^\/edit-document-type\/[^/]+\/[^/]+$/, name: 'Édition type document', id: '/edit-document-type/:category/:id' },
                { pattern: /^\/edit-metadata\/[^/]+$/, name: 'Édition métadonnée', id: '/edit-metadata/:id' },
                { pattern: /^\/edit-piece\/[^/]+\/[^/]+$/, name: 'Édition pièce', id: '/edit-piece/:category/:id' },
                { pattern: /^\/documents\/[^/]+$/, name: 'Détails document', id: '/documents/:id' },
                { pattern: /^\/documents\/edit\/[^/]+$/, name: 'Édition document', id: '/documents/edit/:id' },
                { pattern: /^\/agence\/config-docType\/[^/]+$/, name: 'Configuration type document', id: '/agence/config-docType/:id' }
            ];

            for (const { pattern, name, id } of dynamicPaths) {
                if (pattern.test(currentPath)) {
                    pageName = name;
                    pageId = id;
                    break;
                }
            }

            // Si toujours pas de correspondance, utiliser le chemin comme nom
            if (!pageName) {
                pageName = `Page ${currentPath}`;
            }
        }

        // Vérifier si nous devons enregistrer cette vue
        if (shouldRecordPageView(pageId)) {
            // Enregistrer la vue de page
            recordPageView(pageId, pageName);
        }

    }, [location.pathname]);
};

export default usePageViewTracker; 