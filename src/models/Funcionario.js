const { Sequelize, Model, DataTypes } = require("sequelize");

// Definindo as classes de modelo
class Funcionario extends Model {
    static init(sequelize) {
        super.init({
            nome: DataTypes.STRING, 
            data_nascimento: DataTypes.DATE,
            cpf: DataTypes.STRING,
            rua: DataTypes.STRING,
            telefone: DataTypes.STRING,
            login: DataTypes.STRING,
            senha: DataTypes.STRING
        }, { sequelize, modelName: 'funcionario', tableName: 'funcionarios' })
    }

    static associate(models) {
        this.belongsTo(models.Pais);
    }

}

export { Funcionario }
