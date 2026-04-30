import { QuartoService } from "../services/QuartoService.js";

class QuartoController {

    static async findAll(req, res, next) {
        QuartoService.findAll()
            .then(objs => res.json(objs))
            .catch(next);
    }

    static async findByPk(req, res, next) {
        QuartoService.findByPk(req)
            .then(objs => res.json(objs))
            .catch(next);
    }

    static async create(req, res, next) {
        QuartoService.create(req)
            .then(objs => res.json(objs))
            .catch(next);
    }

    static async update(req, res, next) {
        QuartoService.update(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async delete(req, res, next) {
        QuartoService.delete(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

}

export { QuartoController }