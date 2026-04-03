import { PaisIso } from "../models/Pais.js";

class PaisService {
    static async findAll() {
        const objs = await PaisIso.findAll({include: { all: true, nested: true}});
        return objs;
    }

    static async findByPk(req, res) {
        const { id } = req.params;
        const obj = await PaisIso.findByPk(id, {include: {all:true, nested:true}});
        return obj;
    }

    static async create(req, res) {
        const { id, nome, sigla_iso2, sigla_iso3, ddi_telefone } = req.body;
        const obj = await PaisIso.create({id, nome, sigla_iso2, sigla_iso3, ddi_telefone});
        return await PaisIso.findByPk(obj.id, {include: { all:true, nested: true}});
    }

    static async update(req, res) {
        const { id } = req.params;
        const { nome, sigla_iso2, sigla_iso3, ddi_telefone } = req.body;
        const obj = await PaisIso.findByPk(id, {include: {all: true, nested: true } });
        if (obj == null) throw 'Uf não encontrada!';
        Object.assign(obj, {nome, sigla_iso2, sigla_iso3, ddi_telefone});
        return await obj.save();
    }

    static async delete(req, res) {
        const { id } = req.params;
        const obj = await PaisIso.findByPk(id);
        if (obj == null) throw 'Uf não encontrada!';
        try {
            await obj.destroy();
            return obj;
        } catch(erro) {
            throw "Não e possível remover uma UF que possui cidades";
        }
    }

}

export {PaisService}