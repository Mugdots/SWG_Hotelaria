import { Model, DataTypes } from 'sequelize';

class Quarto extends Model { // Nome: Erick Fernandes

  static init(sequelize) {
    super.init({
      andar: { 
        type: DataTypes.INTEGER, 
        validate: {
          isInt: { msg: "Número do andar deve ser preenchido!" },
          min: { args: [1], msg: "Número do andar deve ter no mínimo 1 dígito!" }
        }
      },
    }, { sequelize, modelName: 'quarto', tableName: 'quartos' })
  }

  static associate(models) {
    //this.belongsTo(models.bairro, {as: 'bairro', foreignKey: {name: 'bairroId' , allowNull: false, validate: {notNull: {msg: 'Bairro do Cliente deve ser preenchido!'}}}});
    //this.hasMany(models.telefone, {as: 'telefones', onDelete: 'CASCADE', onUpdate: 'CASCADE'});

    this.belongsTo(models.Estadia, {});
    this.belongsTo(models.tipodequarto, {as: 'tipodequarto', foreignKey: 'tipodequartoId', allowNull: false, validate: {notNull: {msg: 'Tipo de Quarto deve ser preenchido!'}}});
  }
  
}

export { Quarto };