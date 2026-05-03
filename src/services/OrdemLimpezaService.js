import {OrdemLimpeza} from '../models/OrdemLimpeza.js';

class OrdemLimpezaService {
    static async findAll() {
        const objs = await OrdemLimpeza.findAll({include: { all: true, nested: true}});
        return objs;
    }

    static async findByPk(req, res) {
        const { id } = req.params;
        const obj = await OrdemLimpeza.findByPk(id, {include: {all:true, nested:true}});
        return obj;
    }   

    static async findByFuncionario(req, res) {
        const { id } = req.params;
        const objs = await OrdemLimpeza.findAll({where: {funcionarioId: id}, include: {all:true, nested:true}});
        return objs;
    }

    static async findByQuarto(req, res) {
        const { id } = req.params;
        const objs = await OrdemLimpeza.findAll({where: {quartoId: id}, include: {all:true, nested:true}});
        return objs;
    }

    static async create(req, res) {     
        const { id, status, observacao, inicio, fim, funcionarioId, quartoId } = req.body;
        
        //if (estado == null) throw 'Estado deve ser preenchido!';
        const obj = await OrdemLimpeza.create({id, status, observacao, inicio, fim, funcionarioId, quartoId});

        return await OrdemLimpeza.findByPk(obj.id, {include: { all:true, nested: true}});
    }

    static async update(req, res) {
        const { id } = req.params;
        const { id, status, observacao, inicio, fim, funcionarioId, quartoId } = req.body;
        //if (estado == null) throw 'Estado deve ser preenchido!';
        const obj = await OrdemLimpeza.findByPk(id, {include: {all: true, nested: true } });
        if (obj == null) throw 'Ordem de Limpeza não encontrado!';
        Object.assign(obj, {id, status, observacao, inicio, fim, funcionarioId, quartoId});
        await obj.save();
        return await OrdemLimpeza.findByPk(id, {include: {all: true, nested: true } });
    }       

    static async delete(req, res) { 
        const { id } = req.params; 
        const obj = await OrdemLimpeza.findByPk(id);
        if (obj == null) throw 'Ordem de Limpeza não encontrado!';
        try {
            await obj.destroy();
            return obj;
        } catch(erro) {
            throw "Não e possível remover um funcionário que possui.";
        }
    }

}

export { OrdemLimpezaService };