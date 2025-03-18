const express = require('express');
const record = require('../controllers/record');
const { operationTypes } = require('../utils/constants');
const asyncMiddleware = require('../middlewares/async');

const router = express.Router();

router.get('/', asyncMiddleware((req, res) => record.handleGetRecords(req, res)));

router.post('/', asyncMiddleware((req, res) => record.handlePostRecords(req, res)));

module.exports = router;