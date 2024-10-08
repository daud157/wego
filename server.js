const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const {connectToDatabase} = require('./database');
const userRoutes = require('./routes/user');



connectToDatabase();
app.use(express.json());
app.use(cors());
app.use('/auth', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
