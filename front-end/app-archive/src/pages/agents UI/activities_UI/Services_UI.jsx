import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Toolbar, AppBar, IconButton, Container, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Sidebar_UI from '../components_UI/Sidebar_UI';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import { LayoutDashboard } from 'lucide-react';


const Services_UI = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ code: '', nom: '' });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/services');
        setServices(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des services:", error);
      }
    };

    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: value });
  };

  const handleAddService = async () => {
    try {
      const response = await axios.post('http://localhost:3000/services', newService);
      setServices([...services, response.data]);
      setNewService({ code: '', nom: '' });
    } catch (error) {
      console.error("Erreur lors de l'ajout du service:", error);
    }
  };

  return (
    <Box sx={{ display: 'flex', background: "#F8FFF4", width: "100%", height: "100vh" }}>
     
      <Sidebar_UI />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
      <Typography variant="h5" align="center" sx={{ marginBottom:3,color: '#000000',
          display:"flex", alignItems:"center", justifyContent:"center", gap:"10px"
         }}>
           <LayoutDashboard color="green" size="30"/>
            Liste des services producteurs
            </Typography>
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ padding: 2, mb: 3, backgroundColor: '#FFFFFF' }}>
           
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <TextField
                label="Code"
                name="code"
                value={newService.code}
                onChange={handleInputChange}
                sx={{ mr: 2 }}
              />
              <TextField
                label="Nom"
                name="nom"
                value={newService.nom_service}
                onChange={handleInputChange}
                sx={{ mr: 2 }}
              />
              <Button variant="contained" color="primary" onClick={handleAddService}>
                Ajouter Service
              </Button>
            </Box>
          </Paper>
          <TableContainer style={{height:"370px"}} component={Paper}>
            <Table sx={{ borderCollapse: 'separate', borderSpacing: '0' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>Code</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>Nom</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>{service.code}</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>{service.nom_service}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="secondary" sx={{ mr: 1 }}>
                        Modifier
                      </Button>
                      <Button variant="contained" color="error">
                        Supprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </Box>
  );
};

export default Services_UI;
