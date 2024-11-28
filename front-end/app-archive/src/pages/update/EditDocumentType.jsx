import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography, MenuItem, Select, InputLabel, FormControl, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert, AlertTitle } from '@mui/material';
import Side_bar from '../../Components/Side_bar';
import Top_bar from '../../Components/Top_bar';
import { MainWrapper, ContentWrapper } from '../../style-components/main.styled';

const EditDocumentType = () => {
  const { id } = useParams();
  const [documentType, setDocumentType] = useState({ service_id: '', name: '' });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false); // State for dialog
  const [dialogType, setDialogType] = useState('success'); // State for dialog type

  useEffect(() => {
    const fetchDocumentType = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/document-types/${id}`);
        console.log('Fetched document type:', response.data);
        setDocumentType({
          service_id: response.data.service_id || '', // Ensure a valid default value
          name: response.data.name || ''
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching document type:', error);
        setLoading(false);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/services');
        console.log('Fetched services:', response.data);
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchDocumentType();
    fetchServices();
  }, [id]);

  useEffect(() => {
    console.log('Updated documentType state:', documentType);
  }, [documentType]);

  useEffect(() => {
    console.log('Updated services state:', services);
  }, [services]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocumentType((prevDocumentType) => ({
      ...prevDocumentType,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating document type with data:', documentType);
      await axios.put(`http://localhost:3000/document-types/${id}`, documentType);
      setDialogType('success');
      setOpenDialog(true); // Open dialog on success
    } catch (error) {
      console.error('Error updating document type:', error);
      setDialogType('error');
      setOpenDialog(true); // Open dialog on error
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit_page">
      <Side_bar />
      <div className="meta_box">
        <MainWrapper>
          <Top_bar />
          <ContentWrapper>
            <Container maxWidth="md">
              <Typography variant="h4" gutterBottom>
                Edit Document Type
              </Typography>
              <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="service-label">Service</InputLabel>
                  <Select
                    labelId="service-label"
                    name="service_id"
                    value={documentType.service_id || ''}
                    onChange={handleChange}
                  >
                    {services.map((service) => (
                      <MenuItem key={service.id} value={service.id}>
                        {service.nom_service}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Nom Type Document"
                  name="name"
                  value={documentType.name || ''}
                  onChange={handleChange}
                  margin="normal"
                />
                <Button type="submit" variant="contained" color="primary">
                  Update Document Type
                </Button>
              </form>
            </Container>
          </ContentWrapper>
        </MainWrapper>
      </div>

      {/* Success/Error Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogType === 'success' ? 'Mise à jour réussie' : 'Échec de la mise à jour'}
        </DialogTitle>
        <DialogContent>
          <Alert severity={dialogType}>
            <AlertTitle>{dialogType === 'success' ? 'Succès' : 'Erreur'}</AlertTitle>
            {dialogType === 'success'
              ? 'Le type de document a été modifié avec succès.'
              : 'La mise à jour du type de document a échoué.'}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditDocumentType;
