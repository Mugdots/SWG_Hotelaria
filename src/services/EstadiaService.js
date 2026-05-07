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
        } catch (error){
            await t.rollback();
            throw "Erro ao realizar a estadia!";
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

}

export { EstadiaService };