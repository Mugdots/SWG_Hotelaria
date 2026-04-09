import {TipoDeQuarto} from '../models/TipoDeQuarto.js';

class TipoDeQuartoService {
    static async findAll() {
        const objs = await TipoDeQuarto.findAll({include: { all: true, nested: true}});
        return objs;
    }

    static async findByPk(req, res) {
        const { id } = req.params;
        const obj = await TipoDeQuarto.findByPk(id, {include: {all:true, nested:true}});
        return obj;
    }   

    static async create(req, res) {     
        const { nome, descricao, precoDiaria, capaxidadeMax, tipoCama, tamanho } = req.body;
        const obj = await TipoDeQuarto.create({nome, descricao, precoDiaria, capaxidadeMax, tipoCama, tamanho});
        return await TipoDeQuarto.findByPk(obj.id, {include: { all:true, nested: true}});
    }

    static async update(req, res) {
        const { id } = req.params;
        const { nome, descricao, precoDiaria, capaxidadeMax, tipoCama, tamanho } = req.body;
        const obj = await TipoDeQuarto.findByPk(id, {include: {all: true, nested: true } });
        if (obj == null) throw 'Tipo de quarto não encontrado!';
        Object.assign(obj, {nome, descricao, precoDiaria, capaxidadeMax, tipoCama, tamanho});
        await obj.save();
        return await TipoDeQuarto.findByPk(id, {include: {all: true, nested: true } });
    }       

    static async delete(req, res) { 
        const { id } = req.params; 
        const obj = await TipoDeQuarto.findByPk(id);
        if (obj == null) throw 'Tipo de quarto não encontrado!';
        try {
            await obj.destroy();
            return obj;
        } catch(erro) {
            throw "Não e possível remover um tipo de quarto que possui quartos";
        }
    }

}

export { TipoDeQuartoService };