import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, CircularProgress, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const EditDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/documents/${id}`);
        setDocument(response.data);
        setSelectedType(response.data.document_type_id);
      } catch (error) {
        setErrorMessage('Error fetching document details');
      } finally {
        setLoading(false);
      }
    };

    const fetchDocumentTypes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/documentTypes');
        setDocumentTypes(response.data);
      } catch (error) {
        setErrorMessage('Error fetching document types');
      }
    };

    fetchDocument();
    fetchDocumentTypes();
  }, [id]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:3000/documents/${id}`, { documentTypeId: selectedType });
      setSuccessMessage('Document updated successfully');
      navigate(`/documents/${id}`);
    } catch (error) {
      setErrorMessage('Error updating document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Edit Document</h1>
      {loading ? <CircularProgress /> : document ? (
        <div>
          <FormControl fullWidth margin="normal">
            <InputLabel>Document Type</InputLabel>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              label="Document Type"
            >
              {documentTypes.map(type => (
                <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
          <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage('')}>
            <Alert onClose={() => setSuccessMessage('')} severity="success">
              {successMessage}
            </Alert>
          </Snackbar>
          <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage('')}>
            <Alert onClose={() => setErrorMessage('')} severity="error">
              {errorMessage}
            </Alert>
          </Snackbar>
        </div>
      ) : (
        <p>No document found</p>
      )}
    </div>
  );
};

export default EditDocument;
