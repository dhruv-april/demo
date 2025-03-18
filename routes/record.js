const express = require('express');
const record = require('../controllers/record');

const router = express.Router();

router.get('/', (req, res) => record.handleGetRecords(req, res));

router.post('/', (req, res) => record.handlePostRecords(req, res));

module.exports = router;