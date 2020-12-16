const express = require('express');
const app = express();

app.use(express.json());

// Recipe Routes ---------------------

app.use('/api/v1/recipes', require('../lib/controllers/recipes'));

// Log Routes --------------------------

app.use('/api/v1/logs', require('../lib/controllers/logs'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
