import { QueryTypes } from 'sequelize';
import sequelize from '../config/database-connection.js';
import { Reserva } from '../models/Reserva.js';
import { TipoDeQuarto } from '../models/TipoDeQuarto.js';

export class ReservaService {

    // Função auxiliar para executar consultas de contagem
    static async executarContagem(sql, parametros) {
        const resultado = await sequelize.query(sql, {
            replacements: parametros,
            type: QueryTypes.SELECT
        });

        return Number(resultado[0].quantidade);
    }

    // Função para atualizaos dados de uma reserva sem considerar a mesma
    static montarDadosReservaParaValidacao(reservaAtual, dadosAtualizacao) {
        return {
            ...reservaAtual.toJSON(),
            ...dadosAtualizacao,
            reservaIdIgnorar: reservaAtual.id
        };
    }

    // RN01 (Disponibilidade): O hotel só pode confirmar uma nova reserva se houverem quartos vagos na categoria escolhida para o período solicitado.
    static async verificarDisponibilidade(dadosReserva) {
        const { tipoDeQuartoId, entradaAcomodacao, saidaAcomodacao, reservaIdIgnorar } = dadosReserva;

        const sqlQuantidadeQuartos = `
            SELECT COUNT(*) as quantidade
            FROM quartos
            WHERE tipo_de_quarto_id = ?
        `;

        const quantidadeQuartosDoTipo = await this.executarContagem(sqlQuantidadeQuartos, [tipoDeQuartoId]);

        if (quantidadeQuartosDoTipo === 0) {
            throw 'Não existem quartos cadastrados para o tipo de quarto selecionado!';
        }

        let sqlReservasConflitantes = `
            SELECT COUNT(*) as quantidade
            FROM reservas
            WHERE tipo_de_quarto_id = ?
            AND entrada_acomodacao < ?
            AND saida_acomodacao > ?
        `;

        const parametros = [tipoDeQuartoId, saidaAcomodacao, entradaAcomodacao];

        if (reservaIdIgnorar != null) {
            sqlReservasConflitantes += ' AND id != ?';
            parametros.push(reservaIdIgnorar);
        }

        const quantidadeReservasConflitantes = await this.executarContagem(sqlReservasConflitantes, parametros);
        const disponivel = quantidadeReservasConflitantes < quantidadeQuartosDoTipo;

        return {
            disponivel
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
            WHERE hospede_id = ?
            AND entrada_acomodacao < ?
            AND saida_acomodacao > ?
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

        // RN04 (Capacidade Máxima por Tipo de Quarto): Número de Pessoas da Reserva não pode exceder a capacidade máxima do tipo de quarto.
    static async validarCapacidadeMaximaPorTipoDeQuarto(dadosReserva) {
        const { tipoDeQuartoId, numeroPessoas } = dadosReserva;


        const tipoDeQuarto = await TipoDeQuarto.findByPk(tipoDeQuartoId);
        if (!tipoDeQuarto) {
            throw 'Tipo de quarto informado não existe!';
        }

        const capacidadeMaxima = Number(tipoDeQuarto.capacidadeMax);
        if (Number(numeroPessoas) > capacidadeMaxima) {
            throw `O número de pessoas informado (${numeroPessoas}) excede a capacidade máxima do tipo de quarto (${capacidadeMaxima}).`;
        }
    }

    // Função para validar todas as regras de negócio relacionadas à reserva
    static async validarRegrasDeReserva(dadosReserva) {
        await this.validarCapacidadeMaximaPorTipoDeQuarto(dadosReserva);

        const disponibilidade = await this.verificarDisponibilidade(dadosReserva);
        if (!disponibilidade.disponivel) {
            throw 'Não há quartos disponíveis para este tipo no período selecionado. Escolha outro período ou outro tipo de quarto.';
        }

        const conflitoDeDatas = await this.verificarConflitoDatas(dadosReserva);
        if (conflitoDeDatas.temConflito) {
            throw 'Este hóspede já possui uma reserva para o período selecionado.';
        }
    }

    // Listar todas as reservas
    static async findAll() {
        const reservas = await Reserva.findAll({ include: { all: true, nested: true } });
        return reservas;
    }

    // Buscar reserva por ID
    static async findByPk(req) {
        const { id } = req.params;
        const reserva = await Reserva.findByPk(id, { include: { all: true, nested: true } });
        return reserva;
    }

    //Criar Reserva
    static async create(req) {
        const { entradaAcomodacao, saidaAcomodacao, numeroPessoas, observacao, hospedeId, tipoDeQuartoId } = req.body;
        const dadosNovaReserva = { entradaAcomodacao, saidaAcomodacao, numeroPessoas, observacao, hospedeId, tipoDeQuartoId, status: 0 };

        await this.validarRegrasDeReserva(dadosNovaReserva);

        return await Reserva.create(dadosNovaReserva);
    }   

    //Atualizar Reserva
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

    // Apagar uma reserva só é permitido enquanto a reserva ainda possuir o status de "Pendente" (status = 0)
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

    //funções que não apareceram no slide, mas que são importantes para a implementação das regras de negócio
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
              AND entrada_acomodacao = ?
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