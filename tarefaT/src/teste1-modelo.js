const { Sequelize, Model, DataTypes } = require("sequelize");

// Abrindo conexão
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

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
}

class Pa extends Model {
    static init(sequelize) {
        super.init({
            nome: DataTypes.STRING, 
            sigla_iso2: DataTypes.STRING,
            sifla_iso3: DataTypes.STRING,
            ddi_telefone: DataTypes.INTEGER
        }, { sequelize, modelName: 'pa', tableName: 'pas' })
    }
}


// Inicializando o modelo (CREATE TABLE)
Funcionario.init(sequelize);
Pa.init(sequelize);

//Funcionario.hasOne(Pa, {as: 'Pa'});
//Pa.hasMany(Funcionario, {as: 'Pa'});
Funcionario.belongsTo(Pa);

(async () => {
    await sequelize.sync({ force: true }); // Sincronizando automaticamente todos os modelos
    
    const p1 = await Pa.create({ 
        nome: 'Brasil', 
        sigla_iso2: 'BR', 
        sifla_iso3: 'BRA', 
        ddi_telefone: 55
    });
        
    console.log("Pa adicionado!\n\n");

    // Instanciando um objeto
    const f1 = await Funcionario.create({  
        nome: 'Vinicios',
        data_nascimento: '2002-05-23',
        cpf: '981.054.057-23', 
        rua:'Avenida 135', 
        telefone: '28 9999-4563',   
        login:'vii123',
        senha: '123321'});
    await f1.setPa(p1);
    console.log(`${f1.nome} foi salvo no banco de dados!\n\n`);


    const f2 = await Funcionario.create({
        nome:'Rafael',
        data_nascimento: '2004-02-13',
        cpf:'235.584.346-23',
        rua:'Rua Saláfrario da Silva',
        telefone:'29 2351-3783',
        login:'rafael_louco_extreme',
        senha:'123456'});
    await f2.setPa(p1);
    console.log(`${f2.nome} foi salvo no banco de dados!\n\n`);




//    const cliente1 = Cliente.build({ nome: "Alberto" });
//    console.log(cliente1 instanceof Cliente); // true
//    console.log(cliente1.nome); // "Alberto"

    // Inserindo um objeto no banco de dados (primeira maneira)
//    await cliente1.save();
//    console.log('Alberto foi salvo no banco de dados!\n\n');

    // Inserindo um objeto no banco de dados (segunda maneira)
//    const cliente2 = await Cliente.create({ nome: "Bernardo" });
//    const cliente3 = await Cliente.create({ nome: "Carlos" });
//    const cliente4 = await Cliente.create({ nome: "Daniel" });
//    console.log('Clientes salvos no banco de dados!\n\n');

    // Atualizando um objeto
//    cliente1.nome = "Alberto dos Santos";
//    await cliente1.save();
//    console.log('Cliente Alberto atualizado no banco de dados!\n\n');

    // Deletando um objeto
//    await cliente2.destroy();
//    console.log('Cliente Bernardo (id:2) removido do banco de dados!\n\n');

    // findAll: listando todos
//    const clientes1 = await Cliente.findAll();
//    console.log(clientes1.every(cliente => cliente instanceof Cliente)); // true
//    console.log("findAll(): \n", JSON.stringify(clientes1, null, 2), "\n\n");

    // findAll: listando todos (especificando atributos Para SELECT)
//    const clientes2 = await Cliente.findAll({ attributes: ['nome'] });
//    console.log("findAll({ attributes: ['nome'] }): \n", JSON.stringify(clientes2, null, 2), "\n\n");

    // findAll: listando todos (WHERE)
//    const clientes3 = await Cliente.findAll({ where: { id: 3 } });
//    console.log("findAll({ where: {id: 3} }): \n", JSON.stringify(clientes3, null, 2), "\n\n");

    // findByPk: listando por chave primária
    //const clientes4 = await Cliente.findByPk(3);
  //  console.log("findByPk(3): \n", JSON.stringify(clientes4, null, 2), "\n\n");

    // findOne
    //const clientes5 = await Cliente.findOne({ where: { id: 3 } });
    //console.log("findOne(3): \n", JSON.stringify(clientes5, null, 2), "\n\n");

})();



