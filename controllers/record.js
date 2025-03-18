const { isValidObjectId } = require('mongoose');
const { 
  createRecordSchema, 
  updateRecordSchema, 
  deleteRecordSchema 
} = require('../utils/schema');
const { errorHelper } = require('../utils/helper');
const { operationTypes } = require('../utils/constants');
const Record = require('../models/record');

const handleGetRecords = async (req, res) => {
  try {
    const records = await Record.find();
    res.status(200).json({ records });
  } catch(err) {
    console.log('Something went wrong: ', err);
    res.status(500).json({ message: err });
  }
}

const handlePostRecords = async (req, res) => {
  const objects = req.body;
  
  let results = [];

  if(objects && objects.length > 0) {
    for(let obj of objects) {
      switch(obj['type']) {
        case operationTypes.CREATE:
          const createResult = await handleCreateRecords(obj['records']);
          results.push(createResult);
          break;
        case operationTypes.UPDATE:
          const updateResult = await handleUpdateRecords(obj['records']);
          results.push(updateResult);
          break;
        case operationTypes.DELETE:
          const deleteResult = await handleDeleteRecords(obj['records']);
          results.push(deleteResult);
          break;
        default:
          console.log(`${obj['type']} operation not supported!`);
      }
    }
  } else {
    res.status(400).json({ message: "Please send valid request body!" });
  }

  res.status(200).json({ results });
}

const handleCreateRecords = async (records) => {
  let failedRecords = [];
  let successRecords = [];

  try {
    for(let record of records) {
      const { error } = createRecordSchema.validate(record);
      // if invalid schema then add errorMessage with name into failedRecords
      if(error) {
        errorHelper(error.details[0].message, record['name'], operationTypes.CREATE, failedRecords);
      } 
      // else create new record
      else {
        const newRecord = await Record.create(record);
        successRecords.push({ id: newRecord['_id'] });
      }
    }
  } catch(err) {
    console.log('Something went wrong: ', err);
  }

  return {
    type: operationTypes.CREATE,
    failedRecords: failedRecords,
    successRecords: successRecords,
  };
}

const handleUpdateRecords = async (records) => {
  let failedRecords = [];
  let successRecords = [];
  
  try {
    for(let record of records) {
      const { error } = updateRecordSchema.validate(record);
      // if invalid schema then add errorMessage with id into failedRecords
      if(error) {
        errorHelper(error.details[0].message, record['id'], operationTypes.UPDATE, failedRecords);
      } else {
        const recordId = record['id'];
        delete record['id'];

        let updatedRecord = null;
        // check if it is valid ObjectId
        if(isValidObjectId(recordId)) {
          // find record and update it
          updatedRecord = await Record.findByIdAndUpdate(recordId, record, {
            new: true,
            runValidators: true
          });
        }
        
        if(updatedRecord) {
          successRecords.push({ id: recordId });
        }
        // if unable to find and update then add errorMessage with id into failedRecords
        else {
          const errorMessage = 'Record does not exist to update.';
          errorHelper(errorMessage, recordId, operationTypes.UPDATE, failedRecords);
        }
      }
    }
  } catch(err) {
    console.log('Something went wrong: ', err);
  }
  
  return {
    type: operationTypes.UPDATE,
    failedRecords: failedRecords,
    successRecords: successRecords,
  };
}

const handleDeleteRecords = async (records) => {
  let failedRecords = [];
  let successRecords = [];
  
  try {
    for(let record of records) {
      const { error } = deleteRecordSchema.validate(record);
      // if invalid schema then add errorMessage with id into failedRecords
      if(error) {
        errorHelper(error.details[0].message, record['id'], operationTypes.DELETE, failedRecords);
      } else {
        let deletedRecord = null;
        // check if it is valid ObjectId
        if(isValidObjectId(record['id'])) {
          // find record and delete it
          deletedRecord = await Record.findByIdAndDelete(record['id']);
        }

        if(deletedRecord) {
          successRecords.push({ id: record['id'] });
        }
        // if unable to find and delete then add errorMessage with id into failedRecords
        else {        
          const errorMessage = 'Record does not exist to delete.';
          errorHelper(errorMessage, record['id'], operationTypes.DELETE, failedRecords);
        }
      }
    }
  } catch(err) {
    console.log('Something went wrong: ', err);
  }
  
  return {
    type: operationTypes.DELETE,
    failedRecords: failedRecords,
    successRecords: successRecords,
  };
}

module.exports = {
  handleGetRecords,
  handlePostRecords,
};