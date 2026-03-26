import { Model, DataTypes } from 'sequelize';

// Definindo as classes de modelo
class OrdemLimpeza extends Model {
    static init(sequelize) {
        super.init({
            status: {
                type:DataTypes.ENUM("Concluido", "Andamento", "Não Concluido"),
                defaultValue: "Andamento",
                validate: {
                    isIn: {
                        args: [["Concluido", "Andamento", "Não Concluido"]],
                        msg: "Status da Reserva deve ser Concluido, Andamento ou Não Concluido"
                    }
                }
            }, 
            observacao: {
                type: DataTypes.STRING,
                allowNull: false
            },
            inicio: {
                type: DataTypes.DATE,
                validate: {
                    notEmpty: { msg: "Data de Início deve ser preenchido!" },
                    isDate: {msg: "Nascimento do Funcionário deve seguir o padrão YYYY-MM-DD hh:mm:ss!"}
                }
            },
            fim: {
                type: DataTypes.DATE,
                validate: {
                    notEmpty: {msg: "Data do Fim deve ser preenchido!" },
                    isDate: {msg: "Nascimento do Funcionário deve seguir o padrão YYYY-MM-DD hh:mm:ss!"},
                    isAfterInicio(value) {
                        if (this.inicio && new Date(value) <= new Date(this.inicio)) {
                            throw new Error("Data do Fim deve ser depois do Inicio")
                        }
                    }
                }
            }
                }, { sequelize, modelName: 'ordemlimpeza', tableName: 'ordemlimpezas' })
    }

    static associate(models) {
        this.belongsTo(models.funcionario, {as: 'funcionario', foreignKey: {name: 'funcionarioId', allowNull: false, validate: {notEmpty: {msg: "Ordem Limpeza deve ter um Funcionário Associado"}}}});
        this.belongsTo(models.quarto, {as: 'quarto', foreignKey: {name: 'quartoId', allowNull: false, validate: {notEmpty: {msg: "Ordem Limpeza deve ter um Quarto Associado"}}}})
    }

}

export { OrdemLimpeza }
