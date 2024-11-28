// src/pages/Update_form.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography } from '@mui/material';

const UpdateForm = ({ item, category }) => {
  const [formData, setFormData] = useState(item);
  const [services, setServices] = useState([]);
  const [dataTypes, setDataTypes] = useState(['text', 'date', 'number']); // Example data types

  useEffect(() => {
    if (category === 'type-documents') {
      // Fetch services for the type of document
      axios.get('http://localhost:3000/services')
        .then(response => setServices(response.data))
        .catch(error => console.error('Error fetching services:', error));
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3000/${category}/${item.id}`, formData)
      .then(() => alert('Updated successfully'))
      .catch(error => console.error('Error updating item:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      {category === 'services' && (
        <>
          <TextField
            label="Code du service"
            name="code_service"
            value={formData.code_service || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nom du service"
            name="nom_service"
            value={formData.nom_service || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </>
      )}
      {category === 'type-documents' && (
        <>
          <TextField
            label="Nom du type de document"
            name="nom_type_document"
            value={formData.nom_type_document || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Service</InputLabel>
            <Select
              name="service_id"
              value={formData.service_id || ''}
              onChange={handleChange}
            >
              {services.map((service) => (
                <MenuItem key={service.id} value={service.id}>
                  {service.nom_service}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {category === 'metadata' && (
        <>
          <TextField
            label="Nom de la métadonnée"
            name="nom_metadata"
            value={formData.nom_metadata || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type de donnée</InputLabel>
            <Select
              name="data_type"
              value={formData.data_type || ''}
              onChange={handleChange}
            >
              {dataTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {category === 'pieces' && (
        <>
          <TextField
            label="Code de la pièce"
            name="code_piece"
            value={formData.code_piece || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nom de la pièce"
            name="nom_piece"
            value={formData.nom_piece || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </>
      )}
      <Button type="submit" variant="contained" color="primary">
        Save
      </Button>
    </form>
  );
};

export default UpdateForm;
