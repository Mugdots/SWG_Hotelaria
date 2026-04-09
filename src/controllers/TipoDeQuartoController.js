import { TipoDeQuartoService } from "../services/TipoDeQuartoService";

class TipoDeQuartoController {

    static async findAll(req, res, next) {
        TipoDeQuartoService.findAll()
            .then(objs => res.json(objs))
            .catch(next);
    }

    static async findByPk(req, res, next) {
        TipoDeQuartoService.findByPk(req)
            .then(objs => res.json(objs))
            .catch(next);
    }

    static async create(req, res, next) {
        TipoDeQuartoService.create(req)
            .then(objs => res.json(objs))
            .catch(next);
    }

    static async update(req, res, next) {
        TipoDeQuartoService.update(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async delete(req, res, next) {
        TipoDeQuartoService.delete(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

}

export { TipoDeQuartoController }