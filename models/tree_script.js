const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

const getDirectorySize = (dirPath) => {
    let size = 0;
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
            size += getDirectorySize(itemPath);
        } else {
            size += stats.size;
        }
    }

    return size;
};

const getDirectoryTree = (dirPath) => {
    try {
        const stats = fs.statSync(dirPath);

        if (!stats.isDirectory()) {
            return {
                name: path.basename(dirPath),
                type: 'file',
                size: stats.size
            };
        }

        const items = fs.readdirSync(dirPath);
        const children = items.map(item => {
            const itemPath = path.join(dirPath, item);
            const itemStats = fs.statSync(itemPath);

            if (itemStats.isDirectory()) {
                const dirTree = getDirectoryTree(itemPath);
                return {
                    name: item,
                    type: 'directory',
                    size: getDirectorySize(itemPath),
                    children: dirTree
                };
            } else {
                return {
                    name: item,
                    type: 'file',
                    size: itemStats.size
                };
            }
        });

        return children;
    } catch (error) {
        console.error('Erreur lors de la lecture du répertoire:', error);
        throw error;
    }
};

// Route pour obtenir l'arborescence à partir d'un chemin
router.get('/tree', (req, res) => {
    try {
        const requestedPath = "archives";
        const absolutePath = path.resolve(requestedPath);

        // Vérification de sécurité pour éviter la traversée de répertoire
        if (!absolutePath.startsWith(process.cwd())) {
            console.log(absolutePath);

            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        const tree = getDirectoryTree(absolutePath);
        res.json(tree);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Nouvelle route pour obtenir le contenu des répertoires uploads et agence_uploads
router.get('/uploads-content', (req, res) => {
    try {
        const uploadsPath = path.resolve('uploads');
        const agenceUploadsPath = path.resolve('agence_uploads');

        // Vérification de l'existence des répertoires
        const uploadsExists = fs.existsSync(uploadsPath);
        const agenceUploadsExists = fs.existsSync(agenceUploadsPath);

        const result = {};

        if (uploadsExists) {
            result.uploads = {
                size: getDirectorySize(uploadsPath),
                content: getDirectoryTree(uploadsPath)
            };
        } else {
            result.uploads = { error: 'Répertoire non trouvé' };
        }

        if (agenceUploadsExists) {
            result.agence_uploads = {
                path: agenceUploadsPath,
                size: getDirectorySize(agenceUploadsPath),
                content: getDirectoryTree(agenceUploadsPath)
            };
        } else {
            result.agence_uploads = { error: 'Répertoire non trouvé' };
        }

        res.json(result);
    } catch (error) {
        console.error('Erreur lors de la récupération des uploads:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
