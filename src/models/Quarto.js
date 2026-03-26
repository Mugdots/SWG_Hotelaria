import { Model, DataTypes } from 'sequelize';

// Definindo as classes de modelo
class Quarto extends Model {
    static init(sequelize) {
        super.init({
            nome: DataTypes.STRING
        }, { sequelize, modelName: 'quarto', tableName: 'quartos'})
    }

    static associate(models) {
    }
}

export { Quarto }
