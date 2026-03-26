const { Sequelize, Model, DataTypes } = require("sequelize");

class Pais extends Model {
    static init(sequelize) {
        super.init({
            nome: DataTypes.STRING, 
            sigla_iso2: DataTypes.STRING,
            sifla_iso3: DataTypes.STRING,
            ddi_telefone: DataTypes.INTEGER
        }, { sequelize, modelName: 'pais', tableName: 'paises' })
    }

    static associate(models) {
    }
}

export { UF };


