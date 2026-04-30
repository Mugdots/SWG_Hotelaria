import { QueryTypes } from 'sequelize';
import sequelize from '../config/database-connection.js';
import { Reserva } from '../models/Reserva.js';

export class ReservaService {

    static async findAll() {
        const reservas = await Reserva.findAll({ include: { all: true, nested: true } });
        return reservas;
    }

    static async findByPk(req) {
        const { id } = req.params;
        const reserva = await Reserva.findByPk(id, { include: { all: true, nested: true } });
        return reserva;
    }

    static async create(req) {
        const { entradaAcomodacao, saidaAcomodacao, numeroPessoas, observacao, hospedeId, tipoDeQuartoId } = req.body;
        const dadosNovaReserva = { entradaAcomodacao, saidaAcomodacao, numeroPessoas, observacao, hospedeId, tipoDeQuartoId, status: 0 };

        await this.validarRegrasDeReserva(dadosNovaReserva);

        return await Reserva.create(dadosNovaReserva);
    }   

    static async update(req) {
        const { id } = req.params;
        const { entradaAcomodacao, saidaAcomodacao, numeroPessoas, observacao, hospedeId, tipoDeQuartoId } = req.body;

        const dadosAtualizacao = { entradaAcomodacao, saidaAcomodacao, numeroPessoas, observacao, hospedeId, tipoDeQuartoId };

        const reservaAtual = await Reserva.findByPk(id);
        if (!reservaAtual) {
            return null;
        }

        const dadosReservaParaValidacao = this.montarDadosReservaParaValidacao(reservaAtual, dadosAtualizacao);
        await this.validarRegrasDeReserva(dadosReservaParaValidacao);

        await reservaAtual.update(dadosAtualizacao);
        return reservaAtual;
    }

    static async delete(req) {
        const { id } = req.params;
        const reserva = await Reserva.findByPk(id);
        if (!reserva) {
            return null;
        }

        if (reserva.status !== 0) {
            throw 'Apenas reservas com status Pendente podem ser canceladas!';
        }

        await reserva.destroy();
        return reserva;
    }

    static async findByHospede(req) {
        const { hospedeId } = req.params;
        const reservas = await Reserva.findAll({
            where: { hospedeId },
            include: { all: true, nested: true }
        });
        return reservas;
    }

    static async findByTipoDeQuarto(req) {
        const { tipoDeQuartoId } = req.params;
        const reservas = await Reserva.findAll({
            where: { tipoDeQuartoId },
            include: { all: true, nested: true }
        });
        return reservas;
    }


    static async validarRegrasDeReserva(dadosReserva) {
        const disponibilidade = await this.verificarDisponibilidade(dadosReserva);
        if (!disponibilidade.disponivel) {
            throw 'Não há quartos disponíveis para este tipo no período selecionado. Escolha outro período ou outro tipo de quarto.';
        }

        const conflitoDeDatas = await this.verificarConflitoDatas(dadosReserva);
        if (conflitoDeDatas.temConflito) {
            throw 'Este hóspede já possui uma reserva para o período selecionado.';
        }
    }

    static montarDadosReservaParaValidacao(reservaAtual, dadosAtualizacao) {
        return {
            ...reservaAtual.toJSON(),
            ...dadosAtualizacao,
            reservaIdIgnorar: reservaAtual.id
        };
    }
    
    static validarPeriodoReserva(entradaAcomodacao, saidaAcomodacao) {
        if (!entradaAcomodacao || !saidaAcomodacao) {
            throw 'Entrada e saída da acomodação devem ser preenchidas!';
        }

        const dataEntrada = new Date(entradaAcomodacao);
        const dataSaida = new Date(saidaAcomodacao);

        if (Number.isNaN(dataEntrada.getTime()) || Number.isNaN(dataSaida.getTime())) {
            throw 'Período da reserva inválido!';
        }

        if (dataEntrada >= dataSaida) {
            throw 'A data de saída deve ser maior que a data de entrada!';
        }
    }

    static async executarContagem(sql, parametros) {
        const resultado = await sequelize.query(sql, {
            replacements: parametros,
            type: QueryTypes.SELECT
        });

        return Number(resultado[0].quantidade);
    }

