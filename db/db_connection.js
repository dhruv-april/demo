const { default: mongoose } = require("mongoose");

// can be setup to take from env file
const DB_URL = 'mongodb://localhost:27017';
const DB_NAME = 'demo';

const connectDB = async () => {
  try {
    await mongoose.connect(`${DB_URL}/${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;