import {Quarto} from '../models/Quarto.js';

class QuartoService {
    static async findAll() {
        const objs = await Quarto.findAll({include: { all: true, nested: true}});
        return objs;
    }

    static async findByPk(req, res) {
        const { id } = req.params;
        const obj = await Quarto.findByPk(id, {include: {all:true, nested:true}});
        return obj;
    }   

    static async create(req, res) {     
        const { numero, andar, status_quarto, tipoDeQuartoId } = req.body;
        const obj = await Quarto.create({numero, andar, status_quarto, tipoDeQuartoId});
        return await Quarto.findByPk(obj.id, {include: { all:true, nested: true}});
    }

    static async update(req, res) {
        const { id } = req.params;
        const { numero, andar, status_quarto, tipoDeQuartoId } = req.body;
        const obj = await Quarto.findByPk(id, {include: {all: true, nested: true } });
        if (obj == null) throw 'Quarto não encontrado!';
        Object.assign(obj, {numero, andar, status_quarto, tipoDeQuartoId});
        await obj.save();
        return await Quarto.findByPk(id, {include: {all: true, nested: true } });
    }       

    static async delete(req, res) { 
        const { id } = req.params; 
        const obj = await Quarto.findByPk(id);
        if (obj == null) throw 'Quarto não encontrado!';
        try {
            await obj.destroy();
            return obj;
        } catch(erro) {
            throw "Não é possível remover um Quarto que possui estadia";
        }
    }

}

export { QuartoService };