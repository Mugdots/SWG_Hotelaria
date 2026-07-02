/*
//Configuração do Banco de Dados no Ambiente de Teste
export const databaseConfig = {
    dialect: 'sqlite',
    storage: 'database.sqlite',
    define: {
        timestamps: true,
        freezeTableName: true,
        underscored: true
    }   
};
*/

// Configuração do banco de dados no ambiente de desenvolvimento
export const databaseConfig = {
  dialect: 'postgres',
  host: 'dpg-d938he28qa3s73djsr90-a.oregon-postgres.render.com',
  username: 'swg_hotelaria_user',
  password: 'Br8wPfCIEMMFAuXTNxKdv1tlF6zdsByw',
  database: 'swg_hotelaria_npw5',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  },
  dialectOptions: {
    ssl: true
  }
};