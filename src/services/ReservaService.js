import { QueryTypes } from 'sequelize';
import sequelize from '../config/database-connection.js';
import { Reserva } from '../models/Reserva.js';
import { Quarto } from '../models/Quarto.js';

export class ReservaService {

    static async findAll() {
        const objs = await Reserva.findAll({ include: { all: true, nested: true } });
        return objs;
    }

    static async findByPk(req) {
        const { id } = req.params;
        const obj = await Reserva.findByPk(id, { include: { all: true, nested: true } });
        return obj;
    }

    static async create(req) {
        const dadosReserva = req.body;

        //verificando regras de negócio antes de criar a reserva
        const disponibilidade = await this.verificarDisponibilidade(dadosReserva);
        if (!disponibilidade.disponivel) {
            throw 'Não há quartos disponíveis para este tipo no período selecionado. Escolha outro período ou outro tipo de quarto.';
        }

        const conflitoDatas = await this.verificarConflitoDatas(dadosReserva);
        if (conflitoDatas.temConflito) {
            throw 'Este hóspede já possui uma reserva para o período selecionado.';
        }

        // Definindo o status inicial da reserva como Pendente (0)
        dadosReserva.status = 0;
        const obj = await Reserva.create(dadosReserva);
        return obj;
    }   

    static async update(req) {
        const { id } = req.params;
        const dadosReserva = req.body;
        const obj = await Reserva.findByPk(id);
        if (!obj) {
            return null;
        }

        const dadosParaValidacao = {
            ...obj.toJSON(),
            ...dadosReserva,
            reservaIdIgnorar: obj.id
        };

        //verificando regras de negócio antes de atualizar a reserva
        const disponibilidade = await this.verificarDisponibilidade(dadosParaValidacao);
        if (!disponibilidade.disponivel) {
            throw 'Não há quartos disponíveis para este tipo no período selecionado. Escolha outro período ou outro tipo de quarto.';
        }

        const conflitoDatas = await this.verificarConflitoDatas(dadosParaValidacao);
        if (conflitoDatas.temConflito) {
            throw 'Este hóspede já possui uma reserva para o período selecionado.';
        }

        await obj.update(dadosReserva);
        return obj;
    }   

    static async delete(req) {
        const { id } = req.params;
        const obj = await Reserva.findByPk(id);
        if (!obj) {
            return null;
        }

        if (obj.status !== 0) {
            throw 'Apenas reservas com status Pendente podem ser canceladas!';
        }

        await obj.destroy();
        return obj;
    }

    static async findByHospede(req){
        const { hospedeId } = req.params;
        const reservas = await Reserva.findAll({
            where: { hospedeId },
            include: { all: true, nested: true }
        });
        return reservas;
    }

    static async findByTipoDeQuarto(req){
        const { tipoDeQuartoId } = req.params;
        const reservas = await Reserva.findAll({
            where: { tipoDeQuartoId },
            include: { all: true, nested: true }
        });
        return reservas;
    }


    // Implementando as regras de negócio relacionadas ao processo de negócio Reserva
    
    static validarPeriodoReserva(entradaAcomodacao, saidaAcomodacao) {
        if (!entradaAcomodacao || !saidaAcomodacao) {
            throw 'Entrada e saída da acomodação devem ser preenchidas!';
        }

        const entrada = new Date(entradaAcomodacao);
        const saida = new Date(saidaAcomodacao);

        if (Number.isNaN(entrada.getTime()) || Number.isNaN(saida.getTime())) {
            throw 'Período da reserva inválido!';
        }

        if (entrada >= saida) {
            throw 'A data de saída deve ser maior que a data de entrada!';
        }
    }

