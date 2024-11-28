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
  Avatar,
} from '@mui/material';
import { styled } from '@mui/system';
import DescriptionIcon from '@mui/icons-material/Description';
import MetadataIcon from '@mui/icons-material/Category';
import FileCopyIcon from '@mui/icons-material/FileCopy';

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#f5f5f5',
  borderRadius: theme.shape.borderRadius,
  boxShadow: 3,
  marginTop: theme.spacing(3),
  overflow: 'auto',
  maxHeight: '600px',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#ffffff',
  boxShadow: 3,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(3),
}));

const DocumentDetails = (props) => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/documents/${props.document.id}`);
        console.log('Document data:', response.data);
         // Debugging line
        setDocument(response.data);
      } catch (error) {
        console.error('Error fetching document details:', error);
        setErrorMessage('Error fetching document details');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [document]);

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        Détails du document
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : document ? (
        <div>
          <Typography variant="h6" gutterBottom>
            <DescriptionIcon style={{ marginRight: '8px' }} />
            Type de document : {document.documentTypeName}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Créé le : {new Date(document.created_at).toLocaleDateString()}
          </Typography>

          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              <MetadataIcon style={{ marginRight: '8px' }} />
              Métadonnées
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Metadonnées</TableCell>
                    <TableCell>Valeur</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(document.metadata) && document.metadata.length > 0 ? (
                    document.metadata.map((meta) => (
                      <TableRow key={meta.metadata_id}>
                        <TableCell>{meta.cle}</TableCell>
                        <TableCell>{meta.value}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2}>Aucune métadonnée pour ce documents</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </StyledPaper>

          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              <FileCopyIcon style={{ marginRight: '8px' }} />
              Pièces
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Chemin du fichier</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(document.files) && document.files.length > 0 ? (
                    document.files.map((file) => (
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
            </TableContainer>
          </StyledPaper>

          {/* <Button variant="contained" color="primary" onClick={onClose} style={{ marginTop: '16px' }}>
            Fermer
          </Button> */}
        </div>
      ) : (
        <Typography>Aucun document trouvé</Typography>
      )}
      <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage('')}>
        <Alert onClose={() => setErrorMessage('')} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default DocumentDetails;
