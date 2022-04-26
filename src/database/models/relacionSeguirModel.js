function modeloRelacionSeguir(sequelize,type){
    
    const relacionSeguir = sequelize.define('relacion-seguir', {
        Id_relacion_seguir: {
            type: type.INTEGER(),
            autoIncrement: true,
            primaryKey: true
        },
        Id_evento: {
            type: type.INTEGER(),
            allowNull: false
        },
        Id_usuario: {
            type: type.INTEGER(),
            allowNull: false
        },
        Nombre: {
            type: type.STRING,
            allowNull: false
        }
    }, {
		initialAutoIncrement: 0
	});

    return relacionSeguir;
}

module.exports = {modeloRelacionSeguir}