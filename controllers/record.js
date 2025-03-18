const { 
  createRecordSchema, 
  updateRecordSchema, 
  deleteRecordSchema 
} = require('../utils/schema');
const { errorHelper } = require('../utils/helper');
const Record = require('../models/record');

const handleGetRecords = async (req, res) => {
  const records = await Record.find();
  res.status(200).json({ records });
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
        errorHelper(error.details[0].message, record['name'], "CREATE", failedRecords);
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
    type: "CREATE",
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
        errorHelper(error.details[0].message, record['id'], "UPDATE", failedRecords);
      } else {
        const recordId = record['id'];
        delete record['id'];
        // check if record exist into db to update it
        const updatedRecord = await Record.findByIdAndUpdate(recordId, record, {
          new: true,
          runValidators: true
        });
        if(updatedRecord) {
          successRecords.push({ id: recordId });
        }
        // if not then add errorMessage with id into failedRecords
        else {
          const errorMessage = 'Record does not exist to update.';
          errorHelper(errorMessage, recordId, "UPDATE", failedRecords);
        }
      }
    }
  } catch(err) {
    console.log('Something went wrong: ', err);
  }
  
  return {
    type: "UPDATE",
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
        errorHelper(error.details[0].message, record['id'], "DELETE", failedRecords);
      } else {
        // check if record exist into db to delete it
        const deletedRecord = await Record.findByIdAndDelete(record['id']);
        if(deletedRecord) {
          successRecords.push({ id: record['id'] });
        }
        // if not then add errorMessage with id into failedRecords
        else {        
          const errorMessage = 'Record does not exist to delete.';
          errorHelper(errorMessage, record['id'], "DELETE", failedRecords);
        }
      }
    }
  } catch(err) {
    console.log('Something went wrong: ', err);
  }
  
  return {
    type: "DELETE",
    failedRecords: failedRecords,
    successRecords: successRecords,
  };
}

module.exports = {
  handleGetRecords,
  handlePostRecords,
};