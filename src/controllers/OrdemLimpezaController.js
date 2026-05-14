import { OrdemLimpezaService } from "../services/OrdemLimpezaService.js";

class OrdemLimpezaController {

    static async findAll(req, res, next) {
        OrdemLimpezaService.findAll()
            .then(objs => res.json(objs))
            .catch(next);
    }

    static async findByPk(req, res, next) {
        OrdemLimpezaService.findByPk(req)
            .then(objs => res.json(objs))
            .catch(next);
    }

    static async findByFuncionario(req, res, next) {
        OrdemLimpezaService.findByFuncionario(req)
            .then(objs => res.json(objs))
            .catch(next);
    }

    static async findByQuarto(req, res, next) {
        OrdemLimpezaService.findByQuarto(req)
            .then(objs => res.json(objs))
            .catch(next);
    }

    static async findByQuartoAndFuncionarioAndPeriodo(req) {
        OrdemLimpezaService.findByQuartoAndFuncionarioAndPeriodo(req)
        .then(objs => res.json(objs))
        .catch(next);
    }

    static async findByQuartoAndPeriodo(req, res, next) {
        OrdemLimpezaService.findByQuartoAndPeriodo(req)
        .then(objs => res.json(objs))
        .catch(next);
    }

    static async findByFuncionarioAndPeriodo(req, res, next) {
        OrdemLimpezaService.findByFuncionarioAndPeriodo(req)
        .then(objs => res.json(objs))
        .catch(next);
    }

    static async contadorByFuncionarioAndPeriodo(req, res, next) {
        OrdemLimpezaService.contadorByFuncionarioAndPeriodo(req)
        .then(objs => res.json(objs))
        .catch(next);
    }

    static async create(req, res, next) {
        OrdemLimpezaService.create(req)
            .then(objs => res.json(objs))
            .catch(next);
    }

    static async update(req, res, next) {
        OrdemLimpezaService.update(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async delete(req, res, next) {
        OrdemLimpezaService.delete(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

}

export { OrdemLimpezaController }