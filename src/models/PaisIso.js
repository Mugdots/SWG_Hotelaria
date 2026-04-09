import { Model, DataTypes } from 'sequelize';
class PaisIso extends Model {
    static init(sequelize) {
        super.init({
            nome: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "Nome do País deve ser Preenchido!"},
                    len: {args: [2, 30], msg: "Nome do País deve ter entre 2 e 30 letras!"}
                }
            }, 
            sigla_iso2: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "A Sigla Iso 2 não pode ser vazia!"},
                    len: {args: [2, 2], msg: "A sliga do Iso 2 tem que ser 2 caracteres!"}
                }
            },
            sigla_iso3: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "Sigla do Iso 3 não pode ser vazio"},
                    len: {args: [3, 3], msg: "Número do Iso 3 tem que ser 3 caracteres!"}
                }
            },
            ddi_telefone: {
                type: DataTypes.INTEGER,
                validate: {
                    notEmpty: { msg: "Tem que ser preenchido com o DDI"},
                    isInt: { msg: "DDI tem que ser um numero inteiro!"}
                }
            }
        }, { sequelize, modelName: 'paisiso', tableName: 'paisisos' })
    }

    static associate(models) {
    }
}

export { PaisIso };


