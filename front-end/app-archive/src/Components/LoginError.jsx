import { HelpCircle, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import "./LoginError.css";

const LoginErrorButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const handleErrorClick = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Empêche le défilement du fond
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Réactive le défilement
  };

  // Ferme la modale si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  // Ferme la modale avec la touche Escape
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isModalOpen]);

  return (
    <>
      <button
        onClick={handleErrorClick}
        className="fixed top-4 right-4 help-button"
        title="Besoin d'aide?"
      >
        <HelpCircle size={24} />
        <span>Aide</span>
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container" ref={modalRef}>
            <div className="modal-header">
              <h2>Besoin d&apos;aide pour vous connecter?</h2>
              <button className="close-button" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-content">
              <div className="help-section">
                <h3 className="text-lg font-semibold text-gray-800">
                  📋 Vérifiez vos informations
                </h3>
                <p className="text-sm text-gray-800">
                  Assurez-vous que votre identifiant et mot de passe sont
                  corrects.
                </p>
              </div>

              <div className="help-section">
                <h3 className="text-lg font-semibold text-gray-800">
                  👤 Vérifiez votre profil
                </h3>
                <p className="text-sm text-gray-800">
                  Votre compte doit être actif et avoir au moins une action
                  associée.
                </p>
              </div>

              <div className="help-section">
                <h3 className="text-lg font-semibold text-gray-800">
                  🔧 Contactez l&apos;administrateur
                </h3>
                <p className="text-sm text-gray-800">
                  Si les problèmes persistent, l&apos;administrateur pourra vous
                  aider.
                </p>
              </div>

              <div className="feedback-section">
                <h3 className="text-lg font-semibold text-gray-800">
                  💬 Partagez votre expérience
                </h3>
                <p className="text-sm text-gray-800">
                  Nous sommes à l&apos;écoute de vos suggestions pour améliorer
                  notre service.
                </p>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfKdEL0TYilfB5bu2LQpQNZIgGbkw1I7BbtJUfOZZZyrbOTuQ/viewform?usp=header"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="feedback-button"
                >
                  Laisser un feedback
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginErrorButton;
