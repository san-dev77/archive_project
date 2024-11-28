import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Side_bar from '../../Components/Side_bar';
import Top_bar from '../../Components/Top_bar';
import { MainWrapper, ContentWrapper } from '../../style-components/main.styled';

const EditPiece = () => {
  const { id } = useParams();
  const [piece, setPiece] = useState({ code_piece: '', nom_piece: '', document_type_id: '' });
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  useEffect(() => {
    const fetchPiece = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/pieces/${id}`);
        setPiece(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching piece:', error);
        setLoading(false);
      }
    };

    const fetchDocumentTypes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/document-types');
        setDocumentTypes(response.data);
      } catch (error) {
        console.error('Error fetching document types:', error);
      }
    };

    fetchPiece();
    fetchDocumentTypes();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPiece((prevPiece) => ({
      ...prevPiece,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/pieces/${id}`, piece);
      setOpenSuccess(true);
    } catch (error) {
      console.error('Error updating piece:', error);
      setOpenError(true);
    }
  };

  const handleClose = () => {
    setOpenSuccess(false);
    setOpenError(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit_page">
      <Side_bar />
      <MainWrapper>
        <ContentWrapper>
          <Container maxWidth="md">
            <Paper style={{ padding: '20px', marginTop: '20px' }}>
              <Typography variant="h5" gutterBottom>
                Modifier Pièce
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Code"
                  variant="outlined"
                  name="code_piece"
                  value={piece.code_piece}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Nom de la Pièce"
                  variant="outlined"
                  name="nom_piece"
                  value={piece.nom_piece}
                  onChange={handleChange}
                  required
                />
              
                <Button variant="contained" color="primary" type="submit" fullWidth style={{ marginTop: '20px' }}>
                  Mettre à jour
                </Button>
              </form>
            </Paper>
          </Container>
        </ContentWrapper>
      </MainWrapper>
      <Dialog
        open={openSuccess || openError}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {openSuccess ? "Succès" : "Erreur"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {openSuccess ? (
              <>
                <CheckCircleOutlineIcon style={{ color: 'green', verticalAlign: 'middle', marginRight: '8px' }} />
                Pièce mise à jour avec succès !
              </>
            ) : (
              <>
                <ErrorOutlineIcon style={{ color: 'red', verticalAlign: 'middle', marginRight: '8px' }} />
                Échec de la mise à jour de la pièce...
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            OK, j'ai compris.
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditPiece;
