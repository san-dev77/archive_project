import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Treebeard, decorators } from 'react-treebeard';
import { FaFolder, FaFolderOpen } from 'react-icons/fa';
import { CircularProgress, Snackbar, Alert } from '@mui/material';
import Side_bar from '../../Components/Side_bar';
import TopBar from '../../Components/Top_bar';
import { Network, TreePalm } from 'lucide-react';

// Custom Header Decorator with animation
const CustomHeader = ({ style, node }) => {
  const Icon = node.children && node.children.length > 0 ? (node.toggled ? FaFolderOpen : FaFolder) : FaFolder;
  const iconStyle = { marginRight: '10px', fontSize: '24px' };

  return (
    <div style={{ ...style.base, ...iconStyle }}>
      <Icon />
      {node.name}
    </div>
  );
};

// Override the default header decorator
decorators.Header = CustomHeader;

export default function TreeViewPage() {
  const [folderTree, setFolderTree] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: '' });
  const [cursor, setCursor] = useState(null);

  useEffect(() => {
    fetchFolderTree();
  }, []);

  const fetchFolderTree = async () => {
    try {
      const response = await axios.get('http://localhost:3000/folder-tree');
      console.log('Données reçues:', response.data);
      setFolderTree({ name: 'root', toggled: true, children: response.data });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching folder tree:', error);
      setError('Failed to fetch folder tree');
      setLoading(false);
    }
  };

  const handleToggle = (node, toggled) => {
    node.toggled = toggled;
    setCursor(node);
    setFolderTree({ ...folderTree });
  };

  const handleCloseNotification = () => {
    setNotification({ open: false, message: '', severity: '' });
  };

  if (loading) return <CircularProgress />;
  if (error) return <div className="text-red-500">{error}</div>;

  if (!folderTree.children || folderTree.children.length === 0) {
    return <div className="text-gray-500">Aucun répertoire disponible</div>;
  }

  console.log('Données à afficher dans Treebeard:', folderTree);

  return (
    <div className="flex min-h-screen bg-gray-300 overflow-hidden">
      <Side_bar isVisible={true} />
      <div className="flex-1 h-[10%] mt-20 flex flex-col overflow-hidden">
        <TopBar />
        <div className="container w-[90%] mx-auto mt-2 bg-white rounded-xl shadow-2xl flex flex-col h-screen overflow-hidden">
          <h1 className="text-2xl  mt-4 ml-4 font-extrabold text-gray-800 flex justify-start w-full">
          <Network size={28} className="mr-3 text-gray-800" />
            Arborescence des dossiers
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex-grow overflow-auto">
            <Treebeard
              data={folderTree}
              onToggle={handleToggle}
              decorators={decorators}
            />
          </div>
          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={handleCloseNotification}
          >
            <Alert onClose={handleCloseNotification} severity={notification.severity}>
              {notification.message}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
}
