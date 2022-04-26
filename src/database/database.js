const Sequelize = require('sequelize');

//importacion modelos
const {modeloEvento} = require('./models/eventosModel');
const {modeloUsuario} = require('./models/usuariosModel');
const {modeloRelacionSeguir} = require('./models/relacionSeguirModel');

//arreglo con configuracion de base de datos
let arregloSwift = {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    omitNull: true,
    pool:{
        max: 5,
        min: 0,
        require: 30000,
        idle: 10000
    },
    logging: false,
}

//inicializacion de base de datos
const sequelize = new Sequelize('react', 'react', 'react', arregloSwift)

//Inicializando tablas
const Evento = modeloEvento(sequelize,Sequelize); 
const Usuario = modeloUsuario(sequelize,Sequelize);  
const RelacionSeguir = modeloRelacionSeguir(sequelize,Sequelize);  

//Relacion de tabla usuarios - eventos
Usuario.hasMany(Evento, {foreignKey: 'Id_usuario'});
Evento.belongsTo(Usuario);

//Relacion de tabla eventos - relacionseguir 
Evento.hasMany(RelacionSeguir, {foreignKey: 'Id_evento'});
RelacionSeguir.belongsTo(Evento);

module.exports = sequelize