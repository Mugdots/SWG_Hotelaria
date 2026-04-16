import { Model, DataTypes } from 'sequelize';

class TipoDeQuarto extends Model {

  static init(sequelize) {
    super.init({
      nome: { 
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Nome do Tipo de Quarto deve ser preenchido!" },
          notEmpty: { msg: "Nome do Tipo de Quarto deve ser preenchido!" },
          len: { args: [2, 50], msg: "Nome do Tipo de Quarto deve ter entre 2 e 50 letras!" }
        }
      },
      descricao: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "A Descricao do Tipo de Quarto precisa ser preenchida!" },
          notEmpty: { msg: "A Descrição do Tipo de Quarto precisar ser preenchida!" },
          len: { args: [0, 255], msg: "A Descrição do Tipo de Quarto deve ter no máximo 255 caracteres!" }
        }
      },
      precoDiaria: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
          notNull: { msg: "O Preco da Diaria do Tipo de Quarto deve ser preenchido!" },
          notEmpty: { msg: "O Preço da Diaria do Tipo de Quarto deve ser preenchido!" }
        }
      },
      capacidadeMax: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "A Capacidade Maxima do Tipo de Quarto deve ser preenchida!" },
          notEmpty: { msg: "a Capacidade Máxima do Tipo de Quarto deve ser preenchido!" }
        }
      },
      tipoCama: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "O Tipo de Cama do Tipo de Quarto deve ser preenchido!" },
          notEmpty: { msg: "O Tipo de Cama do Tipo de Quarto deve ser preenchido!" }
        }
      },
      tamanho: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
          notNull: { msg: "O Tamanho(m2) do Tipo de Quarto deve ser preenchido!" },
          notEmpty: { msg: "O Tamanho(m2) do Tipo de Quarto deve ser preenchido!" }
        }
      }
    }, { sequelize, modelName: 'tipoDeQuarto', tableName: 'tipos_de_quartos' })
  }
  
}

export { TipoDeQuarto };