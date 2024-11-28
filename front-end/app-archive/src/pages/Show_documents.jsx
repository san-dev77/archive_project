import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Container,
  Typography,
  Box,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  AppBar,
  Toolbar,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/system';
import Side_bar from '../Components/Side_bar';

const drawerWidth = 250; // Sidebar width

const MainContainer = styled('div')({
  display: 'flex',
});

const ContentContainer = styled(Container)(({ theme }) => ({
  marginLeft: drawerWidth,
  marginTop: theme.spacing(200),
  padding: theme.spacing(4),
  backgroundColor: '#f4f6f8',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '90%',
}));

const TopBar = styled(AppBar)(({ theme }) => ({
  width: `calc(100% - ${drawerWidth}px)`,
  marginLeft: drawerWidth,
  backgroundColor: '#2c3e50',
}));

const StyledBox = styled(Box)(({ theme }) => ({
  height: 400,
  width: '100%',
  backgroundColor: '#ffffff',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  padding: theme.spacing(2),
  overflow: 'auto',
  marginTop: theme.spacing(2),
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: '#2c3e50',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 1,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
}));

const columns = [
  {
    field: 'preview',
    headerName: 'Preview',
    width: 100,
    renderCell: (params) => (
      <img
        src={params.row.image}
        alt={params.row.name}
        style={{ width: 50, height: 50, objectFit: 'cover' }}
      />
    ),
    sortable: false,
    filterable: false,
  },
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Document Name', width: 200 },
  { field: 'description', headerName: 'Description', width: 300 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: (params) => (
      <IconButton
        color="primary"
        onClick={() => handleOpenDialog(params.row)}
      >
        <VisibilityIcon />
      </IconButton>
    ),
  },
];

// Données fictives
const fakeDocuments = [
  {
    id: 1,
    image: 'https://via.placeholder.com/50',
    name: 'Document 1',
    description: 'Description for Document 1',
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/50',
    name: 'Document 2',
    description: 'Description for Document 2',
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/50',
    name: 'Document 3',
    description: 'Description for Document 3',
  },
  {
    id: 4,
    image: 'https://via.placeholder.com/50',
    name: 'Document 4',
    description: 'Description for Document 4',
  },
  {
    id: 5,
    image: 'https://via.placeholder.com/50',
    name: 'Document 5',
    description: 'Description for Document 5',
  },
];

const ShowDocuments = () => {
  const [documents, setDocuments] = useState(fakeDocuments);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = (document) => {
    setSelectedDocument(document);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDocument(null);
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
          <StyledTypography variant="h4" gutterBottom>
            Liste des Documents
          </StyledTypography>
          <Paper style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={documents}
              columns={columns}
              pageSize={5}
              disableSelectionOnClick
            />
          </Paper>

          <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
            <DialogTitle>Document Details</DialogTitle>
            <StyledDialogContent>
              {selectedDocument && (
                <Box>
                  <img
                    src={selectedDocument.image}
                    alt={selectedDocument.name}
                    style={{ width: '100%', height: 'auto', marginBottom: '20px' }}
                  />
                  <Typography variant="h6">{selectedDocument.name}</Typography>
                  <Typography variant="body1">{selectedDocument.description}</Typography>
                </Box>
              )}
            </StyledDialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </ContentContainer>
      </MainContainer>
    </div>
  );
};

export default ShowDocuments;
