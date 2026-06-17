const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const drugRoutes = require('./routes/drugRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const classifierRoutes = require('./routes/classifierRoutes');
const reportRoutes = require('./routes/reportRoutes');       // ← ADD THIS

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'PharmaBot API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/prescriptions', analysisRoutes);
app.use('/api/prescriptions', classifierRoutes);
app.use('/api', reportRoutes);                              // ← ADD THIS
app.use('/api/drugs', drugRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.message === 'Only JPG, PNG, and PDF files are allowed.') {
    return res.status(400).json({ error: err.message });
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
  }
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

module.exports = app;