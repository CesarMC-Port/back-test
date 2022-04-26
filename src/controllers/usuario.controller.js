const Sequelize = require('sequelize');
const sequelize = require('../database/database')

//iniciar base de datos
const {modeloUsuario} = require('../database/models/usuariosModel');
const Usuario = modeloUsuario(sequelize,Sequelize); 

//importacion jwt
const jwt = require("jsonwebtoken");
const config = require("../config/jwt.config.js");

//importacion incriptacion de bcrypt
const bcrypt = require('bcryptjs');

//confirmacion de token
async function confirmacionUsuario(req, res){
    //confirmacion token
    jwt.verify(req.body.Authorization.token,config.jwtSecret, async function( err , decodificado){  
        if(err === null){
            //todo correcto
            const bul = await comprobacionVerificate(JSON.parse(decodificado.payload))
            if(bul === 'algo salio mal'){
                return res.json({ 
                    message: false 
                });
            }else{
                return res.json({ 
                    message: true
                });
            }
        }else{
            //tiempo excedido
            return res.json({ 
                    message: false
            });
        }
    });
    
}

//comprobacion de credenciales usuario
async function loginUsuario(req, res){
    //estructuring de datos recibidos
    const {email, password} = req.body;

    //revision de req.body para sabaer si no escribio nada
    if (!email || !password) {
        return res.json({
            message: 'porfavor envia tu password y email'
        })
    }

    //revision y confirmacion de si el usuario existe en la base de datos
    const user = await Usuario.findOne({ where: {Email: email} });
    if (!user) {
        return res.json({ 
            message: "el usuario no existe" 
        });
    }

    //revision y confirmacion de password en la base de datos
    let bulPasswordEncriptada = await bcrypt.compare(password, user.dataValues.Password)
    if (bulPasswordEncriptada) {
        return res.status(200).json({ token: createToken(user)});
    }

    //todo correcto
    return res.json({
        message: "Uno o mas campos son incorrectos"
    });  
}

//creacion de token jwt
function createToken(user) {
    const email = user.dataValues.Email;
    let payload2 = {
      sub: email,
      iat: Date.now()
    };
    let payload = JSON.stringify(payload2)
    return jwt.sign({payload}, config.jwtSecret, {
        expiresIn: 10800
      });
}

//comprobacion datos usuario
async function comprobacionVerificate(item){
    //consulta de usuario
    let user = await Usuario.findOne({where: {Email: item.sub}}).catch(function(){
        return "No existe"
    });

    //comprobacion y respuesta dependiendo de si se encontro un usuario o no 
    if(user === "No existe" || user === null){
        return "algo salio mal"
    }else{
        return user
    }
}

//comprobacion de token atraves de la aplicacion 
async function verify(token){
    //confirmacion token
    return await jwt.verify(token , config.jwtSecret , async function( err , decodificado ){
        if(err === null){
            //todo correcto
            const bul = await comprobacionVerificate(JSON.parse(decodificado.payload))
            if(bul === 'algo salio mal'){
                return false
            }else{
                return bul.Id_usuario
            }
        }else{
            //tiempo excedido
            return false
        }
    });
}

module.exports = {
    loginUsuario,
    confirmacionUsuario,
    verify
}