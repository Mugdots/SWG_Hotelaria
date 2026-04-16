import { Model, DataTypes } from 'sequelize';

class Reserva extends Model {

  static init(sequelize) {
    super.init({
      entradaAcomodacao: { 
        type: DataTypes.DATEONLY, 
        allowNull: false,
        validate: {
          notNull: { msg: "Data de entrada da Reserva deve ser preenchida!" },
          notEmpty: { msg: "Data de entrada da Reserva deve ser preenchida!" },
          isDate: { msg: "Data de entrada da Reserva deve ser preenchida!" },
          is: {args: ["[0-9]{4}\-[0-9]{2}\-[0-9]{2}"], msg: "Data de entrada da Reserva deve seguir o padrão yyyy-MM-dd!" }
        }
      },
      saidaAcomodacao: { 
        type: DataTypes.DATEONLY, 
        allowNull: false,
        validate: {
          notNull: { msg: "Data de saída da Reserva deve ser preenchida!" },
          notEmpty: { msg: "Data de saída da Reserva deve ser preenchida!" },
          isDate: { msg: "Data de saída da Reserva deve ser preenchida!" },
          is: {args: ["[0-9]{4}\-[0-9]{2}\-[0-9]{2}"], msg: "Data de saída da Reserva deve seguir o padrão yyyy-MM-dd!" }
        }
      },
      numeroPessoas: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        validate: {
          notNull: { msg: "O Número de pessoas da Reserva deve ser preenchido!" },
          notEmpty: { msg: "O Número de pessoas da Reserva deve ser preenchido!" },
          isInt: { msg: "Número de pessoas da Reserva deve ser um número inteiro!" },
          min: { args: [1], msg: "Número de pessoas da Reserva deve ser no mínimo 1!" }
        }
      },
      observacao: { 
        type: DataTypes.STRING, 
        validate: {
          len: { args: [0, 255], msg: "Observação da Reserva deve ter no máximo 255 caracteres!" }
        }
      }
    }, { sequelize, modelName: 'reserva', tableName: 'reservas' })
  }

  static associate(models) {
    this.belongsTo(models.hospede, {as: 'hospede', foreignKey: {name: 'hospedeId', validate: {notNull: {msg: 'O Hospede da Reserva deve ser preenchido'}}}})
    this.belongsTo(models.tipoDeQuarto, {as: 'tipoDeQuarto', foreignKey: {name: 'tipoDeQuartoId', validate: {notNull: {msg: 'O tipoDeQuarto da Reserva deve ser preenchido'}}}})
  }
}

export { Reserva };