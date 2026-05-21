import Sequelize from 'sequelize';
import { databaseConfig } from "./database-config.js";

import { Hospede } from '../models/Hospede.js'
import { Reserva } from '../models/Reserva.js';
import { TipoDeQuarto } from '../models/TipoDeQuarto.js'
import { Estado } from '../models/Estado.js'
import { Funcionario } from '../models/Funcionario.js';
import { PaisIso } from '../models/PaisIso.js';
import { OrdemLimpeza } from '../models/OrdemLimpeza.js';
import { Quarto } from '../models/Quarto.js';
import { Estadia } from '../models/Estadia.js';
import * as fs from 'fs';

const sequelize = new Sequelize(databaseConfig);

Hospede.init(sequelize);
Reserva.init(sequelize);
TipoDeQuarto.init(sequelize);
Estado.init(sequelize);
Funcionario.init(sequelize);
PaisIso.init(sequelize);
Estadia.init(sequelize);
Quarto.init(sequelize);
OrdemLimpeza.init(sequelize);
// Gerente.init(sequelize);
// Telefone.init(sequelize);
// TipoDeFilme.init(sequelize);
// Diretor.init(sequelize);
// Artista.init(sequelize);
// Filme.init(sequelize);
// Participacao.init(sequelize);
// Fita.init(sequelize);
// Emprestimo.init(sequelize);
// ItemDeEmprestimo.init(sequelize);
// Multa.init(sequelize);
// Devolucao.init(sequelize);
// Reserva.init(sequelize);
// Uf.init(sequelize);
// Cidade.init(sequelize);
// Bairro.init(sequelize);
// Cliente.init(sequelize);


Hospede.associate(sequelize.models);
Reserva.associate(sequelize.models);
Estado.associate(sequelize.models);
Funcionario.associate(sequelize.models);
PaisIso.associate(sequelize.models);
Estadia.associate(sequelize.models);
Quarto.associate(sequelize.models);
OrdemLimpeza.associate(sequelize.models);
// Uf.associate(sequelize.models);
// Cidade.associate(sequelize.models);
// Bairro.associate(sequelize.models);
// Cliente.associate(sequelize.models);
// Gerente.associate(sequelize.models);
// Telefone.associate(sequelize.models);
// TipoDeFilme.associate(sequelize.models);
// Diretor.associate(sequelize.models);
// Filme.associate(sequelize.models);
// Artista.associate(sequelize.models);
// Participacao.associate(sequelize.models);
// Fita.associate(sequelize.models);
// Emprestimo.associate(sequelize.models);
// ItemDeEmprestimo.associate(sequelize.models);
// Multa.associate(sequelize.models);
// Devolucao.associate(sequelize.models);
// Reserva.associate(sequelize.models);

databaseInserts(); // comentar quando estiver em ambiente de produção (não criar tabelas e não inserir registros de teste)

