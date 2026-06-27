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

Hospede.associate(sequelize.models);
Reserva.associate(sequelize.models);
Estado.associate(sequelize.models);
Funcionario.associate(sequelize.models);
PaisIso.associate(sequelize.models);
Estadia.associate(sequelize.models);
Quarto.associate(sequelize.models);
OrdemLimpeza.associate(sequelize.models);

databaseInserts(); // comentar quando estiver em ambiente de produção (não criar tabelas e não inserir registros de teste)

function databaseInserts() {
    (async () => {

        // await sequelize.sync();

        const p1 = await PaisIso.create({ nome: "Brasil", sigla_iso2: 'BR', sigla_iso3: 'BRA', ddi_telefone: 55 });
        const p2 = await PaisIso.create({ nome: "Estados Unidos da America", sigla_iso2: 'US', sigla_iso3: 'USA', ddi_telefone: 1 });
        const p3 = await PaisIso.create({ nome: "Espanha", sigla_iso2: 'ES', sigla_iso3: 'ESP', ddi_telefone: 34 });
        const p4 = await PaisIso.create({ nome: "Ingraterra", sigla_iso2: 'GB', sigla_iso3: 'GBR', ddi_telefone: 44 });

        const e1 = await Estado.create({ nomeEstado: "Espírito Santo", siglaUf: "ES", regiaoGeografica: "Sudeste", paisisoId: 1 });
        const e2 = await Estado.create({ nomeEstado: "São Paulo", siglaUf: "SP", regiaoGeografica: "Sudeste", paisisoId: 1 });
        const e3 = await Estado.create({ nomeEstado: "Nova York", siglaUf: "NY", regiaoGeografica: "Norte", paisisoId: 2 });
        const e4 = await Estado.create({ nomeEstado: "Califórnia", siglaUf: "CA", regiaoGeografica: "Oeste", paisisoId: 2 });

        //Inserindo Tipo de Quarto no banco de dados de forma direta
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


        //Inserindo Hospede no banco de dados de forma direta
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

        //Inserindo Reserva no banco de dados de forma direta
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

        const f1 = await Funcionario.create({ nome: "Funcionário Abrael", data_nascimento: "1981-01-01", cpf: "333.333.333-33", cidade: "Guarapari", bairro: "Ubatuba", rua: "Rua Dr. Brício Mesquita", telefone: "(11) 1111-1111", login: "func1", senha: "123456", paisisoId: 1 });
        const f2 = await Funcionario.create({ nome: "Funcionário Bonuto", data_nascimento: "1985-02-02", cpf: "444.444.444-44", cidade: "Guarapari", bairro: "Ubatuba", rua: "Rua José Figueiredo", telefone: "(22) 2222-2222", login: "func2", senha: "123456", paisisoId: 3 });
        const f3 = await Funcionario.create({ nome: "Funcionário João", data_nascimento: "1981-01-01", cpf: "333.333.333-33", cidade: "Cachoeiro de Itapemirim", bairro: "Ibitiquara", rua: "Rua Dr. Brício Mesquita", telefone: "(11) 1111-1111", login: "func1", senha: "123456", paisisoId: 1 });
        const f4 = await Funcionario.create({ nome: "Funcionário José", data_nascimento: "1985-02-02", cpf: "444.444.444-44", cidade: "Marataizes", bairro: "Abumbum", rua: "Rua José Figueiredo", telefone: "(22) 2222-2222", login: "func2", senha: "123456", paisisoId: 4 });


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
            valorTotalEstadia: 5 * 850,
            quartoId: q1.id,
            funcionarioId: f1.id,
            reservaId: reserva1.id
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

        const ol1 = await OrdemLimpeza.create({ status: "Concluido", observacao: "SADASDASDASDASDASDASD", inicio: "2026-02-22 08:32:45", fim: "2026-02-22 10:32:25", funcionarioId: 1, quartoId: 1 });
        const ol2 = await OrdemLimpeza.create({ status: "Concluido", observacao: "", inicio: "2026-02-25 07:32:45", fim: "2026-02-25 9:28:25", funcionarioId: 2, quartoId: 1 });
        const ol3 = await OrdemLimpeza.create({ status: "Concluido", observacao: "", inicio: "2026-02-26 08:32:45", fim: "2026-02-26 19:00:00", funcionarioId: 3, quartoId: 2 });
        const ol4 = await OrdemLimpeza.create({ status: "Concluido", observacao: "", inicio: "2026-02-26 06:28:45", fim: "2026-02-26 10:32:25", funcionarioId: 3, quartoId: 2 });
    })();
}

export default sequelize;