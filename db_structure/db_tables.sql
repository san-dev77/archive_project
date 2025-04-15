CREATE TABLE IF NOT EXISTS Directories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    nom_directory TEXT
);

CREATE TABLE IF NOT EXISTS Service_Directories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    nom_service TEXT,
    directory_id INT,
    FOREIGN KEY (directory_id) REFERENCES Directories(id) ON DELETE CASCADE
);


CREATE TABLE optimization_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    operation_type VARCHAR(50), -- 'duplicate_removal' ou 'space_cleanup'
    table_name VARCHAR(100),
    affected_rows INT,
    details TEXT,               -- Détails supplémentaires (JSON ou texte)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



UPDATE permissions
SET section = 
  CASE section
    WHEN 'documents' THEN 'Dossiers'
    WHEN 'metadata' THEN 'Meta-donnees'
    WHEN 'pieces' THEN 'Pieces'
    WHEN 'services' THEN 'Services'
    WHEN 'types_documents' THEN 'Types de documents'
    ELSE section
  END;


-----------------------------------------------

CREATE TABLE IF NOT EXISTS DocumentTypes2 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    service_id int,
    FOREIGN KEY (service_id) REFERENCES service_directories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

--requete pour obtenir la taille de la base de données agence
SELECT table_schema AS database_name, 
       ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb
FROM information_schema.tables
WHERE table_schema = 'agence'
GROUP BY table_schema;

--requete pour obtenir la taille de la base de données archive
SELECT table_schema AS database_name, 
       ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb
FROM information_schema.tables
WHERE table_schema = 'archive'
GROUP BY table_schema;

--requete pour obtenir la taille de chaque table
SELECT table_name, 
       ROUND((data_length + index_length) / 1024 / 1024, 2) AS size_mb
FROM information_schema.tables
WHERE table_schema = 'archive'
ORDER BY size_mb DESC;

--requete pour obtenir le temps moyen des requetes 
SELECT AVG(changed_at) AS temps_moyen_execution, 
       MAX(changed_at) AS temps_max_execution, 
       MIN(changed_at) AS temps_min_execution
FROM audit_log;

SELECT SEC_TO_TIME(AVG(UNIX_TIMESTAMP(changed_at))) AS temps_moyen_execution,
       MAX(changed_at) AS temps_max_execution,
       MIN(changed_at) AS temps_min_execution
FROM audit_log;



CREATE TABLE documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_type_id INT NOT NULL,
  created_at DATETIME
) ENGINE=InnoDB;

ALTER TABLE documents ADD code_unique VARCHAR(255) UNIQUE;
ALTER TABLE documents ADD COLUMN vues INT DEFAULT 0;

CREATE TABLE document_dir (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_type_id INT NOT NULL,
  created_at DATETIME
) ENGINE=InnoDB;

ALTER TABLE document_dir ADD code_unique VARCHAR(255) UNIQUE;


