const express = require('express');
const app = express();

// de esta forma utilizamos los metodos del CRUD del usuario
app.use(require('./usuario'));
app.use(require('./login'));


module.exports = app;