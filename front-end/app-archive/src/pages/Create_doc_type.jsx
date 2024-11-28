// src/pages/CreateDocumentType.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import doc_type_icone from "../assets/document_type.png";
import { Container, TextField, Select, MenuItem, InputLabel, FormControl, Button, Box, Typography, Snackbar, Alert, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
  textAlign: 'center',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export default function CreateDocumentType({ onCreate }) {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedServiceName, setSelectedServiceName] = useState('');
  const [name, setName] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: '' });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/services');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Nom du service sélectionné:', selectedServiceName); // Vérification
    try {
      await axios.post('http://localhost:3000/document-types', {
        name,
        serviceId: selectedService,
        serviceName: selectedServiceName, // Ajout du nom du service
      });
      setName('');
      setSelectedService('');
      setSelectedServiceName(''); // Réinitialiser le nom du service
      setNotification({ open: true, message: 'Nouveau type de document créé avec succès !', severity: 'success' });
      onCreate();
    } catch (error) {
      console.error('Error creating document type:', error);
      setNotification({ open: true, message: 'Erreur lors de la création...', severity: 'error' });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ open: false, message: '', severity: '' });
  };

  return (
    <Container>
      <Box component="form" onSubmit={handleSubmit}>
        <StyledTypography variant="h4" gutterBottom>
          <img src={doc_type_icone} alt="" style={{ width: 50, height: 50, marginRight: 10 }} />
          Création d'un type de document
        </StyledTypography>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Nom du type de document"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Liste des services</InputLabel>
          <Select
            value={selectedService}
            onChange={(e) => {
              const selectedServiceId = e.target.value;
              const selectedServiceObj = services.find(service => service.id === selectedServiceId);
              setSelectedService(selectedServiceId);
              setSelectedServiceName(selectedServiceObj ? selectedServiceObj.nom_service : ''); // Mettre à jour le nom du service
              console.log('Service sélectionné:', selectedServiceObj); // Vérification
            }}
          >
            <MenuItem value="" disabled>Selectionnez un service</MenuItem>
            {services.map((service) => (
              <MenuItem key={service.id} value={service.id}>
                {service.nom_service}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <StyledButton
          type="submit"
          variant="contained"
        >
          Créer le type de document
        </StyledButton>
      </Box>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
