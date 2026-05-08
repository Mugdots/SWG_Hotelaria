import { QueryTypes } from 'sequelize';
import sequelize from '../config/database-connection.js';
import { Reserva } from '../models/Reserva.js';
import { TipoDeQuarto } from '../models/TipoDeQuarto.js';

export class ReservaService {

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
        const status = this.determinarStatusAutomatico(entradaAcomodacao);
        const dadosNovaReserva = { entradaAcomodacao, saidaAcomodacao, numeroPessoas, observacao, hospedeId, tipoDeQuartoId, status };

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
            throw 'Reserva não encontrada!';
        }

        const dadosReservaParaValidacao = this.montarDadosReservaParaValidacao(reservaAtual, dadosAtualizacao);
        await this.validarRegrasDeReserva(dadosReservaParaValidacao);

        await reservaAtual.update(dadosAtualizacao);
        return reservaAtual;
    }

    // Apagar(Cancelar) uma reserva
    static async delete(req) {
        const { id } = req.params;
        const reserva = await Reserva.findByPk(id);
        if (!reserva) {
            throw 'Reserva não encontrada!';
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

        if (!disponivel) {
            throw 'Não há quartos disponíveis para este tipo no período selecionado. Escolha outro período ou outro tipo de quarto.';
        }
    }

    // RN02 (Conflito de Datas): Um mesmo cliente não pode ter duas reservas diferentes marcadas para os mesmos dias.
    static async verificarConflitoDatas(dadosReserva) {
        const {
            hospedeId,
            entradaAcomodacao,
            saidaAcomodacao,
            reservaIdIgnorar
        } = dadosReserva;


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

        if (quantidadeConflitos > 0) {
            throw 'Este hóspede já possui uma reserva para o período selecionado.';
        }
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

    // RN03 (Status da Reserva): Confirma automaticamente reservas que completaram 10 dias antes da entrada
    static async confirmarReservasAutomaticas() {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const dataAlvo = hoje.toISOString().slice(0, 10);
        
        // Confirma reservas onde (entrada_acomodacao - 10 dias) = hoje
        const sql = `
            UPDATE reservas
            SET status = 1
            WHERE status = 0 AND DATE(entrada_acomodacao, '-10 days') = ?
        `;

        await sequelize.query(sql, {
            replacements: [dataAlvo],
            type: QueryTypes.UPDATE
        });

        return {
            dataConfirmacao: dataAlvo,
            mensagem: 'Reservas confirmadas automaticamente para 10 dias antes da entrada.'
        };
    }

    // RN03: Determina se reserva deve ser auto-confirmada (entrada dentro de 10 dias)
    static determinarStatusAutomatico(entradaAcomodacao) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        // Parse data local sem problema de timezone
        const [ano, mes, dia] = entradaAcomodacao.split('-').map(Number);
        const entradaDate = new Date(ano, mes - 1, dia, 0, 0, 0, 0);
        
        const diasAteEntrada = Math.floor((entradaDate - hoje) / (1000 * 60 * 60 * 24));
        return (diasAteEntrada >= 0 && diasAteEntrada <= 10) ? 1 : 0;
    }

    // O horário padrão previsto para entrada é 14:00hrs e saída 12:00hrs.

    // Função para validar todas as regras de negócio relacionadas à reserva
    static async validarRegrasDeReserva(dadosReserva) {
        await this.verificarDisponibilidade(dadosReserva);
        await this.verificarConflitoDatas(dadosReserva);
        await this.validarCapacidadeMaximaPorTipoDeQuarto(dadosReserva);
    }
}