require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const serviceRoutes = require("./routes/serviceRoutes");
const documentRoutes = require("./routes/documentRoutes");
const pieceRoutes = require("./routes/pieceRoute");
const documentTypeRoutes = require("./routes/documentTypeRoutes");
const metadataRoutes = require("./routes/metadataRoutes");
const documentMetadataRoutes = require("./routes/documentMetadataRoutes");
const agentRoutes = require("./routes/agentRoutes");
const roles = require("./routes/rolesRoutes");
const profil = require("./routes/profilRoutes");
const profilConfig = require("./routes/profilConfigRoutes");
const profilActionsRoutes = require("./routes/profil_actionsRoutes");
const searchRoutes = require("./routes/searchRoutes");
const searchConfigRoutes = require("./routes/search-configRoutes");
const searchResultRoutes = require("./routes/searchResultRoutes");
const agenceMetadataRoutes = require("./routes/agence_routes/metadata_routes");
const agenceRoutes = require("./routes/agence_routes/agence_routes");
const guichetRoutes = require("./routes/agence_routes/guichet_routest");
const agenceDocumentTypeRoutes = require("./routes/agence_routes/documentType_routes");
const agencePieceRoutes = require("./routes/agence_routes/agencePiece_routes");
const agenceCaisseRoutes = require("./routes/agence_routes/Caisse_routes");
const relationsRoutes = require("./routes/agence_routes/relations_routes");
const dossiersRoutes = require("./routes/agence_routes/dossiers_routes");
const importRoutes = require("./routes/agence_routes/importRoutes");
const statsRoutes = require("./routes/statsRoutes");
const tree_script = require("./models/tree_script");
const caisseDatesRoutes = require("./models/agence_model/search_api_caisse");
const stats_AgenceRoutes = require("./routes/agence_routes/StatsRoutes");
const transaction_caisse_Routes = require("./routes/agence_routes/transactionRoutes");
const fs = require("fs");
const errorHandler = require("./middlewares/ErrorHandler");
const compression = require("compression");
const { exec } = require("child_process");

const app = express();
const path = require("path");

const cors = require("cors");

const corsOptions = {
  origin: ["http://localhost:5173", "http://192.168.92.48:3000"],
  credentials: true,
  allowedHeaders: ["sessionId", "content-type", "Authorization"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  maxBuffer: 1024 * 1024 * 10,
};
app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: "10mb" }));
app.use(compression());
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

const baseDirectory = path.join(__dirname, "archives");

// Fonction pour créer le répertoire de base "archives" si nécessaire
function createDirectoryIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Répertoire créé : ${dirPath}`);
  }
}

// Créer le répertoire de base "archives" au démarrage du serveur
createDirectoryIfNotExists(baseDirectory);

app.use("/uploads", express.static(path.join(__dirname, "/uploads/")));
app.use(
  "/agence_uploads",
  express.static(path.join(__dirname, "/agence_uploads/"))
);
app.use(
  "/agence_uploads",
  express.static(path.join(__dirname, "agence_uploads/caisse/"))
);
console.log(path.join(__dirname, "/agence_uploads/caisse/"));

app.use("/pieces", express.static(path.join(__dirname, "/uploads/pieces/")));
app.use("/lot", express.static(path.join(__dirname, "/uploads/lot/")));

// Routes
app.use("/services", serviceRoutes);
app.use("/documents", documentRoutes);
app.use("/document-types", documentTypeRoutes);
app.use("/pieces", pieceRoutes);
app.use("/metadata", metadataRoutes);
app.use("/document-metadata", documentMetadataRoutes);
app.use("/agents", agentRoutes);
app.use("/roles", roles);
app.use("/profil", profil);
app.use("/rights", profilActionsRoutes);
app.use("/profil-config", profilConfig);
app.use("/search", searchRoutes);
app.use("/search-config", searchConfigRoutes);
app.use("/search-result", searchResultRoutes);
app.use("/agences", agenceRoutes);
app.use("/guichet", guichetRoutes);
app.use("/agence/document-type", agenceDocumentTypeRoutes);
app.use("/agence/piece", agencePieceRoutes);
app.use("/caisse", agenceCaisseRoutes);
app.use("/agence/metadata", agenceMetadataRoutes);
app.use("/relations", relationsRoutes);
app.use("/stats", statsRoutes);
app.use("/api", caisseDatesRoutes);
app.use("/tree", tree_script);
app.use("/stats_agences", stats_AgenceRoutes);
app.use("/agence/dossiers", dossiersRoutes);
app.use("/agence/import", importRoutes);
app.use("/agence/transaction_caisse", transaction_caisse_Routes);

app.use(errorHandler);





// Middleware pour servir les fichiers statiques
// app.use(express.static(path.join(__dirname, 'dist')));

// // Route pour toutes les requêtes
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Serveur lancé sur le port: ${PORT}`);
});

// // Route pour recevoir les morceaux de données
// app.post("/upload/dossiers", (req, res) => {
//   const chunks = req.body; // Récupération des données envoyées

//   // Vérification que les données sont un tableau
//   if (!Array.isArray(chunks)) {
//     return res
//       .status(400)
//       .json({ message: "Les données doivent être un tableau." });
//   }

//   // Traitement des données ici (exécution du script pour chaque chunk)
//   chunks.forEach((chunk) => {
//     // Définir le chemin du script à exécuter
//     const scriptPath = path.join(
//       __dirname,
//       "scripts",
//       "import_csv_dossiers.js"
//     );

//     // Appel du script Node.js avec les arguments requis
//     const db_url = "mysql://root@localhost/agence"; // Assurez-vous que cette URL est correcte
//     exec(
//       `node ${scriptPath} '${JSON.stringify(chunk)}' ${db_url} 100`,
//       (error, stdout, stderr) => {
//         if (error) {
//           console.error(`Erreur: ${error.message}`);
//           return;
//         }
//         if (stderr) {
//           console.error(`stderr: ${stderr}`);
//           return;
//         }
//         console.log(`stdout: ${stdout}`);
//       }
//     );
//   });

//   // Réponse de succès
//   res.status(200).json({ message: "Chunks reçus et traités avec succès." });
// });
