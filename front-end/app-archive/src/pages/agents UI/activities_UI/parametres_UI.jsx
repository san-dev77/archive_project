import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, IconButton, Box, Button } from '@mui/material';
import { AttachFile as PiecesIcon, Info as MetadataIcon, People as AgentsIcon, AccountCircle as ProfileIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { styled, keyframes } from '@mui/system';
import { Cable, Captions, EyeOff, Link, Network, Settings, UserCheck, UserCheck2, UserRoundCog } from 'lucide-react';

const rotateIcon = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#343E3D',
  color: '#ecf0f1',
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.3s ease-in-out',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '200px',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const CardIconButton = styled(IconButton)(({ theme }) => ({
  color: '#f39c12',
  fontSize: '3rem',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: '#ccc',
    animation: `${bounce} 1s infinite`,
  },
}));

const CardIconBounce = styled(IconButton)(({ theme }) => ({
  color: '#1abc9c',
  fontSize: '3rem',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: '#ccc',
    animation: `${bounce} 1s infinite`,
  },
}));

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#1B2D2A',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const CenteredGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const BottomGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const SettingsPage_UI = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom align="center" 
       style={{display:"flex", alignItems:"center",
        color: '#ecf0f1', marginBottom: '2rem',
        textAlign:"center",
        justifyContent:"center", flexDirection:"column"}}
      >
        <Settings size="40px"/>
        Paramétrages
      </Typography>
      <CenteredGrid container spacing={3} justifyContent="center">
     
    
        <Grid item xs={12} sm={6} md={6}>
          <StyledCard onClick={() => handleNavigate('/metadata')}>
            <CardContent   style={{display:"flex", alignItels:"center",
              justifyContent:"center", flexDirection:"column-reverse"}}
            >
              <Typography variant="h5" component="div" align="center">
              Gestion méta-données
              </Typography>
              <CardIconButton>
              <Captions size="60px" />
              </CardIconButton>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <StyledCard onClick={() => handleNavigate('/pieces')}>
            <CardContent   style={{display:"flex", alignItels:"center",
              justifyContent:"center", flexDirection:"column-reverse"}}
            >
              <Typography variant="h5" component="div" align="center">
              Configuration des pièces
              </Typography>
              <CardIconButton>
              <Cable size="60px" />
              </CardIconButton>
            </CardContent>
          </StyledCard>
        </Grid>
      </CenteredGrid>
      <BottomGrid container spacing={3} justifyContent="center">
    
       
       
      </BottomGrid>
      <Button variant="contained" color="primary" startIcon={<BackIcon />} onClick={() => navigate(-1)} style={{ marginTop: '2rem' }}>
        Retour
      </Button>
    </StyledContainer>
  );
};

export default SettingsPage_UI;
