import { types } from 'pg';
import sequelize from '../config/database-connection.js';
import { QuartoController } from '../controllers/QuartoController.js';
import { OrdemLimpeza } from '../models/OrdemLimpeza.js';
import { FuncionarioService } from './FuncionarioService.js';
import { QuartoService } from './QuartoService.js';
import { QueryTypes } from 'sequelize';

class OrdemLimpezaService {
    static async findAll() {
        const objs = await OrdemLimpeza.findAll({ include: { all: true, nested: true } });
        return objs;
    }

    static async findByPk(req, res) {
        const { id } = req.params;
        const obj = await OrdemLimpeza.findByPk(id, { include: { all: true, nested: true } });
        return obj;
    }

    static async findByFuncionario(req, res) {
        const { id } = req.params;
        const objs = await OrdemLimpeza.findAll({ where: { funcionarioId: id }, include: { all: true, nested: true } });
        return objs;
    }

    static async findByQuarto(req) {
        const { id } = req.params;
        const objs = await OrdemLimpeza.findAll({ where: { quartoId: id }, include: { all: true, nested: true } });
        return objs;
    }


    static async findByFuncionarioId(id) {
        const objs = await OrdemLimpeza.findAll({ where: { funcionarioId: id }, include: { all: true, nested: true } });
        return objs;
    }

    static async findByQuartoId(id) {
        const objs = await OrdemLimpeza.findAll({ where: { quartoId: id }, include: { all: true, nested: true } });
        return objs;
    }

    static async create(req, res) {
        const { status, observacao, inicio, fim, funcionarioId, quartoId } = req.body;
        await this.verificarRegrasDeNegocio(req);
        const obj = await OrdemLimpeza.create({ status, observacao, inicio, fim, funcionarioId: funcionarioId, quartoId: quartoId });
        return await OrdemLimpeza.findByPk(obj.id, { include: { all: true, nested: true } });
    }


    static async verificarRegrasDeNegocio(req) {
        const { funcionarioId, quartoId } = req.body;
        if (funcionarioId == null) throw 'Funcionário deve ser preenchido!';
        if (quartoId == null) throw 'Quarto deve ser preenchido!';

        // RN-1: quarto não pode ter ordem em andamento
        const ordemQuarto = await OrdemLimpezaService.findByQuartoId(quartoId);
        for (let ordemlimpeza of ordemQuarto) {
            if (ordemlimpeza.status === "Andamento") {
                throw 'Existe uma ordem de limpeza em andamento nesse quarto';
            }
        }

        // RN-2: funcionário não pode ter mais de 3 ordens em andamento
        const ordemFuncionario = await OrdemLimpezaService.findByFuncionarioId(funcionarioId);
        let quant = 0;
        for (let ordemlimpeza of ordemFuncionario) {
            if (ordemlimpeza.status === "Andamento") quant++; // ✅ minúsculo
        }
        if (quant >= 3) throw 'Funcionário já possui 3 ordens de limpeza em andamento';

        // RN-3: quarto não pode estar em manutenção
        const quartoManutencao = await QuartoService.findByIdAndInterruped(quartoId, 'Manutencao');
        if (quartoManutencao != 0) throw 'Quarto está em manutenção, não é possível criar uma ordem de limpeza';
    }

    static async verificarQuarto(quartoId) {
        const [resultado] = await sequelize.query(`
            SELECT COUNT(*) AS total
            FROM ordemlimpezas
            WHERE quarto_id = :quartoId
            AND status = 'Andamento'`,
            {
                replacements: { quartoId },
                type: sequelize.QueryTypes.SELECT,
            });
        if (resultado.total > 0) {
            throw "Não e possível fazer isso"
        }
    }


    static async findByQuartoAndFuncionarioAndPeriodo(req) {
        const { funcionarioId, quartoId, inicio_rela, fim_rela } = req.params;
        const objs = await sequelize.query(
            "SELECT * FROM ordemlimpezas WHERE funcionario_Id = :funcionarioId AND quarto_Id = :quartoId AND inicio > :inicio_rela AND inicio < :fim_rela",
            {
                replacements: { funcionarioId, quartoId, inicio_rela, fim_rela },
                type: QueryTypes.SELECT
            }
        )
        return objs;
    }


