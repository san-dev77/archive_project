import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, CircularProgress, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Side_bar from '../../Components/Side_bar';
import Top_bar from '../../Components/Top_bar';
import { MainWrapper, ContentWrapper } from '../../style-components/main.styled';

const EditService = () => {
  const { id } = useParams();
  const [service, setService] = useState({ id: '', code: '', nom_service: '' });
  const [loading, setLoading] = useState(true);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/services/${id}`);
        setService(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching service:', error);
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prevService) => ({
      ...prevService,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/services/${id}`, service);
      setOpenSuccess(true);
    } catch (error) {
      console.error('Error updating service:', error);
      setOpenError(true);
    }
  };

  const handleClose = () => {
    setOpenSuccess(false);
    setOpenError(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="edit_page">
      <Side_bar />
      <div className="meta_box">
      <MainWrapper>
        <Top_bar />
        <ContentWrapper>
          <Container maxWidth="sm">
            <Paper style={{ padding: '30px', marginTop: '30px', borderRadius: '10px' }}>
              <Typography variant="h4" gutterBottom>
                Modifier Service
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Code"
                  variant="outlined"
                  name="code"
                  value={service.code}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Nom du Service"
                  variant="outlined"
                  name="nom_service"
                  value={service.nom_service}
                  onChange={handleChange}
                  required
                />
                <Button variant="contained" color="primary" type="submit" fullWidth style={{ marginTop: '20px', padding: '10px 0' }}>
                  Mettre à jour
                </Button>
              </form>
            </Paper>
          </Container>
        </ContentWrapper>
      </MainWrapper>
      </div>
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
                Service mis à jour avec succès !
              </>
            ) : (
              <>
                <ErrorOutlineIcon style={{ color: 'red', verticalAlign: 'middle', marginRight: '8px' }} />
                Échec de la mise à jour du service...
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditService;
