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

-----------------------------------------------
CREATE TABLE IF NOT EXISTS Service_Directories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    nom_service TEXT,
    directory_id INT,
    FOREIGN KEY (directory_id) REFERENCES Directories(id) ON DELETE CASCADE
) ENGINE=InnoDB;


ALTER TABLE Service_Directories ENGINE=InnoDB;

ALTER TABLE Service_Directories
ADD CONSTRAINT fk_service_directories_directory_id
FOREIGN KEY (directory_id) REFERENCES Directories(id) ON DELETE CASCADE;


CREATE TABLE IF NOT EXISTS DocumentTypes2 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    service_id int,
    FOREIGN KEY (service_id) REFERENCES service_directories(id) ON DELETE CASCADE
) ENGINE=InnoDB;



insert into DocumentTypes2 (name, service_id) values ('DocumentType1', 1);
insert into DocumentTypes2 (name, service_id) values ('DocumentType2', 2);
insert into DocumentTypes2 (name, service_id) values ('DocumentType3', 3);
insert into DocumentTypes2 (name, service_id) values ('DocumentType4', 2);
insert into DocumentTypes2 (name, service_id) values ('DocumentType5', 1);


insert into directories (code, nom_directory) values ('1', 'directory1');
insert into directories (code, nom_directory) values ('2', 'directory2');
insert into directories (code, nom_directory) values ('3', 'directory3');

--pour inserer les services dans la table service_directories de facon aleatoire, car
--il y a 3 directories et 10 services et pour ne pas créer de conflit dans les codes
--car les services etaient deja existant
INSERT INTO Service_Directories (code, nom_service, directory_id) VALUES
('SB', 'SERVICE BUDGET', FLOOR(1 + RAND() * 3)),
('SC', 'SERVICE COMPTABILITE', FLOOR(1 + RAND() * 3)),
('SMC', 'SERVICE MARKETING ET COMMUNICATION', FLOOR(1 + RAND() * 3)),
('PMG', 'PATRIMOINE ET MOYENS GENERAUX', FLOOR(1 + RAND() * 3)),
('SRH', 'SERVICE RESSOURCES HUMAINES', FLOOR(1 + RAND() * 3)),
('SFT', 'SERVICE FINANCE COMPABILITE', FLOOR(1 + RAND() * 3)),
('SAA', 'SERVICE ARCHIVES', FLOOR(1 + RAND() * 3)),
('SE', 'SERVICE D''EPARGNE', FLOOR(1 + RAND() * 3)),
('SES', 'SERVICE D''ETUDE ET STATISTIQUES', FLOOR(1 + RAND() * 3)),
('SCR', 'SERVICE CREDIT ET RESEAU', FLOOR(1 + RAND() * 3)),
('SPQ', 'SERVICE SUIVI DES PERFORMANCES ET QUALITES', FLOOR(1 + RAND() * 3)),
('SJ', 'SERVICE JURIDIQUE', FLOOR(1 + RAND() * 3)),
('0O232', 'service technique', FLOOR(1 + RAND() * 3));







CREATE TABLE documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_type_id INT NOT NULL,
  created_at DATETIME
) ENGINE=InnoDB;



CREATE TABLE document_metadata (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_id INT NOT NULL,
  metadata_id INT NOT NULL,
  value TEXT,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE document_pieces (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_id INT NOT NULL,
  piece_id INT NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  FOREIGN KEY (piece_id) REFERENCES pieces(id) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE document_lot (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_id INT,
  files VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
) ENGINE=InnoDB;


  CREATE TABLE IF NOT EXISTS metadata (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cle VARCHAR(255) NOT NULL,
  metaType VARCHAR(255) NOT NULL,
  documentTypeId INT,
  FOREIGN KEY (documentTypeId) REFERENCES DocumentTypes2(id) ON DELETE CASCADE
) ENGINE=InnoDB;

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



-- Requête pour supprimer une colonne d'une table
ALTER TABLE search_params DROP COLUMN show_state;


--example d'insertion
INSERT INTO search_params (meta_id, show_state) VALUES
(1, true),
(2, false),
(3, true);

    
--pour obtenir les Metadata pour un Document spécifique :
SELECT dm.value, m.key
FROM DocumentMetadata dm
JOIN Metadata m ON dm.metadataId = m.id
WHERE dm.documentId = 1;



-->pour obtenir le nom du type de doc et de son service
 SELECT dt.id, dt.name, s.name AS serviceName    FROM documentTypes dt   
  LEFT JOIN services s ON dt.serviceId = s.id;


 
 maintenant passons aux documents en plus des methodes 
 qu'il y a on doit pouvoir obtenir un document avec le nom de son type de document et de



 SELECT m.name, dm.value
FROM document_metadata dm
JOIN metadata m ON dm.metadata_id = m.id
WHERE dm.document_id = 9
