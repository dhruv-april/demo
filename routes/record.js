const express = require('express');
const { 
  handleGetRecords, 
  handleCreateRecords, 
  handleUpdateRecords, 
  handleDeleteRecords 
} = require('../controllers/record');
const { operationTypes } = require('../utils/constants');

const router = express.Router();

router.get('/', (req, res) => {
  const result = handleGetRecords();
  return res.status(200).json({ records: result });
});

router.post('/', (req, res) => {
  const objects = req.body;
  
  let results = [];

  if(objects && objects.length > 0) {
    for(let obj of objects) {
      switch(obj['type']) {
        case operationTypes.CREATE:
          const createResult = handleCreateRecords(obj['records']);
          results.push(createResult);
          break;
        case operationTypes.UPDATE:
          const updateResult = handleUpdateRecords(obj['records']);
          results.push(updateResult);
          break;
        case operationTypes.DELETE:
          const deleteResult = handleDeleteRecords(obj['records']);
          results.push(deleteResult);
          break;
        default:
          console.log(`${obj['type']} operation not supported!`);
      }
    }
  } else {
    return res.status(400).json({ message: "Please send valid request body!" });
  }

  return res.status(200).json({ results });
});

module.exports = router;