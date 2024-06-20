CREATE TABLE IF NOT EXISTS Services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS DocumentTypes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT,
    documentTypeId INT,
    FOREIGN KEY (documentTypeId) REFERENCES DocumentTypes(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Metadata (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cle VARCHAR(255) NOT NULL,
    value TEXT,
    documentTypeId INT,
    FOREIGN KEY (documentTypeId) REFERENCES DocumentTypes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ServiceDocuments (
    serviceId INT,
    documentId INT,
    PRIMARY KEY (serviceId, documentId),
    FOREIGN KEY (serviceId) REFERENCES Services(id) ON DELETE CASCADE,
    FOREIGN KEY (documentId) REFERENCES Documents(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS DocumentMetadata (
    documentId INT,
    metadataId INT,
    value TEXT,
    PRIMARY KEY (documentId, metadataId),
    FOREIGN KEY (documentId) REFERENCES Documents(id) ON DELETE CASCADE,
    FOREIGN KEY (metadataId) REFERENCES Metadata(id) ON DELETE CASCADE
);


pout obtenir les Metadata pour un Document spécifique :
SELECT dm.value, m.key
FROM DocumentMetadata dm
JOIN Metadata m ON dm.metadataId = m.id
WHERE dm.documentId = 1;
