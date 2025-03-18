const { v4: uuidv4 } = require('uuid');
const { createRecordSchema, updateRecordSchema, deleteRecordSchema } = require('../utils/schema');

// imitating db records
const dbRecords = [];

const handleGetRecords = () => {
  return dbRecords;
}

const handleCreateRecords = (records) => {
  let failedRecords = [];
  let successRecords = [];

  try {
    for(let record of records) {
      const { error } = createRecordSchema.validate(record);
      // if invalid schema then add errorMessage with name into failedRecords
      if(error) {
        errorHelper(error.details[0].message, record, "CREATE", failedRecords);
      } 
      // else create new record and add into dbRecords
      else {
        const newRecord = {
          ...record,
          id: uuidv4(),
        };
        dbRecords.push(newRecord);
        successRecords.push({ id: newRecord['id'] });
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

const handleUpdateRecords = (records) => {
  let failedRecords = [];
  let successRecords = [];
  
  try {
    for(let record of records) {
      const { error } = updateRecordSchema.validate(record);
      // if invalid schema then add errorMessage with id into failedRecords
      if(error) {
        errorHelper(error.details[0].message, record, "UPDATE", failedRecords);
      } else {
        // check if record exist into db to update it
        const index = dbRecords.findIndex((rec) => rec.id === record.id);
        // if exist then update the record
        if(index !== -1) {
          dbRecords[index] = record;
          successRecords.push({ id: record['id'] });
        } 
        // if not then add errorMessage with id into failedRecords
        else {
          const errorMessage = 'Record does not exist to update.';
          errorHelper(errorMessage, record, "UPDATE", failedRecords);
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

const handleDeleteRecords = (records) => {
  let failedRecords = [];
  let successRecords = [];
  
  try {
    for(let record of records) {
      const { error } = deleteRecordSchema.validate(record);
      // if invalid schema then add errorMessage with id into failedRecords
      if(error) {
        errorHelper(error.details[0].message, record, "DELETE", failedRecords);
      } else {
        // check if record exist into db to delete it
        const index = dbRecords.findIndex((rec) => rec.id === record.id);
        // if exist then delete the record
        if(index !== -1) {
          dbRecords.splice(index, 1);
          successRecords.push({ id: record['id'] });
        } 
        // if not then add errorMessage with id into failedRecords
        else {        
          const errorMessage = 'Record does not exist to delete.';
          errorHelper(errorMessage, record, "DELETE", failedRecords);
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
  handleCreateRecords,
  handleUpdateRecords,
  handleDeleteRecords,
};