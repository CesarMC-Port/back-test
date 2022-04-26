'use strict'
//importacion dependencias
const express = require('express')
const morgan = require('morgan');
const cors = require('cors');

//importacion de rutas
const eventsRoute = require('./routes/informationRoute.js');
const usuarioRoute = require('./routes/usuarioRoute.js');

const app = express();

// Configuración de la App
app.disable('x-powered-by');

//midlewares
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/information' , eventsRoute);
app.use('/login' , usuarioRoute);

//eportacion
module.exports = app