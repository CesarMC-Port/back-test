const multer = require('multer');
const fs = require('fs-extra');
const path = require('path')
const { v4: uuidv4 } = require('uuid');

//donde y como se guardaran los archivos con multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../files/uploads'),
    filename:  (req, file, cb) => {
        let filtro1 = /jpg|png|jpeg/;
        if(filtro1.test(file.mimetype) === true){
            cb(null, `${uuidv4()}.jpg`);
        }
        
    }
})

//funcion de la configuracion basica para el filtrado de datos con multer imagenes
const uploadProfile = multer({
    storage,
    limits: {fileSize: 2000000}
}).fields([{name: 'fotoPerfil'}])

module.exports = {
    uploadProfile
}