import {OrdemLimpeza} from '../models/OrdemLimpeza.js';
import { FuncionarioService } from './FuncionarioService.js';
import { QuartoService } from './QuartoService.js';

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
        const { status, observacao, inicio, fim, funcionarioId, quartoId } = req.body;
        if (await this.verificarRegrasDeNegocio(req)) {
            const obj = await OrdemLimpeza.create({status, observacao, inicio, fim, funcionarioId: funcionarioId.id, quartoId: quartoId.id});
            return await OrdemLimpeza.findByPk(obj.id, {include: { all:true, nested: true}});
        }
    }


    static async verificarRegrasDeNegocio(req) {
        const {status, funcionarioId, quartoId} = req.body;
        if (funcionarioId == null) throw 'Funcionário deve ser preenchido!';
        if (quartoId == null) throw 'Quarto deve ser preenchido!';

        const quarto = QuartoService.findByPk(quartoId);
        const funcionario = FuncionarioService.findByPk(funcionarioId);
        
        // Regra de Negocio 1: O sistema não deverá permitir abrir uma ordem se o Quarto já estiver uma outra ordem de limpeza não concluída.
        const ordemQuarto = OrdemLimpeza.findByQuarto(quarto);
        let ordemAndamento = false;
        for (let ordemlimpeza of ordemQuarto) {
            if (ordemlimpeza.status == "Andamento") {
                ordemAndamento = true;
            }
        }
        if (ordemAndamento) throw 'Existe uma outra Ordem de Limpeza que está em andamento nesse quarto no momento';
        


        // Regra de Negocio 2: O sistema não deverá permitir abrir uma ordem de limpeza caso o funcionário esteja fazendo uma outra ordem de limpeza
        const ordemFuncionario = OrdemLimpeza.findByFuncionario(funcionario);
        let ordemFuncionarioOcupados = false;
        for (let ordemlimpeza of ordemFuncionario) {
            if (ordemlimpeza.status == "Andamento") {
                ordemFuncionarioOcupados = true;
            }
        }
        if (status == "Não Concluido") {
            ordemFuncionarioOcupados = true;
        }
        if (ordemFuncionarioOcupados) throw 'Funcionário está ocupado em outra ordem de limpeza';


        // Regra de Negocio 3: O quarto que estiver com a classificação “ocupado” deve não pode ser escolhido entre os quartos disponíveis.
        let quartoNaoLimpar = false;
        if (quarto.status_quarto == 'Ocupado') {
            quartoNaoLimpar = true;
        } 
        if (quartoNaoLimpar) throw 'Quarto está ocupado, não e possível fazer uma ordem de limpeza';
    }




// RN05: O sistema deve finalizar todas ordens de limpezas que não foram concluídas no final do expediente, às 19 horas.
// RN06: O sistema deve verificar quem concluiu a ordem de limpeza possui permissão de Gerente e ou é a mesma conta de funcionário que tenha registrado a ordem de limpeza. UPDATE

    static async update(req, res) {
        const { id } = req.params;
        const { id, status, observacao, inicio, fim, funcionarioId, quartoId } = req.body;
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