import {Estado} from '../models/Estado.js';

class EstadoService {
    static async findAll() {
        const objs = await Estado.findAll({include: { all: true, nested: true}});
        return objs;
    }

    static async findByPk(req, res) {
        const { id } = req.params;
        const obj = await Estado.findByPk(id, {include: {all:true, nested:true}});
        return obj;
    }   

    static async create(req, res) {     
        const { nomeEstado, siglaUf, regiaoGeografica, paisisoId } = req.body;
        const obj = await Estado.create({nomeEstado, siglaUf, regiaoGeografica, paisisoId});
        return await Estado.findByPk(obj.id, {include: { all:true, nested: true}});
    }

    static async update(req, res) {
        const { id } = req.params;
        const { nomeEstado, siglaUf, regiaoGeografica, paisisoId } = req.body;
        const obj = await Estado.findByPk(id, {include: {all: true, nested: true } });
        if (obj == null) throw 'Estado não encontrado!';
        Object.assign(obj, {nomeEstado, siglaUf, regiaoGeografica, paisisoId});
        await obj.save();
        return await Estado.findByPk(id, {include: {all: true, nested: true } });
    }       

    static async delete(req, res) { 
        const { id } = req.params; 
        const obj = await Estado.findByPk(id);
        if (obj == null) throw 'Estado não encontrado!';
        try {
            await obj.destroy();
            return obj;
        } catch(erro) {
            throw "Não é possível remover um estado que possui hóspedes";
        }
    }

}

export { EstadoService };