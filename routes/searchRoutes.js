const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');


router.get('/get_files/:id', searchController.getUploadedFilesController);
router.post('/', searchController.searchController);


module.exports = router;
