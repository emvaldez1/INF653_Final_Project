require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');

const connectDB     = require('./config/dbConn');
const statesRouter  = require('./routes/statesRouter');

const app  = express();
const PORT = process.env.PORT || 3500;

// Connect to MongoDB once at startup
connectDB();

app.use(cors());
app.use(express.json());

// Root endpoint – return a full HTML document
app.get('/', (req, res) => {
  res.type('html').send(`
    <!DOCTYPE html>
    <html>
      <hd>
        <meta charset="utf-8">
        <title>States API</title>
      </head>
      <body>
        <h1>Welcome to the States API</h1>
      </body>
    </html>
  `);
});

// Serve static files
app.use('/', express.static(path.join(__dirname, 'public')));

// States API routes
app.use('/states', statesRouter);

// 404 Not Found handler – return HTML when client wants HTML
app.all('*', (req, res) => {
  if (req.accepts('html')) {
    res.status(404).type('html').send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>404 Not Found</title>
        </head>
        <body>
          <h1>404 Not Found</h1>
        </body>
      </html>
    `);
  } else if (req.accepts('json')) {
    res.status(404).json({ message: '404 Not Found' });
  } else {
    res.status(404).type('txt').send('404 Not Found');
  }
});

// Global error handler (500)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server only when MongoDB connection is open
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});
