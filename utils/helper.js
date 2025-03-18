const { operationTypes } = require("./constants");

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

module.exports = {
  errorHelper,
}