    // RN01 (Disponibilidade): O hotel só pode confirmar uma nova reserva se houverem quartos vagos na categoria escolhida para o período solicitado.
    static async verificarDisponibilidade(dadosReserva) {
        const { tipoDeQuartoId, entradaAcomodacao, saidaAcomodacao, reservaIdIgnorar } = dadosReserva;

        if (!tipoDeQuartoId) {
            throw 'Tipo de quarto deve ser preenchido!';
        }

        this.validarPeriodoReserva(entradaAcomodacao, saidaAcomodacao);

        const sqlQuantidadeQuartos = `
            SELECT COUNT(*) as quantidade
            FROM quartos
            WHERE tipoDeQuartoId = ?
        `;

        const quantidadeQuartosDoTipo = await this.executarContagem(sqlQuantidadeQuartos, [tipoDeQuartoId]);

        if (quantidadeQuartosDoTipo === 0) {
            throw 'Não existem quartos cadastrados para o tipo de quarto selecionado!';
        }

        let sqlReservasConflitantes = `
            SELECT COUNT(*) as quantidade
            FROM reservas
            WHERE tipoDeQuartoId = ?
              AND entradaAcomodacao < ?
              AND saidaAcomodacao > ?
        `;

        // FROM reservas
        // Ele olha na tabela de reservas.

        // WHERE tipoDeQuartoId = ?
        // Ele filtra só as reservas do mesmo tipo de quarto que você está tentando reservar.

        // AND entradaAcomodacao < ?
        // Aqui ele pega reservas que começaram antes da data de saída da nova reserva.

        // AND saidaAcomodacao > ?
        // Aqui ele pega reservas que terminaram depois da data de entrada da nova reserva.

        // Juntando as duas condições de data
        // Isso identifica sobreposição de períodos. Em outras palavras, se uma reserva já existente “entra antes de você sair” e “sai depois de você entrar”, então as datas se cruzam.

        // SELECT COUNT(*) as quantidade
        // Em vez de trazer as reservas, ele só conta quantas bateram com esse filtro.

        const parametros = [tipoDeQuartoId, saidaAcomodacao, entradaAcomodacao];

        if (reservaIdIgnorar != null) {
            sqlReservasConflitantes += ' AND id != ?';
            parametros.push(reservaIdIgnorar);
        }

        const quantidadeReservasConflitantes = await this.executarContagem(sqlReservasConflitantes, parametros);
        const disponivel = quantidadeReservasConflitantes < quantidadeQuartosDoTipo;

        return {
            disponivel,
            quantidadeQuartosDoTipo,
            quantidadeReservasConflitantes
        };
    }

    // RN02 (Conflito de Datas): Um mesmo cliente não pode ter duas reservas diferentes marcadas para os mesmos dias.
    static async verificarConflitoDatas(dadosReserva) {
        const {
            hospedeId,
            entradaAcomodacao,
            saidaAcomodacao,
            reservaIdIgnorar
        } = dadosReserva;

        if (!hospedeId) {
            throw 'Hóspede deve ser preenchido!';
        }

        this.validarPeriodoReserva(entradaAcomodacao, saidaAcomodacao);

        let sqlConflitoDatas = `
            SELECT COUNT(*) as quantidade
            FROM reservas
            WHERE hospedeId = ?
              AND entradaAcomodacao < ?
              AND saidaAcomodacao > ?
        `;

        const parametros = [hospedeId, saidaAcomodacao, entradaAcomodacao];

        if (reservaIdIgnorar != null) {
            sqlConflitoDatas += ' AND id != ?';
            parametros.push(reservaIdIgnorar);
        }

        const quantidadeConflitos = await this.executarContagem(sqlConflitoDatas, parametros);

        return {
            temConflito: quantidadeConflitos > 0,
            quantidadeConflitos
        };
    }

    // RN03 (Status da Reserva): Toda nova reserva entra no sistema automaticamente com o status "Pendente". O sistema realizará a confirmação automática desta reserva 10 dias antes da data de entrada prevista para o hóspede, sendo que o cancelamento direto pelo sistema só será permitido enquanto a reserva ainda possuir o status de "Pendente".
    static async confirmarReservasAutomaticas() {
        const hoje = new Date();
        const dataLimiteConfirmacao = new Date(hoje);
        dataLimiteConfirmacao.setDate(dataLimiteConfirmacao.getDate() + 10);
        const dataEntradaAlvo = this.formatarData(dataLimiteConfirmacao);

        const sqlConfirmacaoAutomatica = `
            UPDATE reservas
            SET status = 1
            WHERE status = 0
              AND entradaAcomodacao = ?
        `;

        await sequelize.query(sqlConfirmacaoAutomatica, {
            replacements: [dataEntradaAlvo],
            type: QueryTypes.UPDATE
        });

        return {
            dataConfirmacao: dataEntradaAlvo,
            mensagem: 'Reservas confirmadas automaticamente para 10 dias antes da entrada.'
        };
    }

    // O horário padrão previsto para entrada é 14:00hrs e saída 12:00hrs.

}