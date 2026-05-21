import { EstadiaService } from "../services/EstadiaService.js";

class EstadiaController {

    static async findAll(req, res, next) {
        EstadiaService.findAll()
            .then(objs => res.json(objs))
            .catch(next);
    }

    static async findByPk(req, res, next) {
        EstadiaService.findByPk(req)
            .then(objs => res.json(objs))
            .catch(next);
    }

    static async create(req, res, next) {
        EstadiaService.create(req)
            .then(objs => res.json(objs))
            .catch(next);
    }

    static async update(req, res, next) {
        EstadiaService.update(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async delete(req, res, next) {
        EstadiaService.delete(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async getRelatorioLucroEstadiaPorPeriodo(req, res, next) {
        EstadiaService.getRelatorioLucroEstadiaPorPeriodo(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async getRelatorioProcedenciaGeografica(req, res, next) {
        EstadiaService.getRelatorioProcedenciaGeografica(req)
            .then(obj => res.json(obj))
            .catch(next);
    }
}

export { EstadiaController }