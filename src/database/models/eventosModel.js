function modeloEvento(sequelize,type){
    
    const Eventos = sequelize.define('eventos', {
        Id_evento: {
            type: type.INTEGER(),
            autoIncrement: true,
            primaryKey: true
        },
        Id_user_organizer: {
            type: type.INTEGER(),
            allowNull: false
        },
        Title: {
            type: type.STRING(2),
            allowNull: false
        },
        Description: {
            type: type.STRING,
            allowNull: false
        },
        StartDate: {
            type: type.STRING,
            allowNull: false
        },
        EndDate: {
            type: type.STRING,
            allowNull: false
        }
    }, {
		initialAutoIncrement: 0
	});

    return Eventos;
}

module.exports = {modeloEvento}