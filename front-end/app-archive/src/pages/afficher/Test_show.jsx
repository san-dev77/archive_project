import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Snackbar,
  Alert,
  Box,
  Paper,
  TextField,
  IconButton,
  InputAdornment,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const Topbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: '#1976d2',
  color: '#fff',
}));

const Sidebar = styled(Box)(({ theme }) => ({
  width: 240,
  height: '100vh',
  position: 'fixed',
  top: 0,
  left: 0,
  backgroundColor: '#f5f5f5',
  padding: theme.spacing(2),
  boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
}));

const MainContent = styled(Box)(({ theme }) => ({
  marginLeft: 240,
  padding: theme.spacing(3),
}));

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#f5f5f5',
  borderRadius: theme.shape.borderRadius,
  boxShadow: 3,
  marginTop: theme.spacing(3),
  overflow: 'auto',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#ffffff',
  boxShadow: 3,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(3),
}));

const FloatingActionButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: '#1976d2',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#1565c0',
  },
}));

const DocumentListTestShow = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [expandedDoc, setExpandedDoc] = useState(null);
  const [selectedDocId, setSelectedDocId] = useState(null);
  
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/documents/all');
        setDocuments(response.data);
        setFilteredDocuments(response.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setErrorMessage('Failed to fetch documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredDocuments(
      documents.filter((doc) =>
        doc.documentType.toLowerCase().includes(term) ||
        (Array.isArray(doc.metadata) && doc.metadata.some(meta => meta.value.toLowerCase().includes(term)))
      )
    );
  };

  const handleExpandToggle = (docId) => {
    setExpandedDoc(expandedDoc === docId ? null : docId);
    setSelectedDocId(docId);
  };

  const handleDelete = (docId) => {
    // Implement delete functionality
    console.log('Delete document:', docId);
  };

  const handleEdit = (docId) => {
    // Implement edit functionality
    console.log('Edit document:', docId);
  };

  const handleDelink = (docId) => {
    // Implement delink functionality
    console.log('Delink document:', docId);
  };

  const renderMetadataTable = (metadata) => (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Metadonnées</TableCell>
          <TableCell>Valeur</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {metadata && metadata.length > 0 ? (
          metadata.map((meta, index) => (
            <TableRow key={index}>
              <TableCell>{meta.cle}</TableCell>
              <TableCell>{meta.value}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={2}>Aucune métadonnée pour ce document</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  const renderFileTable = (files) => (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Chemin du fichier</TableCell>
          <TableCell>Description</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {files && files.length > 0 ? (
          files.map((file) => (
            <TableRow key={file.id}>
              <TableCell>{file.file_path}</TableCell>
              <TableCell>{file.description}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={2}>Aucune pièce pour ce document</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <>
      <Topbar>
        <Typography variant="h6">Topbar Title</Typography>
      </Topbar>
      <Sidebar>
        <Typography variant="h6">Sidebar</Typography>
        {/* Add sidebar content here */}
      </Sidebar>
      <MainContent>
        <StyledContainer>
          <Typography variant="h4" gutterBottom>
            Liste des Documents
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={handleSearch}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {loading ? (
            <CircularProgress />
          ) : filteredDocuments.length === 0 ? (
            <Typography variant="body1">Aucun document trouvé</Typography>
          ) : (
            filteredDocuments.map((doc) => (
              <StyledPaper key={doc.id}>
                <Typography variant="h6" gutterBottom>
                  <DescriptionIcon style={{ marginRight: '8px' }} />
                  {doc.documentType}
                  <IconButton
                    onClick={() => handleExpandToggle(doc.id)}
                    style={{ marginLeft: 'auto' }}
                  >
                    {expandedDoc === doc.id ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  </IconButton>
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Créé le : {new Date(doc.created_at).toLocaleDateString()}
                </Typography>
                {expandedDoc === doc.id && (
                  <>
                    {renderMetadataTable(Array.isArray(doc.metadata) ? doc.metadata : [])}
                    {renderFileTable(Array.isArray(doc.files) ? doc.files : [])}
                    <Box mt={2}>
                      <Tooltip title="Modifier">
                        <IconButton color="primary" onClick={() => handleEdit(doc.id)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton color="error" onClick={() => handleDelete(doc.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Délier">
                        <IconButton color="default" onClick={() => handleDelink(doc.id)}>
                          <LinkIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </>
                )}
              </StyledPaper>
            ))
          )}
        </StyledContainer>
        {selectedDocId && (
          <FloatingActionButton
            onClick={() => console.log('Action flottante pour le document sélectionné:', selectedDocId)}
          >
            <DescriptionIcon />
          </FloatingActionButton>
        )}
      </MainContent>
      {errorMessage && (
        <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage('')}>
          <Alert onClose={() => setErrorMessage('')} severity="error">
            {errorMessage}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default DocumentListTestShow;
