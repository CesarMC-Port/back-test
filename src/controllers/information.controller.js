//importacion sequelize
const Sequelize = require('sequelize');
const sequelize = require('../database/database')

//datos cloudinary
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLO_NAME,
    api_key: process.env.CLO_KEY,
    api_secret: process.env.CLO_SECRET
})

//importacion de base de datos
const {modeloEvento} = require('../database/models/eventosModel');
const {modeloUsuario} = require('../database/models/usuariosModel');
const {modeloRelacionSeguir} = require('../database/models/relacionSeguirModel');

const Evento = modeloEvento(sequelize,Sequelize); 
const Usuario = modeloUsuario(sequelize,Sequelize);  
const RelacionSeguir = modeloRelacionSeguir(sequelize,Sequelize);  

//importacion de verificacion de usuarios
const { verify } = require("./usuario.controller") 

//importacion de carga de imagenes
const { uploadProfile } = require('../config/multer.config')

//importacion incriptacion de bcrypt
const bcrypt = require('bcryptjs');

//importacion libreria de horas
const moment = require('moment')

//---------------------------------------------------------------------------------------------------------------------/
//-------------------------------------------- Funciones usuario ------------------------------------------------------/
//---------------------------------------------------------------------------------------------------------------------/

async function createUser(req, res){
    //todos los datos necesarios para la creacion de un usuario
    let {nombre, apellido, email, password} = req.body

    //encriptacion de password
    let passwordBD = await bcrypt.hash(password, 8)

    //funcion creadora de nuevos usuarios
    let newUser = await Usuario.create({
        FirstName: nombre,
        LastName: apellido,
        Email: email,
        Password: passwordBD,
    }, {
        fields: [`FirstName`, `LastName`,  `Email`, `Password`]
    }).catch(function(error) {
        //respuesta de error al crear usuario en base de datos
        return res.json({
            message: 'Hubo un fallo en un dato' + error,
        })
    });

    //confirmacion de creacion de usuario
    if(newUser){
        return res.json({
            message: 'Usuario creado',
        })
    }
}

async function upPictore(req, res){
    //carga de archivo
    uploadProfile(req, res, async function(err){
        if (err) {
            err.message = 'The file is so heavy for my service';
            return res.send(err);
        }
        if (err instanceof multer.MulterError){
            return res.send(err);
        }

        //reques de archivo
        let archivos = Object.entries(req.files)

        //filtro 
        let filtro = /jpeg|jpg|png|gif/;
        console.log(archivos)

        //si el formato del archivo cumple los requisitos
        if(filtro.test(archivos[0][1][0]["mimetype"])){

            // cargamos el archivo a clodinary
            let respuesta = await cloudinary.v2.uploader.upload( `${path.join(__dirname, '../files/uploads')}/${archivos[i][1][0]["filename"]}`,async function(err,resp){
                if(err !== undefined){
                    return res.json({ 
                        message: "Algo salio mal" 
                    });
                }
                console.log(resp)
                //let datos = Object.entries(resp)
                //arreglo.push(datos[1][1])
                //arreglo.push(datos[15][1])

                //encriptacion de password
            });

            //eliminamos el archivo de local
            await fs.unlink(`${path.join(__dirname, '../files/uploads')}/${archivos[0][1][0]["filename"]}`)

            //revisamos respuesta de cludinary 
            if(respuesta !== undefined){
                if(respuesta.message !== undefined){
                    res.send('Algo salio mal'); 
                }else{
                    res.send('todo bien');   
                }
            }        
        }
    })
}

//---------------------------------------------------------------------------------------------------------------------/
//-------------------------------------------- Funciones event ------------------------------------------------------/
//---------------------------------------------------------------------------------------------------------------------/

async function createEvent(req, res){
    try{
        //todos lo datos necesarios para la creacion de un evento
        const {token ,titulo, descripcion, fechaInicial, fechaFinal} = req.body

        //verificacion de usuario
        const userId = await verify(token)
        if(userId === false) {
            res.json({
                message: "Error en validación"
            });
            return;
        }

        //funcion creadora de nuevos eventos
        let newEvent = await Evento.create({
            Id_user_organizer: userId,
            Title: titulo,
            Description: descripcion,
            StartDate: fechaInicial,
            EndDate: fechaFinal,
        }, {
            fields: [`Id_user_organizer`, `Title`,  `Description`, `StartDate`, `EndDate`]
        }).catch(function(error) {
            //respuesta de error al crear evento en base de datos
            return res.json({
                message: 'Hubo un fallo en un dato' + error,
            })
        });

        //confirmacion de creacion de evento
        if(newEvent){
            return res.json({
                message: 'Evento creado',
            })
        }
    }catch(e){
        res.json({
            message: 'error'
        })
    }
}

async function getEvents(req, res){
    try{
        //request
        let {token} = req.query

        //segmento de verificacion de usuario a traves de token
        const userId = await verify(token)
        if(userId === false) {
            res.json({
                message: "Error en validación"
            });
            return;
        }

        //buscar eventos
        const events = await Evento.findAll();
        const relacion = await RelacionSeguir.findAll();

        res.json({
            data: events,
            follow: relacion,
            id: userId
        })
    }catch(e){
        res.json({
            message: 'error'
        })
    }
}

