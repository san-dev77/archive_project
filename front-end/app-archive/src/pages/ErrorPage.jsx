import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ErrorPage.css";
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from "lucide-react";

const ErrorPage = ({ error, resetError, isNotFound = false }) => {
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

  return (
    <div className="error-page-container">
      <div className="error-content">
        <div className="error-icon">
          <AlertTriangle size={50} />
        </div>

        <h1>
          {isNotFound
            ? "Page introuvable (404)"
            : "Oups! Quelque chose s'est mal passé"}
        </h1>

        <div className="error-details">
          <p className="error-message">
            {error?.message ||
              (isNotFound
                ? "La page que vous recherchez n'existe pas ou a été déplacée."
                : "Une erreur inattendue s'est produite dans l'application.")}
          </p>

          {error?.details && (
            <p className="error-subdetails">{error.details}</p>
          )}

          {process.env.NODE_ENV === "development" &&
            error?.stack &&
            !isNotFound && (
              <details className="error-stack">
                <summary>Détails techniques</summary>
                <pre>{error.stack}</pre>
              </details>
            )}
        </div>

        <div className="error-metrics">
          <div className="metric">
            <div className="metric-label">Statut</div>
            <div className="metric-value">{isNotFound ? "404" : "500"}</div>
          </div>
          <div className="metric">
            <div className="metric-label">Type</div>
            <div className="metric-value">
              {isNotFound ? "Not Found" : "System Error"}
            </div>
          </div>
          <div className="metric">
            <div className="metric-label">Timestamp</div>
            <div className="metric-value">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        <div className="error-actions">
          {!isNotFound && (
            <button className="action-button retry" onClick={handleRetry}>
              <RefreshCw size={18} />
              <span>Réessayer</span>
            </button>
          )}

          {isNotFound && (
            <button className="action-button back" onClick={handleGoBack}>
              <ArrowLeft size={18} />
              <span>Page précédente</span>
            </button>
          )}

          <button className="action-button home" onClick={handleReturnHome}>
            <Home size={18} />
            <span>Accueil</span>
          </button>
        </div>

        <div className="error-help">
          <p>
            {isNotFound
              ? "Vérifiez l'URL ou utilisez la navigation du site pour trouver ce que vous cherchez."
              : "Si le problème persiste, veuillez contacter l'administrateur système ou essayer de vous reconnecter."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
