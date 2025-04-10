import { useNavigate } from "react-router-dom";
import "../styles/ErrorPage.css";
import {
  AlertTriangle,
  Home,
  RefreshCw,
  ArrowLeft,
  User,
  Lock,
} from "lucide-react";
import PropTypes from "prop-types";

const ErrorPage = ({
  error,
  resetError,
  isNotFound = false,
  isAuthError = false,
}) => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    if (resetError) resetError();
    navigate("/");
  };

  const handleRetry = () => {
    if (resetError) resetError();
    window.location.reload();
  };

  const handleGoBack = () => {
    if (resetError) resetError();
    window.history.back();
  };

  const handleGoToLogin = () => {
    if (resetError) resetError();
    navigate("/");
  };

  // Déterminer le type d'erreur pour l'affichage
  const isNodeError = error?.message?.includes(
    "Failed to execute 'insertBefore' on 'Node'"
  );

  // Forcer la détection des erreurs 401 même si elles sont masquées par d'autres erreurs
  const isUnauthorized = true; // Forcer l'affichage comme une erreur 401

  // Utiliser une approche plus sûre pour vérifier l'environnement de développement
  const isDevelopment =
    typeof window !== "undefined" && window.location.hostname === "localhost";

  return (
    <div className="error-page-container">
      <div className="error-content">
        <div className="error-icon">
          <Lock size={50} className="text-amber-500" />
        </div>

        <h1>Accès non autorisé (401)</h1>

        <div className="error-details">
          <p className="error-message">
            Votre session a expiré ou vous n'avez pas les droits nécessaires
            pour accéder à cette ressource.
          </p>

          {isDevelopment && error?.stack && (
            <details className="error-stack">
              <summary>Détails techniques</summary>
              <pre>{error?.stack || "Erreur d'authentification 401"}</pre>
            </details>
          )}
        </div>

        <div className="error-metrics">
          <div className="metric">
            <div className="metric-label">Statut</div>
            <div className="metric-value">401</div>
          </div>
          <div className="metric">
            <div className="metric-label">Type</div>
            <div className="metric-value">Unauthorized</div>
          </div>
          <div className="metric">
            <div className="metric-label">Timestamp</div>
            <div className="metric-value">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        <div className="error-actions">
          <button className="action-button login" onClick={handleGoToLogin}>
            <User size={18} />
            <span>Retour à la connexion</span>
          </button>

          <button className="action-button home" onClick={handleReturnHome}>
            <Home size={18} />
            <span>Accueil</span>
          </button>
        </div>

        <div className="error-help">
          <p>
            Veuillez vous reconnecter pour continuer. Si vous pensez qu'il
            s'agit d'une erreur, contactez l'administrateur système.
          </p>
        </div>
      </div>
    </div>
  );
};

ErrorPage.propTypes = {
  error: PropTypes.object,
  resetError: PropTypes.func,
  isNotFound: PropTypes.bool,
  isAuthError: PropTypes.bool,
};

export default ErrorPage;
