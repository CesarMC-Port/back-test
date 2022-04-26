const app = require('./app.js');
const sequelize = require('./database/database.js');
const Usuarios = require('./database/models/usuariosModel.js');

async function main(){
    const PORT = process.env.PORT || 4000;
    await app.listen(PORT);
    sequelize.sync()
    console.log('Server on port 4000');
};

main();