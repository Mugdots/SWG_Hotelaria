import { Funcionario } from "../models/Funcionario.js";

class FuncionarioService {
    static async findAll() {
        const obj = await Funcionario.findAll({include: {all:true, nested:true}});
        return obj;
    }

    static async findByPk(req, res) {
        const { id } = req.params;
        const obj = await Funcionario.findByPk(id, {include: {all:true, nested:true}});
        return obj
    }

    static async create(req, res) {
        const { nome, data_nascimento, cpf, bairro, cidade, rua, telefone, login, senha, paisiso} = req.body;
        const obj = await Funcionario.create({id, nome, data_nascimento, cpf, bairro, cidade, rua, telefone, login, senha, paisiso});
        return await Funcionario.findByPk(obj.id, {include: {all:true, nested:true}});
    }

    static async update(req, res) {
        const { id } = req.params;
        const { nome, data_nascimento, cpf, bairro, cidade, rua, telefone, login, senha, paisiso} = req.body;
        const obj = await Funcionario.findByPk(id, {include: {all:true, nested:true }});
        if (obj == null) throw 'Funcionário não encontrado!';
        Object.assign(obj, {nome, data_nascimento, cpf, bairro, cidade, rua, telefone, login, senha, paisiso});
        return await obj.save();
    }

    static async delete(req, res) {
        const { id } = req.params;
        const obj = await Funcionario.findByPk(id);
        if (obj == null) throw 'Funcionário não encontrado';
        try {
            await obj.destroy();
            return obj;
        } catch(erro) {
            throw 'Não e possível remover um País que possui estados';
        }
    }
}

export {FuncionarioService}