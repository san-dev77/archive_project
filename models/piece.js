const pool = require("../config/database");

// Create a new piece
const createPiece = async (code_piece, nom_piece) => {
  const query = "INSERT INTO pieces (code_piece, nom_piece) VALUES (?, ?)";
  const values = [code_piece, nom_piece];

  const [result] = await pool.execute(query, values);

  const [rows] = await pool.execute("SELECT * FROM pieces WHERE id = ?", [
    result.insertId,
  ]);
  return rows[0];
};

// Get all pieces
const getAllPieces = async () => {
  const [rows] = await pool.execute("SELECT * FROM pieces");
  return rows;
};

// Get piece by ID
const getPieceById = async (id) => {
  const [rows] = await pool.execute("SELECT * FROM pieces WHERE id = ?", [id]);
  if (rows.length === 0) {
    throw new Error("Piece not found");
  }
  return rows[0];
};

// Get pieces by document type name
const getPiecesByDocumentTypeId = async (documentTypeId) => {
  const query = `
    SELECT p.* 
    FROM pieces p
    JOIN piece_document_type pdt ON p.id = pdt.piece_id
    WHERE pdt.document_type_id = ?
  `;
  const [rows] = await pool.execute(query, [documentTypeId]);
  return rows;
};

// Get all piece-document type relations
const getAllPieceDocumentRelations = async () => {
  const query = `
    SELECT pd.id, p.code_piece, p.nom_piece, dt.name AS documentTypeName
    FROM piece_document_type pd
    JOIN pieces p ON pd.piece_id = p.id
    JOIN documenttypes dt ON pd.document_type_id = dt.id
  `;

  console.log("Executing query:", query);

  try {
    const [rows] = await pool.execute(query);
    console.log("Query result:", rows);
    return rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

// Link piece to document type
const linkPiecesToDocumentType = async (piece_ids, document_type_id) => {
  console.log(piece_ids, document_type_id);
  
  // Vérifier si le type de document existe
  const documentTypeQuery = "SELECT * FROM documenttypes2 WHERE id = ?";
  const [documentTypeRows] = await pool.execute(documentTypeQuery, [
    document_type_id,
  ]);

  if (documentTypeRows.length === 0) {
    throw new Error("Document type not found");
  }

  // Construire la requête pour insérer plusieurs liens à la fois
  const linkQuery =
    "INSERT INTO piece_document_type (piece_id, document_type_id) VALUES ?";

  // Créer un tableau de valeurs pour chaque pièce
  const values = piece_ids.map((piece_id) => [piece_id, document_type_id]);

  await pool.query(linkQuery, [values]);

  return { piece_ids, document_type_id };
};

const detachPieceFromDocumentType = async (piece_id, document_type_id) => {
  // Vérifier si le type de document existe
  const documentTypeQuery = "SELECT * FROM documenttypes2 WHERE id = ?";
  const [documentTypeRows] = await pool.execute(documentTypeQuery, [
    document_type_id,
  ]);

  if (documentTypeRows.length === 0) {
    throw new Error("Document type not found");
  }

  // Vérifier si la pièce existe
  const pieceQuery = "SELECT * FROM pieces WHERE id = ?";
  const [pieceRows] = await pool.execute(pieceQuery, [piece_id]);

  if (pieceRows.length === 0) {
    throw new Error("Piece not found");
  }

  // Construire la requête pour supprimer le lien
  const unlinkQuery =
    "DELETE FROM piece_document_type WHERE piece_id = ? AND document_type_id = ?";

  await pool.execute(unlinkQuery, [piece_id, document_type_id]);

  return { piece_id, document_type_id };
};

const getPieceDocumentRelationsByTypeName = async (documentTypeName) => {
  const query = `
    SELECT pd.id, p.code_piece, p.nom_piece, dt.name AS documentTypeName
    FROM piece_document_type pd
    JOIN pieces p ON pd.piece_id = p.id
    JOIN documenttypes dt ON pd.document_type_id = dt.id
    WHERE dt.name = ?
  `;
  const [rows] = await pool.execute(query, [documentTypeName]);
  return rows;
};

// Update a piece
const updatePiece = async (id, code_piece, nom_piece) => {
  const query = "UPDATE pieces SET code_piece = ?, nom_piece = ? WHERE id = ?";
  const values = [code_piece, nom_piece, id];

  const [result] = await pool.execute(query, values);

  if (result.affectedRows === 0) {
    throw new Error("Piece not found");
  }

  const [rows] = await pool.execute("SELECT * FROM pieces WHERE id = ?", [id]);
  return rows[0];
};

// Delete a piece
const deletePiece = async (id) => {
  const [result] = await pool.execute("DELETE FROM pieces WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    throw new Error("Piece not found");
  }

  return { message: "Piece deleted successfully" };
};

module.exports = {
  createPiece,
  getAllPieces,
  getPieceById,
  getPiecesByDocumentTypeId,
  getAllPieceDocumentRelations,
  linkPiecesToDocumentType,
  detachPieceFromDocumentType,
  getPieceDocumentRelationsByTypeName,
  updatePiece,
  deletePiece,
};
