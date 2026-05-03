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