function databaseInserts() {
    (async () => {
        await sequelize.sync({ force: true });

        const p1 = await PaisIso.create({ nome: "Brasil", sigla_iso2: 'BR', sigla_iso3: 'BRA', ddi_telefone: 55 });
        const p2 = await PaisIso.create({ nome: "Estados Unidos da America", sigla_iso2: 'US', sigla_iso3: 'USA', ddi_telefone: 1 });
        const p3 = await PaisIso.create({ nome: "Espanha", sigla_iso2: 'ES', sigla_iso3: 'ESP', ddi_telefone: 34 });
        const p4 = await PaisIso.create({ nome: "Ingraterra", sigla_iso2: 'GB', sigla_iso3: 'GBR', ddi_telefone: 44 });
        
        const e1 = await Estado.create({ nomeEstado: "Espírito Santo", siglaUf: "ES", regiaoGeografica: "Sudeste", paisisoId: 1 });
        const e2 = await Estado.create({ nomeEstado: "São Paulo", siglaUf: "SP", regiaoGeografica: "Sudeste", paisisoId: 1 });
        const e3 = await Estado.create({ nomeEstado: "Nova York", siglaUf: "NY", regiaoGeografica: "Norte", paisisoId: 2 });
        const e4 = await Estado.create({ nomeEstado: "Califórnia", siglaUf: "CA", regiaoGeografica: "Oeste", paisisoId: 2 });
        
        // Inserindo Tipo de Quarto no banco de dados de forma direta
        const tipoDeQuarto1 = await TipoDeQuarto.create({ 
            nome: "Standard", 
            descricao: "Quarto aconchegante com mesa de trabalho, frigobar, TV a cabo e ar-condicionado. Ideal para casais ou viagens de negócios.", 
            precoDiaria: "180",
            capacidadeMax: "2",
            tipoCama: "1 Cama de Casal (ou 2 de Solteiro sob consulta)",
            tamanho: "22"
        });
        const tipoDeQuarto2 = await TipoDeQuarto.create({ 
            nome: "Superior", 
            descricao: "Quarto com vista privilegiada, frigobar completo, mesa de trabalho e enxoval premium.", 
            precoDiaria: "250",
            capacidadeMax: "2",
            tipoCama: "1 Casal Queen",
            tamanho: "28" 
        });
        const tipoDeQuarto3 = await TipoDeQuarto.create({ 
            nome: "Master", 
            descricao: "Amplo espaço com área de estar, Smart TV 55, cafeteira e isolamento acústico reforçado.", 
            precoDiaria: "350",
            capacidadeMax: "3",
            tipoCama: "1 Casal King",
            tamanho: "35"
        });
        const tipoDeQuarto4 = await TipoDeQuarto.create({ 
            nome: "Suíte", 
            descricao: "Dois ambientes (sala e quarto), ante-sala para visitas, banheira de imersão e varanda.", 
            precoDiaria: "500",
            capacidadeMax: "3",
            tipoCama: "1 Casal King",
            tamanho: "45" 
        });
        const tipoDeQuarto5 = await TipoDeQuarto.create({ 
            nome: "Suíte Máster", 
            descricao: "Luxo total: Hidromassagem, closet, dois banheiros, adega climatizada e vista panorâmica.", 
            precoDiaria: "850",
            capacidadeMax: "4",
            tipoCama: "1 Super King",
            tamanho: "65" 
        });
        console.log('Tipos de Quarto salvos no banco de dados!\n\n');


        // Inserindo Hospede no banco de dados de forma direta
        const hospede1 = await Hospede.create({ 
            nome: "Osvaldo Cruz", 
            cpfPassaporte: "111.111.111-11",
            email: "email1@gmail.com",
            telefone: "(11) 11111-1111",
            nascimento: "2001-01-01",
            estadoId: 1
        });

        const hospede2 = await Hospede.create({ 
            nome: "Claudia Leite", 
            cpfPassaporte: "222.222.222-22",
            email: "email2@gmail.com",
            telefone: "(22) 22222-2222",
            nascimento: "2002-02-02",
            estadoId: 2
        });

        const hospede3 = await Hospede.create({ 
            nome: "Ivete Sangalo", 
            cpfPassaporte: "333CCC",
            email: "email3@gmail.com",
            telefone: "(33) 33333-3333",
            nascimento: "2003-03-03",
            estadoId: 3
        });

        const hospede4 = await Hospede.create({ 
            nome: "Paola Oliveira", 
            cpfPassaporte: "4444DD",
            email: "email4@gmail.com",
            telefone: "(44) 44444-4444",
            nascimento: "2004-04-04",
            estadoId: 2
        });

        const hospede5 = await Hospede.create({ 
            nome: "Manoel Gomes", 
            cpfPassaporte: "5555DD",
            email: "email5@gmail.com",
            telefone: "(55) 55555-5555",
            nascimento: "2005-05-05",
            estadoId: 1
        });

        const hospede6 = await Hospede.create({ 
            nome: "Getúlio Vargas", 
            cpfPassaporte: "6666DD",
            email: "email6@gmail.com",
            telefone: "(66) 66666-6666",
            nascimento: "2006-06-06",
            estadoId: 2
        });

        // Inserindo Reserva no banco de dados de forma direta
        const reserva1 = await Reserva.create({ 
            entradaAcomodacao: "2026-10-15",
            saidaAcomodacao: "2026-10-20",
            numeroPessoas: "4",
            observacao: "Reserva para viagem em família.",
            hospedeId: 1,
            tipoDeQuartoId: 5,
            status: 1
        });

        const reserva2 = await Reserva.create({ 
            entradaAcomodacao: "2026-09-15",
            saidaAcomodacao: "2026-09-25",
            numeroPessoas: "2",
            observacao: "Hóspedes solicitam cama de casal.",
            hospedeId: 2,
            tipoDeQuartoId: 2,
            status: 1
        });

        const reserva3 = await Reserva.create({ 
            entradaAcomodacao: "2026-06-02",
            saidaAcomodacao: "2026-06-30",
            numeroPessoas: "1",
            observacao: "Reserva para estadia longa.",
            hospedeId: 3,
            tipoDeQuartoId: 1,
            status: 0
        });

        const reserva4 = await Reserva.create({ 
            entradaAcomodacao: "2026-04-30",
            saidaAcomodacao: "2026-05-02",
            numeroPessoas: "3",
            observacao: "Check-in com preferência por quarto silencioso.",
            hospedeId: 4,
            tipoDeQuartoId: 3,
            status: 0
        });

        const reserva5 = await Reserva.create({ 
            entradaAcomodacao: "2027-01-25",
            saidaAcomodacao: "2027-02-02",
            numeroPessoas: "2",
            observacao: "Sem observações.",
            hospedeId: 4,
            tipoDeQuartoId: 4,
            status: 1
        });

        const reserva6 = await Reserva.create({ 
            entradaAcomodacao: "2026-07-30",
            saidaAcomodacao: "2026-08-02",
            numeroPessoas: "3",
            observacao: "Preferência por quarto com varanda.",
            hospedeId: 2,
            tipoDeQuartoId: 1,
            status: 0
        });

        const f1 = await Funcionario.create({ nome: "Funcionário Abrael", data_nascimento: "1981-01-01", cpf: "333.333.333-33", cidade:"Guarapari", bairro:"Ubatuba", rua: "Rua Dr. Brício Mesquita", telefone: "(11) 1111-1111" , login: "func1", senha: "123456", paisisoId:1 });
        const f2 = await Funcionario.create({ nome: "Funcionário Bonuto", data_nascimento: "1985-02-02", cpf: "444.444.444-44", cidade:"Guarapari", bairro:"Ubatuba", rua: "Rua José Figueiredo", telefone: "(22) 2222-2222" ,login: "func2", senha: "123456", paisisoId:3 });
        const f3 = await Funcionario.create({ nome: "Funcionário João", data_nascimento: "1981-01-01", cpf: "333.333.333-33", cidade:"Cachoeiro de Itapemirim", bairro:"Ibitiquara", rua: "Rua Dr. Brício Mesquita", telefone: "(11) 1111-1111" , login: "func1", senha: "123456", paisisoId:1 });
        const f4 = await Funcionario.create({ nome: "Funcionário José", data_nascimento: "1985-02-02", cpf: "444.444.444-44", cidade: "Marataizes",  bairro:"Abumbum", rua: "Rua José Figueiredo", telefone: "(22) 2222-2222" ,login: "func2", senha: "123456", paisisoId:4 });
        
        // const q1 = await Quarto.create({nome: "Quarto 101", andar: "1"});
        // const q2 = await Quarto.create({nome: "Quarto 201"});
        // const q3 = await Quarto.create({nome: "Quarto 302"});
        // const q4 = await Quarto.create({nome: "Quarto 405"});

        const q1 = await Quarto.create({ 
            numero: "101",
            andar: 1,
            status_quarto: "Ocupado",
            tipoDeQuartoId: tipoDeQuarto1.id
        });

        const q2 = await Quarto.create({ 
            numero: "201", 
            andar: 2,
            status_quarto: "Disponivel",
            tipoDeQuartoId: tipoDeQuarto2.id
        });

        const q3 = await Quarto.create({ 
            numero: "302", 
            andar: 3,
            status_quarto: "Disponivel",
            tipoDeQuartoId: tipoDeQuarto3.id
        });

        const q4 = await Quarto.create({ 
            numero: "405", 
            andar: 4,
            status_quarto: "Disponivel",
            tipoDeQuartoId: tipoDeQuarto4.id
        });

        const q5 = await Quarto.create({ 
            numero: "406", 
            andar: 4,
            status_quarto: "Disponivel",
            tipoDeQuartoId: tipoDeQuarto4.id
        });

        const q6 = await Quarto.create({ 
            numero: "407", 
            andar: 4,
            status_quarto: "Disponivel",
            tipoDeQuartoId: tipoDeQuarto5.id
        });

        const estadia1 = await Estadia.create({
            checkIn: "2026-10-15",
            checkOut: "2026-10-20",
            valorTotalEstadia: 5 * 850, // suite master
            quartoId: q1.id,
            funcionarioId: f1.id,
            reservaId: reserva1.id,
            hospedeId: reserva1.Hospede
        });

        const estadia2 = await Estadia.create({
            checkIn: "2026-09-15",
            checkOut: "2026-09-25",
            valorTotalEstadia: 10 * 250,
            quartoId: q2.id,
            funcionarioId: f2.id,
            reservaId: reserva2.id
        });

        const estadia3 = await Estadia.create({
            checkIn: "2026-06-02",
            checkOut: "2026-06-30",
            valorTotalEstadia: 28 * 180,
            quartoId: q3.id,
            funcionarioId: f3.id,
            reservaId: reserva3.id
        });

        const estadia4 = await Estadia.create({
            checkIn: "2026-04-30",
            checkOut: "2026-05-02",
            valorTotalEstadia: 2 * 350,
            quartoId: q4.id,
            funcionarioId: f4.id,
            reservaId: reserva4.id
        });

        /*const estadia5 = await Estadia.create({
            checkIn: "2026-12-01",
            checkOut: "2026-12-03",
            valorTotalEstadia: 2 * 180,
            quartoId: q1.id,
            funcionarioId: f2.id // sem reserva
        });*/



        const ol1 = await OrdemLimpeza.create({status: "Concluido", observacao:"SADASDASDASDASDASDASD", inicio:"2026-02-22 08:32:45", fim:"2026-02-22 10:32:25", funcionarioId: 1, quartoId: 1});
        const ol2 = await OrdemLimpeza.create({status: "Concluido", observacao:"", inicio:"2026-02-25 07:32:45", fim:"2026-02-25 9:28:25", funcionarioId: 2, quartoId: 1});
        const ol3 = await OrdemLimpeza.create({status: "Concluido", observacao:"", inicio:"2026-02-26 08:32:45", fim:"2026-02-26 19:00:00", funcionarioId: 3, quartoId: 2});
        const ol4 = await OrdemLimpeza.create({status: "Concluido", observacao:"", inicio:"2026-02-26 06:28:45", fim:"2026-02-26 10:32:25", funcionarioId: 3, quartoId: 2});
        


        // const cliente1 = await Cliente.create({ nome: "Cliente João", cpf: "111.111.111-11", rua: "Rua Dr. Brício Mesquita", numero: 1, debito: 0.0, nascimento: "1981-01-01", bairroId: 3 });
        // const cliente2 = await Cliente.create({ nome: "Cliente José", cpf: "222.222.222-22", rua: "Rua José Figueiredo", numero: 2, debito: 0.0, nascimento: "1982-02-02", bairroId: 1 });

        // const cliente1telefone1 = await Telefone.create({ numero: "(11) 1111-1111", clienteId: 1 });
        // const cliente1telefone2 = await Telefone.create({ numero: "(22) 22222-2222", clienteId: 1 });
        // const cliente2telefone1 = await Telefone.create({ numero: "(33) 33333-3333", clienteId: 2 });
        // const cliente2telefone2 = await Telefone.create({ numero: "(44) 44444-4444", clienteId: 2 });

        // const funcionario1 = await Funcionario.create({ nome: "Funcionário João", cpf: "333.333.333-33", rua: "Rua Dr. Brício Mesquita", numero: 1, login: "func1", senha: "123456", bairroId: 3 });
        // const funcionario2 = await Funcionario.create({ nome: "Funcionário José", cpf: "444.444.444-44", rua: "Rua José Figueiredo", numero: 2, login: "func2", senha: "123456", bairroId: 1 });

        // const gerente1 = await Gerente.create({ nome: "Gerente João", cpf: "555.555.555-55", rua: "Rua Dr. Brício Mesquita", numero: 1, login: "ger1", senha: "123456", bairroId: 3 });
        // const gerente2 = await Gerente.create({ nome: "Gerente José", cpf: "666.666.666-66", rua: "Rua José Figueiredo", numero: 2, login: "ger2", senha: "123456", bairroId: 1 });

        // const tipoDeFilme1 = await TipoDeFilme.create({ nome: "Promoção A", prazo: 1, preco: 5.00 });
        // const tipoDeFilme2 = await TipoDeFilme.create({ nome: "Promoção B", prazo: 2, preco: 10.00 });
        // const tipoDeFilme3 = await TipoDeFilme.create({ nome: "Promoção C", prazo: 3, preco: 15.00 });

        // const diretor1 = await Diretor.create({ nome: "Sheldon Lettich" });
        // const diretor2 = await Diretor.create({ nome: "James Cameron" });
        // const diretor3 = await Diretor.create({ nome: "Jon Landau" });
        // const diretor4 = await Diretor.create({ nome: "Quentin Tarantino" });

        // const artista1ImagemBase64 = Buffer.from(fs.readFileSync('./assets/images/artista1.png')).toString('base64');
        // const artista2ImagemBase64 = Buffer.from(fs.readFileSync('./assets/images/artista2.png')).toString('base64');
        // const artista3ImagemBase64 = Buffer.from(fs.readFileSync('./assets/images/artista3.png')).toString('base64');
        // const artista4ImagemBase64 = Buffer.from(fs.readFileSync('./assets/images/artista4.png')).toString('base64');
        // const artista5ImagemBase64 = Buffer.from(fs.readFileSync('./assets/images/artista5.png')).toString('base64');
        // const artista6ImagemBase64 = Buffer.from(fs.readFileSync('./assets/images/artista6.png')).toString('base64');
        // const artista7ImagemBase64 = Buffer.from(fs.readFileSync('./assets/images/artista7.png')).toString('base64');

        // const artista1 = await Artista.create({ nome: "Jean Claude Van Damme", imagem: artista1ImagemBase64 });
        // const artista2 = await Artista.create({ nome: "Geoffrey Lewis", imagem: artista2ImagemBase64 });
        // const artista3 = await Artista.create({ nome: "Bolo Yeung", imagem: artista3ImagemBase64 });
        // const artista4 = await Artista.create({ nome: "Leonardo DiCaprio", imagem: artista4ImagemBase64 });
        // const artista5 = await Artista.create({ nome: "Kate Winslet", imagem: artista5ImagemBase64 });
        // const artista6 = await Artista.create({ nome: "Sam Worthington", imagem: artista6ImagemBase64 });
        // const artista7 = await Artista.create({ nome: "Zoë Saldaña", imagem: artista7ImagemBase64 });

        // const filme1ImagemBase64 = Buffer.from(fs.readFileSync('./assets/images/filme1.png')).toString('base64');
        // const filme2ImagemBase64 = Buffer.from(fs.readFileSync('./assets/images/filme2.png')).toString('base64');
        // const filme3ImagemBase64 = Buffer.from(fs.readFileSync('./assets/images/filme3.png')).toString('base64');
        // const filme4ImagemBase64 = Buffer.from(fs.readFileSync('./assets/images/filme4.png')).toString('base64');

        // const filme1 = await Filme.create({ titulo: "Duplo Impacto", genero: "Ação", duracao: "02:00", imagem: filme1ImagemBase64, tipoDeFilmeId: 1 });
        // const filme2 = await Filme.create({ titulo: "Titanic", genero: "Romance", duracao: "02:30", imagem: filme2ImagemBase64, tipoDeFilmeId: 2 });
        // const filme3 = await Filme.create({ titulo: "Avatar", genero: "Ficção Científica", duracao: "03:00", imagem: filme3ImagemBase64, tipoDeFilmeId: 3 });
        // const filme4 = await Filme.create({ titulo: "Dor e Glória", genero: "Drama", duracao: "03:00", imagem: filme4ImagemBase64, tipoDeFilmeId: 3 });

        // await filme1.addDiretores(diretor1, { through: 'filmes_diretores', });
        // await filme2.addDiretores(diretor2, { through: 'filmes_diretores' });
        // await filme3.addDiretores(diretor2, { through: 'filmes_diretores' });
        // await filme4.addDiretores(diretor3, { through: 'filmes_diretores' });
        // await filme4.addDiretores(diretor4, { through: 'filmes_diretores' });

        // const participacao1 = await Participacao.create({ personagem: "Alex", artistaId: artista1.id, filmeId: filme1.id });
        // const participacao2 = await Participacao.create({ personagem: "Chad", artistaId: artista1.id, filmeId: filme1.id });
        // const participacao3 = await Participacao.create({ personagem: "Frank", artistaId: artista2.id, filmeId: filme1.id });
        // const participacao4 = await Participacao.create({ personagem: "Moon", artistaId: artista3.id, filmeId: filme1.id });
        // const participacao5 = await Participacao.create({ personagem: "Jack", artistaId: artista4.id, filmeId: filme2.id });
        // const participacao6 = await Participacao.create({ personagem: "Rose", artistaId: artista5.id, filmeId: filme2.id });
        // const participacao7 = await Participacao.create({ personagem: "Jake Sully", artistaId: artista6.id, filmeId: filme3.id });
        // const participacao8 = await Participacao.create({ personagem: "Neytiri", artistaId: artista7.id, filmeId: filme3.id });

        // const fita1 = await Fita.create({ danificada: false, disponivel: false, filmeId: 1 });
        // const fita2 = await Fita.create({ danificada: false, disponivel: true, filmeId: 2 });
        // const fita3 = await Fita.create({ danificada: false, disponivel: false, filmeId: 3 });
        // const fita4 = await Fita.create({ danificada: false, disponivel: true, filmeId: 3 });
        // const fita5 = await Fita.create({ danificada: false, disponivel: true, filmeId: 4 });

        // const emprestimo1 = await Emprestimo.create({ data: "2023-04-10", valor: 15.0, clienteId: cliente1.id });
        // const emprestimo2 = await Emprestimo.create({ data: "2023-04-13", valor: 10.0, clienteId: cliente2.id });

        // const itemDeEmprestimo1 = await ItemDeEmprestimo.create({ emprestimoId: emprestimo1.id, fitaId: fita1.id, valor: 5.00, entrega: '2023-04-11' });
        // const itemDeEmprestimo2 = await ItemDeEmprestimo.create({ emprestimoId: emprestimo1.id, fitaId: fita2.id, valor: 10.00, entrega: '2023-04-12' });
        // const itemDeEmprestimo3 = await ItemDeEmprestimo.create({ emprestimoId: emprestimo2.id, fitaId: fita3.id, valor: 10.00, entrega: '2023-04-16' });

        // const devolucao1 = await Devolucao.create({ emprestimoId: emprestimo1.id, fitaId: fita1.id, data: '2023-04-12' });
        // const devolucao2 = await Devolucao.create({ emprestimoId: emprestimo1.id, fitaId: fita2.id, data: '2023-04-12' });

        // const multa1 = await Multa.create({ emprestimoId: emprestimo1.id, fitaId: fita1.id, valor: 5.00, pago: false });

        // const reserva1 = await Reserva.create({ clienteId: cliente1.id, fitaId: fita1.id, data: '2023-04-13', status: 1 });
    })();
}

export default sequelize;