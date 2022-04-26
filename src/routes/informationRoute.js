const express = require('express'); 
var router = express.Router();

const { createUser, createEvent, getEvents, getEventsUser, deleteEvent, updateEvent, followEvento } = require('../controllers/information.controller.js');

// crear un usuario
router.post('/', createUser);
// crear un evento
router.post('/event', createEvent);
// tomar todos los productos
router.get('/getEventsUser', getEventsUser);
// tomar todos los productos
router.get('/getEvents', getEvents);
// consultar y eliminar
router.post('/delete', deleteEvent);
// actulaizar
router.post('/update', updateEvent);
//seguir evento
router.post('/follow', followEvento);


module.exports = router