    static async findByQuartoAndPeriodo(req) {
        const { quartoId, inicio_rela, fim_rela } = req.params;
        console.log(inicio_rela)
        const objs = await sequelize.query(
            "SELECT * FROM ordemlimpezas WHERE quarto_id = :quartoId AND inicio > :inicio_rela AND inicio < :fim_rela",
            {
                replacements: { quartoId, inicio_rela, fim_rela },
                type: QueryTypes.SELECT
            }
        )
        return objs;
    }

    static async findByFuncionarioAndPeriodo(req) {
        const { funcionarioId, inicio_rela, fim_rela } = req.params;
        const objs = await sequelize.query(
            "SELECT * FROM ordemlimpezas WHERE funcionario_Id = :funcionarioId AND inicio > :inicio_rela AND inicio < :fim_rela",
            {
                replacements: { funcionarioId, inicio_rela, fim_rela },
                type: QueryTypes.SELECT
            }
        )
        return objs;
    }

    static async contadorByFuncionarioAndPeriodo(req) {
        const { status, inicio_rela, fim_rela } = req.params;
        const objs = await sequelize.query(
            "SELECT f.nome, COUNT(ol.funcionario_id) AS count, ARRAY_AGG(ol.inicio) AS inicio FROM ordemlimpezas ol, funcionarios f WHERE ol.funcionario_id = f.id AND ol.status = :status AND ol.inicio > :inicio_rela AND ol.inicio < :fim_rela GROUP BY f.nome, ol.funcionario_id;",
            {
                replacements: { status, inicio_rela, fim_rela },
                types: QueryTypes.SELECT
            }
        )

        // SELECT f.nome, COUNT(ol.funcionario_id), GROUP_CONCAT(ol.inicio, ' | ') FROM ordemlimpezas ol, funcionarios f WHERE ol.funcionario_id = f.id AND ol.status = :status AND ol.inicio > :inicio_rela AND ol.inicio < :fim_rela GROUP BY f.nome, ol.funcionario_id;

        // POSTGRESQL
        // SELECT 
        // f.nome,
        // COUNT(ol.funcionario_id) AS count,
        // ARRAY_AGG(ol.inicio) AS inicio
        // FROM ordemlimpezas ol
        // JOIN funcionarios f ON ol.funcionario_id = f.id
        // WHERE ol.status = :status
        // AND ol.inicio > :inicio_rela
        // AND ol.inicio < :fim_rela
        // GROUP BY f.nome, ol.funcionario_id;

        // const objs = await sequelize.query(
        //      "SELECT f.nome, ol.inicio, COUNT(ol.funcionario_id) FROM ordemlimpezas ol, funcionarios f WHERE ol.funcionario_id = f.id AND ol.status = :status AND inicio > :inicio_rela AND inicio < :fim_rela GROUP BY f.nome;",
        //      {
        //          replacements: {status, inicio_rela, fim_rela},
        //          types: QueryTypes.SELECT
        //      }
        // )
        return objs;
    }


    static async update(req, res) {
        const { id } = req.params;
        const { status, observacao, inicio, fim, funcionarioId, quartoId } = req.body;
        const obj = await OrdemLimpeza.findByPk(id, { include: { all: true, nested: true } });
        if (obj == null) throw 'Ordem de Limpeza não encontrado!';
        Object.assign(obj, { id, status, observacao, inicio, fim, funcionarioId, quartoId });
        await obj.save();
        return await OrdemLimpeza.findByPk(id, { include: { all: true, nested: true } });
    }

    static async delete(req, res) {
        const { id } = req.params;
        const obj = await OrdemLimpeza.findByPk(id);
        if (obj == null) throw 'Ordem de Limpeza não encontrado!';
        try {
            await obj.destroy();
            return obj;
        } catch (erro) {
            throw "Não e possível remover um funcionário que possui.";
        }
    }
}




export { OrdemLimpezaService };