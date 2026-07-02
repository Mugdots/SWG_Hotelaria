import { PaisService } from "../services/PaisService.js";

class PaisController {

    static async findAll(req, res, next) {
        PaisService.findAll()
            .then(objs => res.json(objs))
            .catch(next);
    }

    static async findByPk(req, res, next) {
        PaisService.findByPk(req)
            .then(objs => res.json(objs))
            .catch(next);
    }

    static async create(req, res, next) {
        PaisService.create(req)
            .then(objs => res.json(objs))
            .catch(next);
    }

    static async update(req, res, next) {
        PaisService.update(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async delete(req, res, next) {
        PaisService.delete(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

}

export { PaisController }