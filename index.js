const express = require('express');

const recordsRoute = require('./routes/record');
const connectDB = require('./db/db_connection');

const app = express();
const PORT = 3000;

// connect to MongoDB
connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/api/records', recordsRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});