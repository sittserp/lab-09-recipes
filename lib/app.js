const express = require('express');
const app = express();

app.use(express.json());

// Recipe Routes ---------------------

app.post('/api/v1/recipes', require('../lib/controllers/recipes'));

app.get('/api/v1/recipes', require('../lib/controllers/recipes'));

app.get('/api/v1/recipes/:id', require('../lib/controllers/recipes'));

app.put('/api/v1/recipes/:id', require('../lib/controllers/recipes'));

app.delete('/api/v1/recipes/id', require('../lib/controllers/recipes'));

// Log Routes --------------------------

app.post('/api/v1/logs', require('../lib/controllers/logs'));

app.get('/api/v1/logs', require('../lib/controllers/logs'));

app.get('/api/v1/logs/:id', require('../lib/controllers/logs'));

app.put('/api/v1/logs/:id', require('../lib/controllers/logs'));

app.delete('/api/v1/logs/id', require('../lib/controllers/logs'));


app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
