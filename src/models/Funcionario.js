import { Model, DataTypes } from 'sequelize';

// Definindo as classes de modelo
class Funcionario extends Model {
    static init(sequelize) {
        super.init({
            nome: {
                type:DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "Nome do Funcionário deve ser preenchido!" },
                    len: { args: [2, 50], msg: "Nome do Funcionário deve ter entre 2 e 50 letras!" }}
            }, 
            data_nascimento: {
                type: DataTypes.DATEONLY,
                validate: {
                    isDate: { msg: "Nascimento do Funcionário deve ser preenchido!" },
                    is: {args: ["[0-9]{4}\-[0-9]{2}\-[0-9]{2}"], msg: "Nascimento do Funcionário deve seguir o padrão yyyy-MM-dd!"}
                }
            },
            cpf: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "CPF do Funcionário deve ser preenchido!" },
                    is: {args: ["[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}"], msg: "CPF do Funcionário deve seguir o padrão NNN.NNN.NNN-NN!" },
                }
            },
            bairro: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {msg: "Bairro do Funcionário deve ser preenchida"}
                }
            },
            cidade: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {msg: "Cidade do Funcionário deve ser preenchida"}
                }
            },
            rua: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {msg: "Rua do Funcionário deve ser preenchida"}
                }
            },
            telefone: {
                type: DataTypes.STRING,
                validate: {        
                    notEmpty: {msg: "Telefone do Funcionário deve ser preenchida!"},
                    is: {args: /^\([0-9]{2}\) [0-9]?[0-9]{4}-[0-9]{4}/, msg: "O Telefone do Funcionário deve seguir esse padrão (NN) NNNNN-NNNN"}
                }
            },
            login: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {msg: "Login do Funcionário deve ser preenchida!"},
                    len: {args: [2, 20], msg: "Login do Funcionário tem que ter entre 2 ou 20 caracteres"}
                }
            },
            senha: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {msg: "A Senha do Funcionário deve ser preenchida!"},
                    len: {args: [5, 20], msg: "Login do Funcionário tem que ter entre 5 ou 20 caracteres"}
                }
            }
        }, { sequelize, modelName: 'funcionario', tableName: 'funcionarios' })
    }

    static associate(models) {
      this.belongsTo(models.paisiso, {as: 'paisiso', foreignKey: {name: 'paisisoId', allowNull: false, validate: {notEmpty: {msg: "Pais do Funcionário deve ser preenchido!"}}}});

    }

}

export { Funcionario }
