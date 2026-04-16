import {Hospede} from '../models/Hospede.js';

class HospedeService {
    static async findAll() {
        const objs = await Hospede.findAll({include: { all: true, nested: true}});
        return objs;
    }

    static async findByPk(req, res) {
        const { id } = req.params;
        const obj = await Hospede.findByPk(id, {include: {all:true, nested:true}});
        return obj;
    }   

    static async findByEstado(req, res) {
        const { id } = req.params;
        const objs = await Hospede.findAll({where: {estadoId: id}, include: {all:true, nested:true}});
        return objs;
    }

    static async create(req, res) {     
        const { nome, cpfPassaporte, email, telefone, nascimento, estado } = req.body;
        if (estado == null) throw 'Estado deve ser preenchido!';
        const obj = await Hospede.create({ nome, cpfPassaporte, email, telefone, nascimento, estadoId: estado.id});
        return await Hospede.findByPk(obj.id, {include: { all:true, nested: true}});
    }

    static async update(req, res) {
        const { id } = req.params;
        const { nome, cpfPassaporte, email, telefone, nascimento, estado } = req.body;
        if (estado == null) throw 'Estado deve ser preenchido!';
        const obj = await Hospede.findByPk(id, {include: {all: true, nested: true } });
        if (obj == null) throw 'Hóspede não encontrado!';
        Object.assign(obj, {nome, cpfPassaporte, email, telefone, nascimento, estadoId: estado.id});
         await obj.save();
        return await Hospede.findByPk(id, {include: {all: true, nested: true } });
    }       

    static async delete(req, res) { 
        const { id } = req.params; 
        const obj = await Hospede.findByPk(id);
        if (obj == null) throw 'Hóspede não encontrado!';
        try {
            await obj.destroy();
            return obj;
        } catch(erro) {
            throw "Não e possível remover um hóspede que possui reservas";
        }
    }

}

export { HospedeService };