    // RN01 (Disponibilidade): O hotel só pode confirmar uma nova reserva se houverem quartos vagos na categoria escolhida para o período solicitado.
    static async verificarDisponibilidade(dadosReserva) {
        const {
            tipoDeQuartoId,
            entradaAcomodacao,
            saidaAcomodacao,
            reservaIdIgnorar
        } = dadosReserva;

        if (!tipoDeQuartoId) {
            throw 'Tipo de quarto deve ser preenchido!';
        }

        this.validarPeriodoReserva(entradaAcomodacao, saidaAcomodacao);

        const quartosDoTipo = await sequelize.query(
            "SELECT COUNT(*) as quantidade FROM quartos WHERE tipoDeQuartoId = ?",
            { replacements: [tipoDeQuartoId], type: QueryTypes.SELECT }
        );

        const totalQuartos = quartosDoTipo[0].quantidade;

        if (totalQuartos === 0) {
            throw 'Não existem quartos cadastrados para o tipo de quarto selecionado!';
        }

        let queryReservas = 
            "SELECT COUNT(*) as quantidade FROM reservas " +
            "WHERE tipoDeQuartoId = ? " +
            "AND entradaAcomodacao < ? " +
            "AND saidaAcomodacao > ?";
        
        const params = [tipoDeQuartoId, saidaAcomodacao, entradaAcomodacao];

        if (reservaIdIgnorar != null) {
            queryReservas += " AND id != ?";
            params.push(reservaIdIgnorar);
        }

        const reservasConflitantes = await sequelize.query(
            queryReservas,
            { replacements: params, type: QueryTypes.SELECT }
        );

        const totalReservasConflitantes = reservasConflitantes[0].quantidade;
        const disponivel = totalReservasConflitantes < totalQuartos;

        return {
            tipoDeQuartoId,
            entradaAcomodacao,
            saidaAcomodacao,
            quartosDoTipo: totalQuartos,
            reservasConflitantes: totalReservasConflitantes,
            disponivel,
            mensagem: disponivel
                ? 'Há disponibilidade para esta busca.'
                : 'Não há quartos disponíveis para este tipo no período selecionado. Escolha outro período ou outro tipo de quarto.'
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

        let queryConflito = 
            "SELECT COUNT(*) as quantidade FROM reservas " +
            "WHERE hospedeId = ? " +
            "AND entradaAcomodacao < ? " +
            "AND saidaAcomodacao > ?";
        
        const params = [hospedeId, saidaAcomodacao, entradaAcomodacao];

        if (reservaIdIgnorar != null) {
            queryConflito += " AND id != ?";
            params.push(reservaIdIgnorar);
        }

        const reservasConflitantes = await sequelize.query(
            queryConflito,
            { replacements: params, type: QueryTypes.SELECT }
        );

        const totalConflitos = reservasConflitantes[0].quantidade;
        const temConflito = totalConflitos > 0;

        return {
            hospedeId,
            entradaAcomodacao,
            saidaAcomodacao,
            reservasConflitantes: totalConflitos,
            temConflito,
            mensagem: temConflito
                ? 'Este hóspede já possui uma reserva para o período selecionado.'
                : 'Sem conflitos de datas para este hóspede.'
        };
    }

    // RN03 (Status da Reserva): Toda nova reserva entra no sistema automaticamente com o status "Pendente". O sistema realizará a confirmação automática desta reserva 10 dias antes da data de entrada prevista para o hóspede, sendo que o cancelamento direto pelo sistema só será permitido enquanto a reserva ainda possuir o status de "Pendente".
    static async confirmarReservasAutomaticas() {
        const hoje = new Date();
        const dataConfirmacao = new Date(hoje);
        dataConfirmacao.setDate(dataConfirmacao.getDate() + 10);
        
        const ano = dataConfirmacao.getFullYear();
        const mes = String(dataConfirmacao.getMonth() + 1).padStart(2, '0');
        const dia = String(dataConfirmacao.getDate()).padStart(2, '0');
        const dataFormatada = `${ano}-${mes}-${dia}`;

        const queryConfirmar = 
            "UPDATE reservas " +
            "SET status = 1 " +
            "WHERE status = 0 " +
            "AND entradaAcomodacao = ?";

        await sequelize.query(
            queryConfirmar,
            { replacements: [dataFormatada], type: QueryTypes.UPDATE }
        );

        return {
            dataConfirmacao: dataFormatada,
            mensagem: 'Reservas confirmadas automaticamente para 10 dias antes da entrada.'
        };
    }

    // O horário padrão previsto para entrada é 14:00hrs e saída 12:00hrs.

}