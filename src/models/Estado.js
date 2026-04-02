import { Model, DataTypes } from 'sequelize';

class Estado extends Model { // Nome: Erick Fernandes

    static init(sequelize) {
        super.init({
            nomeEstado: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "Nome do Estado deve ser preenchido!" },
                    len: { args: [2, 50], msg: "Nome do Estado deve ter entre 2 e 50 letras!" }
                }
            },
            siglaUf: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "A sigla não pode ser nula!" },
                    notEmpty: { msg: "A sigla não pode ser vazia!" },
                    len: { args: [2, 2], msg: "A sigla deve deve possuir dois caracteres!" }
                }
            },
            regiaoGeografica: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "Região Geográfica do Estado deve ser preenchido!" },
                    len: { args: [2, 15], msg: "Região Geográfica do Estado deve ter entre 2 e 15 letras!" }
                }
            }
        }, { sequelize, modelName: 'estado', tableName: 'estados' })
    }

    static associate(models) {
        //this.belongsTo(models.cidade, {as: 'cidade', foreignKey: {name: 'cidadeId' , allowNull: false, validate: {notNull: {msg: 'Cidade do Bairro deve ser preenchida!'}}}});

        this.belongsTo(models.pais, {as: 'pais', foreignKey: 'paisId', allowNull: false, validate: {notNull: {msg: 'Cidade do Bairro deve ser preenchida!'}}});
    }

}

export { Estado };