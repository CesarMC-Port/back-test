const express = require('express');
var router = express.Router();

const {  loginUsuario , confirmacionUsuario } = require('../controllers/usuario.controller.js');

// loguear usuario 
router.post("/", loginUsuario);

// confirmacion de usuario
router.post("/ver", confirmacionUsuario)

module.exports = router