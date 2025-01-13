function errorHandler(err, req, res, next) {
  // Log de l'erreur pour le développement
  console.error(err.stack);

  // Réponse pour l'utilisateur
  res.status(500).json({
    message: "Une erreur interne s'est produite",
    error: process.env.NODE_ENV === "production" ? {} : err.message,
  });
}

module.exports = errorHandler;
