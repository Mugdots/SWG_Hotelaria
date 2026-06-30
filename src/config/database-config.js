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
}; */


 // Configuração do banco de dados no ambiente de desenvolvimento
export const databaseConfig = {
  dialect: 'postgres',
  host: 'dpg-d91hc83eo5us7394n5m0-a.oregon-postgres.render.com',
  username: 'swg_hotelaria_backend_user',
  password: '6s0kJdN4eovDoPsHUi4KxQJ7BlIYFG56',
  database: 'swg_hotelaria_backend',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  },
  dialectOptions: {
    ssl: true
  }
};