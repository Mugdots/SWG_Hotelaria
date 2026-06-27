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
  host: 'dpg-d902lq6gvqtc7394bcfg-a.oregon-postgres.render.com',
  username: 'swgh_hotelaria',
  password: 'nEjH32uf5PjmosXxjphw9ySr9OiGhDtH',
  database: 'swgh_hotelaria',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  },
  dialectOptions: {
    ssl: true
  }
};