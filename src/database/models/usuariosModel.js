function modeloUsuario(sequelize,type){
    
    const Usuarios = sequelize.define('usuarios', {
        Id_usuario: {
            type: type.INTEGER(),
            autoIncrement: true,
            primaryKey: true
        },
        FirstName: {
            type: type.STRING(2),
            allowNull: false
        },
        LastName: {
            type: type.STRING,
            allowNull: false
        },
        Email: {
            type: type.STRING,
            allowNull: false
        },
        Password: {
            type: type.STRING,
            allowNull: false
        },
        UrlProfile: {
            type: type.STRING,
            allowNull: true
        }
    }, {
		initialAutoIncrement: 0
	});

    return Usuarios;
}

module.exports = {modeloUsuario}
