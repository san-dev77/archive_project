create database if not exists agence;
use agence;


create table if not exists agence(
    id int auto_increment primary key,
    code_agence varchar(150) not null Unique,
    nom_agence varchar(255) not null,
    created_at timestamp default current_timestamp
) ENGINE=InnoDB;



create table if not exists caisse(
    id int auto_increment primary key,
    code_caisse varchar(255) not null,
    nom_caisse varchar(255),
    agence_id int,
    foreign key (agence_id) references agence(id)
) ENGINE=InnoDB;


create table if not exists agence_pieces(
    id int auto_increment primary key,
    code_piece varchar(255) not null,
    nom_piece varchar(255) not null
) ENGINE=InnoDB;
rename table pieces to agence_pieces;


create table if not exists guichet(
    id int auto_increment primary key,
    code_guichet varchar(255) not null,
    nom_guichet varchar(255) ,
    agence_id int,
    foreign key (agence_id) references agence(id)
) ENGINE=InnoDB;



create table if not exists document_type(
    id int auto_increment primary key,
    nom_document_type varchar(255) not null
) ENGINE=InnoDB;


create table if not exists document_type_agence(
    id int auto_increment primary key,
    document_type_id int,
    created_at timestamp default current_timestamp,
    foreign key (document_type_id) references document_type(id) ON DELETE CASCADE
) ENGINE=InnoDB;


create table if not exists document_type_caisse(
    id int auto_increment primary key,
    document_type_id int,
    created_at timestamp default current_timestamp,
    foreign key (document_type_id) references document_type(id) ON DELETE CASCADE
) ENGINE=InnoDB;

create table if not exists document_type_guichet(
    id int auto_increment primary key,
    document_type_id int,
    created_at timestamp default current_timestamp,
    foreign key (document_type_id) references document_type(id) ON DELETE CASCADE
) ENGINE=InnoDB;


create table if not exists metadata(
    id int auto_increment primary key,
    nom_meta varchar(255) not null,
    valeur varchar(255) not null,
    type_valeur varchar(255) not null,
    document_type_id int,
    foreign key (document_type_id) references document_type(id) ON DELETE CASCADE
) ENGINE=InnoDB;


create table if not exists config_piece_docType(
    id int auto_increment primary key,
    piece_id int,
    document_type_id int,
    foreign key (piece_id) references agence_pieces(id) ON DELETE CASCADE,
    foreign key (document_type_id) references document_type(id) ON DELETE CASCADE
) ENGINE=InnoDB;





create table if not exists transaction_caisse (
    id int auto_increment primary key,
    agence_id int,
    code_caisse int,
    document_type_id int,
    dates date,
    nom_prenom_caissier varchar(255),
    code_definitif varchar(255),
    foreign key (agence_id) references agence(id),
    foreign key (document_type_id) references document_type(id),
    foreign key (code_caisse) references caisse(id)
) ENGINE=InnoDB;

create table if not exists transaction_guichet (
    id int auto_increment primary key,
    agence_id int,
    document_type_id int,
    dates varchar(255),
    nom_prenom_caissier varchar(255),
    code_boite varchar(255),
    foreign key (agence_id) references agence(id),
    foreign key (document_type_id) references document_type(id)
) ENGINE=InnoDB;

create table if not exists transaction_dossiers (
    id int auto_increment primary key,
    agence_id int,
    document_type_id int,
    code_caisse int,
    dates date,
    nom_prenom_caissier varchar(255),
    code_definitif varchar(255),
    foreign key (agence_id) references agence(id),
    foreign key (document_type_id) references document_type(id),
    foreign key (code_caisse) references caisse(id)
) ENGINE=InnoDB;


create table if not exists piece_file(
    id int auto_increment primary key,
    piece_id int,
    type varchar(255),
    file_path varchar(255),
    foreign key (piece_id) references agence_pieces(id) ON DELETE CASCADE
) ENGINE=InnoDB;