import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
  TextField,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Fade,
  Divider,
  Tooltip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Description as DocumentIcon, Menu as MenuIcon, Add as AddIcon, FileCopyOutlined } from '@mui/icons-material';
import axios from 'axios';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import Side_bar from '../../../Components/Side_bar';
import DocumentDetails from './Document_details';

const drawerWidth = 250; // Sidebar width

const MainContainer = styled('div')({
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
});

const ContentContainer = styled(Container)(({ theme }) => ({
  marginLeft: drawerWidth,
  marginTop: theme.spacing(10),
  padding: theme.spacing(4),
  backgroundColor: '#f4f6f8',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '80%',
  transition: 'all 0.3s ease-in-out',
  overflow:"auto"
}));

const TopBar = styled(AppBar)(({ theme }) => ({
  width: `calc(100% - ${drawerWidth}px)`,
  marginLeft: drawerWidth,
  backgroundColor: '#2c3e50',
  transition: 'background-color 0.3s ease-in-out',
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  boxShadow: 3,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  height:"500px",
  width: '100%',
}));

const FormContainer = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  width: '100%',
  boxShadow: 3,
  overflow:"visible",
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
  },
}));

const VerticalBorderTable = styled(Table)(({ theme }) => ({
  borderCollapse: 'collapse',
  width: '100%',
  '& th, & td': {
    borderRight: '1px solid #ddd',
    padding: theme.spacing(1),
  },
  '& th:last-child, & td:last-child': {
    borderRight: 'none',
  },
  '& tr:not(:last-child)': {
    borderBottom: '1px solid #ddd',
  },
}));

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [loadingForm, setLoadingForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [documentTypes, setDocumentTypes] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [formData, setFormData] = useState({});
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState('');

  const navigate = useNavigate();

  const fetchDocuments = async (documentTypeId) => {
    setLoadingDocuments(true);
    try {
      const response = await axios.get(`http://localhost:3000/documents/type/${documentTypeId}`);
      setDocuments(response.data);
      
    } catch (error) {
      console.error('Error fetching documents:', error);
      setErrorMessage('Failed to fetch documents');
    } finally {
      setLoadingDocuments(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:3000/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchDocumentTypes = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/document-types/services/${selectedService}/document-types`);
      setDocumentTypes(response.data);
    } catch (error) {
      console.error('Error fetching document types:', error);
    }
  };

  const fetchMetadata = async (documentTypeId) => {
    setLoadingForm(true);
    try {
      const response = await axios.get(`http://localhost:3000/document-types/${documentTypeId}/metadata`);
      setMetadata(response.data);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
    setLoadingForm(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService) {
      fetchDocumentTypes();
    } else {
      setDocumentTypes([]);
    }
  }, [selectedService]);

  useEffect(() => {
    if (selectedDocumentType) {
      fetchDocuments(selectedDocumentType);
      fetchMetadata(selectedDocumentType);
    } else {
      setDocuments([]);
      setMetadata([]);
    }
  }, [selectedDocumentType]);

  const handleCreateSuccess = () => {
    setSuccessMessage('Document created successfully');
    fetchDocuments(selectedDocumentType);
  };

  const handleCreateError = () => {
    setErrorMessage('Failed to create document');
  };

  const handleViewDetails = (doc) => {
    setSelectedDocument(doc);
    setOpenDetailsDialog(true);
    
  };

  const handleEdit = (doc) => {
    console.log('Edit document:', doc);
  };

  const handleDelete = async (doc) => {
    try {
      await axios.delete(`http://localhost:3000/documents/${doc.id}`);
      setSuccessMessage('Document supprimé avec succès !!!');
      fetchDocuments(selectedDocumentType);
    } catch (error) {
      console.error('erreur lors de a suppression :', error);
      setErrorMessage('Echec lors de la suppression, verifiez le serveur');
    }
  };

  const handleCloseSnackbar = (setter) => () => {
    setter('');
  };

  const handleDocumentTypeChange = (event) => {
    const documentTypeId = event.target.value;
    setFormData({ ...formData, documentTypeId });
    setSelectedDocumentType(documentTypeId);
  };

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoadingForm(true);
    
    try {
      await axios.post('http://localhost:3000/documents', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      handleCreateSuccess();
    } catch (error) {
      console.error('Error creating document:', error);
      handleCreateError();
    }
    setLoadingForm(false);
  };

  return (
    <div className="show_documents">
      <Side_bar />
      <MainContainer>
        <TopBar position="fixed">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Application Archive
            </Typography>
          </Toolbar>
        </TopBar>
        <ContentContainer>
          <Fade in={!loadingForm} timeout={1000}>
            <FormContainer>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  <AddIcon style={{ marginRight: 8 }} />
                  Nouveau document
                </Typography>
                <form onSubmit={handleSubmit}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Service</InputLabel>
                    <Select
                      name="serviceId"
                      value={selectedService}
                      onChange={handleServiceChange}
                      label="Service"
                    >
                      {services.map((service) => (
                        <MenuItem key={service.id} value={service.id}>
                          {service.nom_service}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Type de document</InputLabel>
                    <Select
                      name="documentTypeId"
                      value={formData.documentTypeId || ''}
                      onChange={handleDocumentTypeChange}
                      label="Type de document"
                      disabled={!selectedService}
                    >
                      {documentTypes.map((docType) => (
                        <MenuItem key={docType.id} value={docType.id}>
                          {docType.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {metadata.map((meta) => (
                    <TextField
                      key={meta.id}
                      name={meta.cle}
                      label={meta.cle}
                      value={formData[meta.cle] || ''}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      type={meta.metaType}
                    />
                  ))}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    disabled={loadingForm}
                  >
                    {loadingForm ? <CircularProgress size={24} /> : 'Créer'}
                  </Button>
                </form>
              </CardContent>
            </FormContainer>
          </Fade>
          <Divider style={{width:"100%", background:"#333"}}/>
          <Box sx={{ width: '100%', overflowX: 'auto', height:"100vh", overflow:"visible" }}>
            <StyledBox>
              <Typography variant="h4" gutterBottom>
                Liste des documents
              </Typography>
              <VerticalBorderTable>
                <TableHead>
                  <TableRow>
                    <TableCell>Element créé</TableCell>
                    <TableCell>Type du document</TableCell>
                    <TableCell>Date de création</TableCell>
                    <TableCell>Liste des actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell> <FileCopyOutlined/> Document</TableCell>
                      <TableCell>{doc.documentTypeName}</TableCell>
                      <TableCell>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleViewDetails(doc)}
                          color="primary"
                          aria-label="view details"
                        >
                        <Tooltip title="Voir détails">
                        <DocumentIcon />
                        </Tooltip>
                        </IconButton>
                        <IconButton
                          onClick={() => handleEdit(doc)}
                          color="secondary"
                          aria-label="edit"
                        >
                         <Tooltip title="Modifier">
                         <EditIcon />
                         </Tooltip>
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(doc)}
                          color="error"
                          aria-label="delete"
                        >
                          <Tooltip title="Supprimer">
                          <DeleteIcon />
                          </Tooltip>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </VerticalBorderTable>
            </StyledBox>
          </Box>
          <Dialog
            open={openDetailsDialog}
            onClose={() => setOpenDetailsDialog(false)}
            fullWidth
          >
            <DialogTitle>Document Details</DialogTitle>
            <DialogContent>
              <DocumentDetails document={selectedDocument} />
            </DialogContent>
          </Dialog>
          <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={handleCloseSnackbar(setSuccessMessage)}>
            <Alert onClose={handleCloseSnackbar(setSuccessMessage)} severity="success">
              {successMessage}
            </Alert>
          </Snackbar>
          <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={handleCloseSnackbar(setErrorMessage)}>
            <Alert onClose={handleCloseSnackbar(setErrorMessage)} severity="error">
              {errorMessage}
            </Alert>
          </Snackbar>
        </ContentContainer>
      </MainContainer>
    </div>
  );
};

export default DocumentList;
