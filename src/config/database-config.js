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
  host: 'dpg-d8c6k41kh4rs738kak00-a.oregon-postgres.render.com',
  username: 'swg_hotelaria',
  password: 'szvwgyM1GDTiNneNN4p8aeSexW8sOpRj',
  database: 'swg_hotelaria',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  },
  dialectOptions: {
    ssl: true
  }
};