import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import { Lock } from '@mui/icons-material';

const LockPage = () => {
  return (
    <div>
      <Modal
        open={true}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          sx={{
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
            borderRadius: '10px',
          }}
        >
          <IconButton>
            <Lock style={{ fontSize: 50, color: 'red' }} />
          </IconButton>
          <Typography id="modal-title" variant="h6" component="h2">
            Page en développement
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Contenu inaccessible
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default LockPage;

