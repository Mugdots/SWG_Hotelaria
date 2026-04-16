import { Model, DataTypes } from 'sequelize';

class Hospede extends Model {

  static init(sequelize) {
    super.init({
      nome: { 
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
          notNull: { msg: "Nome do Hospede deve ser preenchido!" },
          notEmpty: { msg: "Nome do Hospede deve ser preenchido!" },
          len: { args: [2, 50], msg: "Nome do Hospede deve ter entre 2 e 50 letras!" }
        }
      },
      cpfPassaporte: { 
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
          notNull: { msg: "CPF ou Passaporte do Hóspede deve ser preenchido!" },
          notEmpty: { msg: "CPF ou Passaporte do Hóspede deve ser preenchido!" },
          isValidDocument(value) {
            // Padrão Brasileiro de CPF: NNN.NNN.NNN-NN
            const cpf = /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/;
            
            // Padrão Internacional de Passaporte: 
            // Aceita de 6 a 15 caracteres (Letras e Números), sem símbolos.
            const passaporte = /^[A-Z0-9]{6,15}$/i; 

            if (!cpf.test(value) && !passaporte.test(value)) {
              throw new Error("Documento inválido! Informe um CPF (NNN.NNN.NNN-NN) ou um Passaporte (apenas letras e números).");
            }
          }
        }
      },
      email: { 
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
          notNull: { msg: "Email do Hospede deve ser preenchido!" },
          notEmpty: { msg: "Email do Hospede deve ser preenchido!" },
          isEmail: { msg: "Email do Hospede deve ser um email válido!" }
        }
      },
      telefone: { 
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
          notNull: { msg: "Telefone do Hospede deve ser preenchido!" },
          notEmpty: { msg: "Telefone do Hospede deve ser preenchido!" },
          is: {args: ["^\\([0-9]{2}\\) [0-9]{5}-[0-9]{4}$"], msg: "Telefone do Hospede deve seguir o padrão (XX) XXXXX-XXXX!" }
        }
      },
      nascimento: { 
        type: DataTypes.DATEONLY, 
        allowNull: false,
        validate: {
          notNull: { msg: "Nascimento do Hospede deve ser preenchido!" },
          notEmpty: { msg: "Nascimento do Hospede deve ser preenchido!" },
          isDate: { msg: "Nascimento do Hospede deve ser preenchido!" },
          is: {args: ["[0-9]{4}\-[0-9]{2}\-[0-9]{2}"], msg: "Nascimento do Hospede deve seguir o padrão yyyy-MM-dd!" }
        }
      }
    }, { sequelize, modelName: 'hospede', tableName: 'hospedes' })
  }

  static associate(models) {
        this.belongsTo(models.estado, {as: 'estado', foreignKey: {name: 'estadoId', validate: {notNull: {msg: 'O Estado do Hospede deve ser preenchido'}}}})
  }
  
}

export { Hospede };