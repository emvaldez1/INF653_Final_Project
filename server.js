require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');

const connectDB     = require('./config/dbConn');
const statesRouter  = require('./routes/statesRouter');

const app  = express();
const PORT = process.env.PORT || 3500;

// connect once at startup
connectDB();

app.use(cors());
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/states', statesRouter);

// 404 handler
app.all('*', (req, res) => {
  if (req.accepts('html')) {
    res.status(404).send('<h1>404 Not Found</h1>');
  } else if (req.accepts('json')) {
    res.status(404).json({ error: '404 Not Found' });
  } else {
    res.status(404).type('txt').send('404 Not Found');
  }
});

// GLOBAL 500 handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// only start listening once Mongo is open
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});