async function getEventsUser(req, res){
    try{
        //request
        let {token} = req.query

        //segmento de verificacion de usuario a traves de token
        const userId = await verify(token)
        if(userId === false) {
            res.json({
                message: "Error en validación"
            });
            return;
        }

        //buscar eventos
        const events = await Evento.findAll({where:{Id_user_organizer: userId},order: ['Id_evento']}) ;
        const relacion = await RelacionSeguir.findAll({where:{Id_usuario: userId},order: ['Id_relacion_seguir']});

        res.json({
            data: events,
            follow: relacion,
            id: userId
        })
    }catch(e){
        res.json({
            message: 'error'
        })
    }
}

async function deleteEvent(req, res){
    try{
        //todos lo datos necesarios para eliminar un evento
        let {idEvento, token} = req.body

        //segmento de verificacion de usuario a traves de token
        const userId = await verify(token)
        if(userId === false) {
            res.json({
                message: "Error en validación"
            });
            return;
        }

        //funcion eliminadora de eventos
        const eventoEliminado = await Evento.findOne({
            where: {
                Id_evento: idEvento,
                Id_user_organizer: userId
            }
        });

        eventoEliminado.destroy();

        //Evento eliminada
        res.json({
            message: 'Evento eliminada',
        })
    }catch(e){
        console.log(e)
        res.json({
            message: 'error'
        })
    }
}

async function updateEvent(req, res){
    try{
        //todos lo datos necesarios para editar un evento
        let {idEvento, titulo, descripcion, fechaInicial, fechaFinal, token} = req.body

        //segmento de verificacion de usuario a traves de token
        const userId = await verify(token)
        if(userId === false) {
            res.json({
                message: "Error en validación"
            });
            return;
        }

        //funcion para actualizar los datos de un evento
        await Evento.update({
            Title: titulo,
            Description: descripcion,
            StartDate: fechaInicial,
            EndDate: fechaFinal
        },
        {
            where: {
                Id_evento: idEvento,
                Id_user_organizer: userId
            }
        })
        
        //confirmacion de edicion de los eventos
        return res.json({
            message: 'Evento editado',
        })  

    }catch(e){
        console.log(e)
        res.json({
            message: 'error'
        })
    }
}

//---------------------------------------------------------------------------------------------------------------------/
//-------------------------------------------- Funciones relacionSeguir ------------------------------------------------------/
//---------------------------------------------------------------------------------------------------------------------/

async function followEvento(req, res){
    try{
        //todos lo datos necesarios para seguir un evento
        let {idEvento, token} = req.body

        //segmento de verificacion de usuario y gestion a traves de token
        const userId = await verify(token)
        if(userId === false) {
            res.json({
                message: "Error en validación"
            });
            return;
        }

        //revisar que el evento no haya ya pasado
        let Time_renovacion_perfil = await Evento.findOne({where:{Id_evento: idEvento}})
        let timePerfil = moment().format('YYYY-MM-DD hh:mm a')
        console.log(moment(Time_renovacion_perfil.dataValues.EndDate,'YYYY-MM-DD hh:mm a'))
        console.log(moment(timePerfil,'YYYY-MM-DD hh:mm a'))
        console.log(moment(Time_renovacion_perfil.dataValues.EndDate,'YYYY-MM-DD hh:mm a').isAfter(moment(timePerfil,'YYYY-MM-DD hh:mm a'), 'minute'))
        if(moment(Time_renovacion_perfil.dataValues.EndDate,'YYYY-MM-DD hh:mm a').isAfter(moment(timePerfil,'YYYY-MM-DD hh:mm a'), 'minute') === false){
            res.json({
                message: "El evento ya acabo"
            });
            return;
        }

        //revisar que no exista ninguno
        let relacionSeguir = await RelacionSeguir.findAll({where:{Id_evento: idEvento, Id_usuario: userId}})
        if(relacionSeguir[0] !== undefined){
            res.json({
                message: "Ya seguiste este usuario"
            });
            return;
        }

        //consulta de nombre
        let nombre = await Usuario.findOne({where:{Id_usuario: userId }})

        //funcion creadora seguirEvento
        let newRelacion = await RelacionSeguir.create({
            Id_evento: idEvento,
            Id_usuario: userId,
            Nombre: nombre.dataValues.FirstName
        }, {
            fields: [`Id_evento`, `Id_usuario`, `Nombre`]
        }).catch(function(error) {
            //respuesta de error al crear evento en base de datos
            return res.json({
                message: 'Hubo un fallo en un dato' + error,
            })
        });
        
        //confirmacion de edicion de los eventos
        if(newRelacion){
            return res.json({
                message: 'Seguir agregado',
            })
        } 

    }catch(e){
        console.log(e)
        res.json({
            message: 'error'
        })
    }
}

module.exports = {
    createUser,
    updateEvent,
    deleteEvent,
    createEvent,
    getEvents,
    getEventsUser,
    followEvento,
    upPictore
}