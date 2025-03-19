const { operationTypes } = require("./constants");

// custom isEqual: check if two objects are equal except id field
// create record will not have id field
// but delete record will have id field
const isEqual = (createObj, deleteObj) => {
  const keys1 = Object.keys(createObj);
  const keys2 = Object.keys(deleteObj);
  
  if(keys1.length + 1 !== keys2.length) {
    return false;
  }

  for(let key of keys1) {
    if(key !== 'id' && createObj[key] !== deleteObj[key]) {
      return false;
    }
  }

  return true;
}

const errorHelper = (errorMessage, field, type, failedRecords) => {
  let result;

  // if it is CREATE operation then we can add name and errorMessage, since we don't have id yet
  if(type === operationTypes.CREATE) {
    result = {
      name: field,
      errorMessage: errorMessage,
    };
  } 
  // otherwise we can add the id and errorMessage
  else {
    result = {
      id: field,
      errorMessage: errorMessage,
    };
  }

  failedRecords.push(result);
  console.log(`${type}: ${errorMessage}`);
}

const filterRecordsHelper = (object = {}) => {
  // check for each 'CREATE' record present in 'DELETE' records for equality
  // if present it is duplicate record created again after deleting
  // so we can remove from 'CREATE' and 'DELETE' records
  // since no need to either create or delete that record
  let createdRecords = object[operationTypes.CREATE] ? object[operationTypes.CREATE] : [];
  let deletedRecords = object[operationTypes.DELETE] ? object[operationTypes.DELETE] : [];

  let createdRecordIndices = [];
  let deletedRecordIndices = [];

  if((createdRecords && createdRecords.length > 0) && (deletedRecords && deletedRecords.length > 0)) {
    for(let i=0; i<createdRecords.length; i++) {
      for(let j=0; j<deletedRecords.length; j++) {
        if(isEqual(createdRecords[i], deletedRecords[j])) {
          createdRecordIndices.push(i);
          deletedRecordIndices.push(j);
        }
      }
    }
  }

  // check for each 'UPDATE' record present in 'DELETE' records by id
  // if present then that updated record is going to be deleted
  // so we can remove from 'UPDATE' records and can save one DB transaction
  let updatedRecords = object[operationTypes.UPDATE] ? object[operationTypes.UPDATE] : [];
  let updatedRecordIndices = [];

  if((updatedRecords && updatedRecords.length > 0) && (deletedRecords && deletedRecords.length > 0)) {
    for(let i=0; i<updatedRecords.length; i++) {
      for(let j=0; j<deletedRecords.length; j++) {
        if(updatedRecords[i]['id'] === deletedRecords[j]['id']) {
          updatedRecordIndices.push(i);
        }
      }
    }
  }

  // sort in descending order so we can delete from back using index
  createdRecordIndices.sort((a, b) => b - a);
  updatedRecordIndices.sort((a, b) => b - a);
  deletedRecordIndices.sort((a, b) => b - a);

  // now we can remove extra records that don't have to be performed on
  // remove created records if any
  for(let index of createdRecordIndices) {
    createdRecords.splice(index, 1);
  }

  // remove updated records if any
  for(let index of updatedRecordIndices) {
    updatedRecords.splice(index, 1);
  }

  // remove deleted records if any
  for(let index of deletedRecordIndices) {
    deletedRecords.splice(index, 1);
  }

  // remove other fields from deletedRecords since we only need id from now onwards
  for(let deletedRecord of deletedRecords) {
    for(let key of Object.keys(deletedRecord)) {
      if(key !== 'id') {
        delete deletedRecord[key];
      }
    }
  }

  object[operationTypes.CREATE] = createdRecords;
  object[operationTypes.UPDATE] = updatedRecords;
  object[operationTypes.DELETE] = deletedRecords;

  return object;
}

module.exports = {
  errorHelper,
  filterRecordsHelper,
}