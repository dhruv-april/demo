const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  length: {
    type: Number,
    required: true,
    min: [0, 'Length must be a positive number'],
  },
  height: {
    type: Number,
    required: true,
    min: [0, 'Height must be a positive number'],
  },
  weight: {
    type: Number,
    required: true,
    min: [0, 'Weight must be a positive number'],
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity must be a positive number'],
    validate: {
      validator: function (v) {
        return Number.isInteger(v);  // This ensures that the value is an integer
      },
      message: 'Quantity must be an integer',
    },
  },
  stackable: {
    type: Boolean,
  },
  tiltable: {
    type: Boolean,
  },
});

const Record = mongoose.model('Record', RecordSchema);
module.exports = Record;