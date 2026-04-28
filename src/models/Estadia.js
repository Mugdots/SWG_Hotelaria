import { Model, DataTypes } from 'sequelize';

class Estadia extends Model { // Nome: Erick Fernandes

  static init(sequelize) {
    super.init({
      checkIn: { 
        type: DataTypes.DATEONLY, 
        validate: {
          isDate: { msg: "Data do check-in deve ser preenchida!" },
          is: {args: ["[0-9]{4}\-[0-9]{2}\-[0-9]{2}"], msg: "Data do check-in deve seguir o padrão yyyy-MM-dd!" }
        }
      },
      checkOut: { 
        type: DataTypes.DATEONLY, 
        validate: {
          isDate: { msg: "Data do check-out deve ser preenchida!" },
          is: {args: ["[0-9]{4}\-[0-9]{2}\-[0-9]{2}"], msg: "Data do check-out deve seguir o padrão yyyy-MM-dd!" }
        }
      },
      valorTotalEstadia: { 
        type: DataTypes.DOUBLE, 
        validate: {
          isFloat: { msg: "Valor Total da Estadia deve ser preenchido com um valor decimal!" }
        }
      }
    }, { sequelize, modelName: 'estadia', tableName: 'estadias' })
  }

  static associate(models) {
    //this.belongsTo(models.bairro, {as: 'bairro', foreignKey: {name: 'bairroId' , allowNull: false, validate: {notNull: {msg: 'Bairro do Cliente deve ser preenchido!'}}}});
    //this.hasMany(models.telefone, {as: 'telefones', onDelete: 'CASCADE', onUpdate: 'CASCADE'});

    this.belongsTo(models.reserva, {as: 'reserva', foreignKey: {name: 'reservaId', validate: {notNull: {msg: 'O número da Reserva deve ser preenchida!'}}}});
    this.belongsTo(models.funcionario, {as: 'funcionario', foreignKey: {name: 'funcionarioId', validate: {notNull: {msg: 'A estadia deve ter um funcionário associado!'}}}});
    this.belongsTo(models.quarto, {as: 'quarto', foreignKey: {name: 'quartoId', validate: {notNull: {msg: 'A estadia deve ter um quarto associado!'}}}})
  }
  
}

export { Estadia };