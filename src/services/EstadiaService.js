import { Estadia } from '../models/Estadia.js';
import { Quarto } from '../models/Quarto.js';
import sequelize from '../config/database-connection.js';
import { QueryTypes } from 'sequelize';

class EstadiaService {
    static async findAll() {
        const objs = await Estadia.findAll({ include: { all: true, nested: true } });
        return objs;
    }

    static async findByPk(req, res) {
        const { id } = req.params;
        const obj = await Estadia.findByPk(id, { include: { all: true, nested: true } });
        return obj;
    }

    static async create(req, res) {
        const { checkIn, checkOut, valorTotalEstadia, reserva, funcionario, quarto } = req.body;
        const t = await sequelize.transaction();
        try {
            await EstadiaService.verificarCheckinAntecipado(t);
            const quartoObj = await Quarto.findByPk(quarto.id);
            if (!quartoObj) {
                throw "Quarto informado não encontrado!";
            }
            if (quartoObj.status_quarto !== 'Disponivel') {
                throw "O quarto informado não está disponível!";
            }

            const obj = await Estadia.create({ checkIn, checkOut, valorTotalEstadia, reservaId: reserva.id, funcionarioId: funcionario.id, quartoId: quarto.id }, { transaction: t });
            await quartoObj.update({ status_quarto: 'Ocupado' }, { transaction: t });
            await t.commit();
            return await Estadia.findByPk(obj.id, { include: { all: true, nested: true } });
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    static async update(req, res) {
        const { id } = req.params;
        const { checkOut } = req.body;
        const t = await sequelize.transaction();
        try {
            const estadiaObj = await Estadia.findByPk(id);
            if (!estadiaObj) {
                throw "Estadia não encontrada!";
            }
            await EstadiaService.verificarOrdensEmAndamento(estadiaObj.quartoId, t);
            await estadiaObj.update({ checkOut }, { transaction: t });
            const quartoObj = await Quarto.findByPk(
                estadiaObj.quartoId
            );
            await quartoObj.update({ status_quarto: 'Limpeza' }, { transaction: t });
            await t.commit();
            return await Estadia.findByPk(id, { include: { all: true, nested: true } });
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    static async delete(req, res) {
        const { id } = req.params;
        const obj = await Estadia.findByPk(id);
        if (obj == null) throw 'Estadia não encontrado!';
        try {
            await obj.destroy();
            return obj;
        } catch (erro) {
            throw "Não é possível remover uma estadia que possui hóspedes";
        }
    }

    static async verificarCheckinAntecipado(transaction) { // RN09
        const agora = new Date();
        const horaAtual = agora.getHours();
        const dataAtual = agora.toISOString().split('T')[0];
        if (horaAtual < 14) {
            const [resultado] = await sequelize.query(`
            SELECT COUNT(*) AS total
            FROM estadias
            WHERE checkIn = :dataAtual
        `, {
                replacements: { dataAtual },
                type: sequelize.QueryTypes.SELECT,
                transaction
            });
            const totalCheckinsAntecipados = resultado.total;
            if (totalCheckinsAntecipados >= 5) {
                throw "Limite máximo de check-ins antecipados atingido para hoje!";
            }
        }
    }

    static async verificarOrdensEmAndamento(quartoId, transaction) { // RN10
        const [resultado] = await sequelize.query(`
        SELECT COUNT(*) AS total
        FROM ordemlimpezas
        WHERE quarto_id = :quartoId
        AND status = 'Andamento'
    `, {
            replacements: { quartoId },
            type: sequelize.QueryTypes.SELECT,
            transaction
        });
        if (resultado.total > 0) {
            throw "Não é possível realizar o check-out. Existe uma ordem de limpeza em andamento para este quarto!";
        }
    }

    static async getRelatorioLucroEstadiaPorPeriodo(req, res) {
        const { dataInicio, dataFim } = req.params;

        const objs = await sequelize.query(`
        SELECT 
            e.id,
            e."checkOut" AS dataSaida,
            h.nome AS hospede,
            q.numero AS quarto,
            e.valor_total_estadia AS valorEstadia
        FROM estadias e
        INNER JOIN reservas r 
            ON r.id = e.reserva_id
        INNER JOIN hospedes h 
            ON h.id = r.hospede_id
        INNER JOIN quartos q 
            ON q.id = e.quarto_id
        WHERE e."checkOut" BETWEEN :dataInicio AND :dataFim
        ORDER BY e."checkOut" ASC
    `, {
            replacements: { dataInicio, dataFim },
            type: sequelize.QueryTypes.SELECT
        });

         const somaTotal = await sequelize.query(`
        SELECT 
            SUM(valor_total_estadia) AS "somaTotal"
        FROM estadias
        WHERE "checkOut" BETWEEN :dataInicio AND :dataFim
    `, {
            replacements: { dataInicio, dataFim },
            type: sequelize.QueryTypes.SELECT
        });

        console.log(somaTotal);

        return {
            estadias: objs,
            somaTotal: somaTotal[0].somaTotal || 0
        };
    }

    static async getRelatorioProcedenciaGeografica(req, res) {

        const objs = await sequelize.query(`
        SELECT 
            p.nome AS pais,
            e.nome_estado AS estado,
            COUNT(es.id) AS qtdEstadias,
            SUM(es.valor_total_estadia) AS receitaTotal,
            ROUND(CAST(AVG(es.valor_total_estadia) AS NUMERIC), 2) AS valorMedio
        FROM estadias es

        INNER JOIN reservas r
            ON r.id = es.reserva_id

        INNER JOIN hospedes h
            ON h.id = r.hospede_id

        INNER JOIN estados e
            ON e.id = h.estado_id

        INNER JOIN paisisos p
            ON p.id = e.paisiso_id

        GROUP BY 
            p.nome,
            e.nome_estado

        ORDER BY 
            receitaTotal DESC
    `, {
            type: sequelize.QueryTypes.SELECT
        });

        return objs;
    }

}

export { EstadiaService };