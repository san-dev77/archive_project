const express = require("express");
const bodyParser = require("body-parser");
const serviceRoutes = require("./routes/serviceRoutes");
const documentRoutes = require("./routes/documentRoutes");
const documentTypeRoutes = require("./routes/documentTypeRoutes");
const metadataRoutes = require("./routes/metadataRoutes");
const serviceDocumentRoutes = require("./routes/serviceDocumentRoutes");
const documentMetadataRoutes = require("./routes/documentMetadataRoutes");

const app = express();

app.use(bodyParser.json());

// Routes
app.use("/services", serviceRoutes);
app.use("/documents", documentRoutes);
app.use("/document-types", documentTypeRoutes);
app.use("/metadata", metadataRoutes);
app.use("/service-documents", serviceDocumentRoutes);
app.use("/document-metadata", documentMetadataRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port: ${PORT}`);
});