CREATE TABLE document_metadata (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_id INT NOT NULL,
  metadata_id INT NOT NULL,
  value TEXT,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE document_metadata_dir (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_id INT NOT NULL,
  metadata_id INT NOT NULL,
  value TEXT,
  FOREIGN KEY (document_id) REFERENCES document_dir(id) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE document_pieces (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_id INT NOT NULL,
  piece_id INT NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  FOREIGN KEY (piece_id) REFERENCES pieces(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE document_pieces_dir (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_id INT NOT NULL,
  piece_id INT NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  FOREIGN KEY (document_id) REFERENCES document_dir(id) ON DELETE CASCADE,
  FOREIGN KEY (piece_id) REFERENCES pieces(id) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE document_lot (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_id INT,
  files VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE document_lot_dir (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_id INT,
  files VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES document_dir(id) ON DELETE CASCADE
) ENGINE=InnoDB;


  CREATE TABLE IF NOT EXISTS metadata (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cle VARCHAR(255) NOT NULL,
  metaType VARCHAR(255) NOT NULL,
  documentTypeId INT,
  FOREIGN KEY (documentTypeId) REFERENCES DocumentTypes2(id) ON DELETE CASCADE
) ENGINE=InnoDB;

ALTER TABLE metadata ADD COLUMN required BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE metadata_dir ADD COLUMN required BOOLEAN NOT NULL DEFAULT FALSE;

  CREATE TABLE IF NOT EXISTS pieces (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code_piece VARCHAR(255) NOT NULL,
  nom_piece VARCHAR(255) NOT NULL
) ENGINE=InnoDB;



  CREATE TABLE piece_document_type (
      id INT AUTO_INCREMENT PRIMARY KEY,
      piece_id INT NOT NULL,
      document_type_id INT NOT NULL,
      FOREIGN KEY (piece_id) REFERENCES pieces(id),
      FOREIGN KEY (document_type_id) REFERENCES documenttypes2(id) ON DELETE CASCADE
  ) ENGINE=InnoDB;

 
 CREATE TABLE agents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prenom VARCHAR(60) NOT NULL,
  nom VARCHAR(60) NOT NULL,
  tel_number VARCHAR(13) NOT NULL,
  mail VARCHAR(40) NOT NULL,
  fonction_id int,
  login VARCHAR(30) NOT NULL,
  password VARCHAR(30) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  service_id int,
  FOREIGN KEY (service_id) REFERENCES service_directories (id) ON DELETE SET NULL,
  FOREIGN KEY (fonction_id) REFERENCES role (id) ON DELETE SET NULL
 ) ENGINE=InnoDB;

CREATE TABLE connections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES agents(id)
);

CREATE TABLE logout (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    logout_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES agents(id) ON DELETE CASCADE
);


CREATE TABLE page_views (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Identifiant unique
    page_id VARCHAR(255) UNIQUE,        -- URL de la page (ex: "/dashboard")
    page_name VARCHAR(255),             -- Nom lisible (ex: "Tableau de Bord")
    views INT DEFAULT 0,               -- Nombre de vues
        moment DATETIME DEFAULT CURRENT_TIMESTAMP

);


--requetes pour recuperer le nombre de connexions mensuelles
SELECT 
    YEAR(timestamp) AS year, 
    MONTH(timestamp) AS month, 
    COUNT(*) AS total_connections
FROM connections
GROUP BY YEAR(timestamp), MONTH(timestamp)
ORDER BY year DESC, month DESC;



SELECT 
    YEAR(timestamp) AS year, 
    MONTH(timestamp) AS month, 
    DAY(timestamp) AS day,
    DATE_FORMAT(timestamp, '%W') AS day_name, -- Nom du jour
    DATE(timestamp) AS connection_date, -- Date exacte
    HOUR(timestamp) AS hour, -- Heure
    MINUTE(timestamp) AS minute, -- Minute
    COUNT(*) AS total_connections
FROM connections
GROUP BY YEAR(timestamp), MONTH(timestamp), DAY(timestamp), HOUR(timestamp), MINUTE(timestamp)
ORDER BY year DESC, month DESC, day DESC, hour DESC, minute DESC;


CREATE TABLE profil(
  id INT PRIMARY KEY AUTO_INCREMENT,
  nom_profil VARCHAR(100) not NULL,
  description VARCHAR(255) ,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

) ENGINE=InnoDB;

ALTER TABLE profil
ADD COLUMN activation VARCHAR(255);


insert into profil (nom_profil) values ('admin');

CREATE TABLE agent_profil (
  id INT PRIMARY KEY AUTO_INCREMENT,
  agent_id INT not NULL,
  profil_id INT NOT NULL,
  FOREIGN KEY (agent_id) REFERENCES agents (id) ON DELETE CASCADE,
  FOREIGN KEY (profil_id) REFERENCES profil (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE table role (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nom_role VARCHAR(255) not NULL
) ENGINE=InnoDB;

INSERT INTO agents (prenom, nom, tel_number, mail, fonction_id, login, password, service_id) 
VALUES ('John', 'Doe', '1234567890', 'john.doe@example.com', 1, 'login', '123',6);



CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section VARCHAR(50),  
    action VARCHAR(50)  
) ENGINE=InnoDB;


CREATE TABLE profil_permissions (
  id int PRIMARY key AUTO_INCREMENT,
    profil_id INT,
    permission_id INT,
    FOREIGN KEY (profil_id) REFERENCES profil(id) ON DELETE SET NULL,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE SET NULL
) ENGINE=InnoDB;


ALTER TABLE document_metadata ADD FULLTEXT(value);


INSERT INTO permissions (section, action) VALUES 
('services', 'view'),
('services', 'edit'),
('services', 'delete'),

('types_documents', 'view'),
('types_documents', 'edit'),
('types_documents', 'delete'),

('pieces', 'view'),
('pieces', 'edit'),
('pieces', 'delete'),

('metadata', 'view'),
('metadata', 'edit'),
('metadata', 'delete'),

('documents', 'view'),
('documents', 'edit'),
('documents', 'delete');

('Recherche', 'search'),

('Recherche', 'search');




select * from permissions where section = "?????";



CREATE table search_params (
  id int PRIMARY key AUTO_INCREMENT,
  meta_id int,
  document_type_id int,
  FOREIGN KEY (meta_id) REFERENCES metadata(id),
  FOREIGN KEY (document_type_id) REFERENCES documentTypes2(id)
) ENGINE=InnoDB;

CREATE table search_result_meta (
  id int PRIMARY key AUTO_INCREMENT,
  meta_id int,
  show_state boolean,
  document_type_id int,
  FOREIGN KEY (meta_id) REFERENCES metadata(id),
  FOREIGN KEY (document_type_id) REFERENCES documentTypes2(id)
) ENGINE=InnoDB;

--Cette table permet de relier un doc type a une direction
CREATE table doc_type_dir(
     id INT AUTO_INCREMENT PRIMARY KEY,
    name_doc_type VARCHAR(255) NOT NULL,
    directory_id int,
    FOREIGN KEY (directory_id) REFERENCES directories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS metadata_dir (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cle VARCHAR(255) NOT NULL,
  metaType VARCHAR(255) NOT NULL,
  documentTypeId INT,
  FOREIGN KEY (documentTypeId) REFERENCES doc_type_dir(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Requête pour supprimer une colonne d'une table
ALTER TABLE search_params DROP COLUMN show_state;


--example d'insertion
INSERT INTO search_params (meta_id, show_state) VALUES
(1, true),
(2, false),
(3, true);



CREATE TABLE audit_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  table_name VARCHAR(255) NOT NULL,
  operation_type VARCHAR(10) NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- changed_by VARCHAR(255) DEFAULT 'system', -- Pour capturer l'utilisateur si besoin
  -- old_data JSON,  -- Données avant modification (pour UPDATE et DELETE)
  -- new_data JSON   -- Données après modification (pour INSERT et UPDATE)
);




SET SESSION group_concat_max_len = 1000000;

SELECT CONCAT(
  'DELIMITER $$\n',
  'CREATE TRIGGER audit_', table_name, '_changes\n',
  'AFTER INSERT OR UPDATE OR DELETE ON ', table_name, '\n',
  'FOR EACH ROW\n',
  'BEGIN\n',
  '  DECLARE action_type VARCHAR(10);\n',
  '  IF (NEW.id IS NOT NULL AND OLD.id IS NULL) THEN\n',
  '    SET action_type = ''INSERT'';\n',
  '  ELSEIF (NEW.id IS NOT NULL AND OLD.id IS NOT NULL) THEN\n',
  '    SET action_type = ''UPDATE'';\n',
  '  ELSEIF (NEW.id IS NULL AND OLD.id IS NOT NULL) THEN\n',
  '    SET action_type = ''DELETE'';\n',
  '  END IF;\n',
  '  INSERT INTO audit_log (table_name, operation_type, old_data, new_data)\n',
  '  VALUES (''', table_name, ''', action_type, IFNULL(TO_JSON(OLD), NULL), IFNULL(TO_JSON(NEW), NULL));\n',
  'END$$\n',
  'DELIMITER ;\n'
)
FROM information_schema.tables
WHERE table_schema = 'agence' -- Remplace par ton nom de base
  AND table_name != 'audit_log';




 DELIMITER $$

 CREATE TRIGGER audit_agence_insert
     AFTER INSERT ON agence
     FOR EACH ROW
     BEGIN
       INSERT INTO audit_log (table_name, operation_type)
       VALUES ('agence', 'INSERT');
     END$$;


  DELIMITER ;


DELIMITER $$
 CREATE TRIGGER audit_docType_insert
     AFTER INSERT ON document_type
     FOR EACH ROW
     BEGIN
       INSERT INTO audit_log (table_name, operation_type)
       VALUES ('Type de document', 'INSERT');
     END$$

DELIMITER ;


DELIMITER $$
 CREATE TRIGGER audit_guichet_insert
     AFTER INSERT ON guichet
     FOR EACH ROW
     BEGIN
       INSERT INTO audit_log (table_name, operation_type)
       VALUES ('Guichet', 'INSERT');
     END$$
     DELIMITER ;

DELIMITER $$
 CREATE TRIGGER audit_piece_insert
     AFTER INSERT ON guichet
     FOR EACH ROW
     BEGIN
       INSERT INTO audit_log (table_name, operation_type)
       VALUES ('Pièce', 'INSERT');
     END$$
     DELIMITER ;

DELIMITER $$
 CREATE TRIGGER audit_metadata_insert
     AFTER INSERT ON metadata
     FOR EACH ROW
     BEGIN
       INSERT INTO audit_log (table_name, operation_type)
       VALUES ('Metadonnées', 'INSERT');
     END$$
     DELIMITER ;

--Archive triggers



DELIMITER $$
 CREATE TRIGGER audit_directories_insert
     AFTER INSERT ON directories
     FOR EACH ROW
     BEGIN
       INSERT INTO audit_log (table_name, operation_type)
       VALUES ('Nouvelle direction', 'INSERT');
     END$$
     DELIMITER ;
     
DELIMITER $$
 CREATE TRIGGER audit_service_directories_insert
     AFTER INSERT ON service_directories
     FOR EACH ROW
     BEGIN
       INSERT INTO audit_log (table_name, operation_type)
       VALUES ('Nouveau Service', 'INSERT');
     END$$
     DELIMITER ;


DELIMITER $$
 CREATE TRIGGER audit_docType2_insert
     AFTER INSERT ON documenttypes2
     FOR EACH ROW
     BEGIN
       INSERT INTO audit_log (table_name, operation_type)
       VALUES ('Nouveau Type de document', 'INSERT');
     END$$
     DELIMITER ;
     
DELIMITER $$
 CREATE TRIGGER audit_documents_insert
     AFTER INSERT ON documents
     FOR EACH ROW
     BEGIN
       INSERT INTO audit_log (table_name, operation_type)
       VALUES ('Nouveau document', 'INSERT');
     END$$
     DELIMITER ;


--Pas encore fait...: pour voir le triggers : show triggers, drop trigger trigger_name
 CREATE TRIGGER audit_metadata_insert
     AFTER INSERT ON metadata
     FOR EACH ROW
     BEGIN
       INSERT INTO audit_log (table_name, operation_type)
       VALUES ('Metadonnées', 'INSERT');
     END$$
     DELIMITER ;


--firebase 

DELIMITER $$

CREATE TRIGGER audit_audit_log_insert
AFTER INSERT ON audit_log
FOR EACH ROW
BEGIN
    -- Appeler ton serveur Node.js via HTTP (par exemple, avec cURL ou une fonction HTTP)
    -- Dans cet exemple, on suppose que tu appelles une API HTTP avec les données
    -- pour ajouter l'élément dans Firestore
    DECLARE url VARCHAR(255);
    SET url = 'http://localhost:3000/addToFirestore';  -- Remplace par ton URL d'API

    -- Il te faudra peut-être une fonction pour appeler cette URL dans MySQL, ou bien
    -- tu peux faire cela depuis ton application Node.js lorsque tu détectes un changement.
    -- MySQL ne gère pas bien les requêtes HTTP directement, donc il est mieux d'envoyer
    -- les données à Node.js où elles seront traitées.

END$$

DELIMITER ;



DELIMITER $$

CREATE TRIGGER audit_audit_log_insert
AFTER INSERT ON audit_log
FOR EACH ROW
BEGIN
    -- Ajouter une entrée dans la table 'sync_queue'
    INSERT INTO  (table_name, operation_type, data, created_at)
    VALUES ('audit_log', 'INSERT', NEW.*, NOW());
END$$

DELIMITER ;


--A mettre dans une table separé les données viennent par import il y en aurait trop 
--les separer est donc le mieux 
 CREATE TRIGGER audit_transaction_caisse_insert
     AFTER INSERT ON transaction_caisse
     FOR EACH ROW
     BEGIN
       INSERT INTO audit_log_dossiers (table_name, operation_type)
       VALUES ('transaction_caisse', 'INSERT');
     END$$
     DELIMITER ;








 
 maintenant passons aux documents en plus des methodes 
 qu'il y a on doit pouvoir obtenir un document avec le nom de son type de document et de



 SELECT m.name, dm.value
FROM document_metadata dm
JOIN metadata m ON dm.metadata_id = m.id
WHERE dm.document_id = 9
