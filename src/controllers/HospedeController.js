import { HospedeService } from "../services/HospedeService";

class HospedeController {
    
    static async findAll(req, res, next) {    
        HospedeService.findAll()
            .then(objs => res.json(objs))
            .catch(next);
    }   

    static async findByPk(req, res, next) {
        HospedeService.findByPk(req)
         .then(objs => res.json(objs))
         .catch(next);
    }

    static async findByEstado(req, res, next) {
        HospedeService.findByEstado(req)
         .then(objs => res.json(objs))
         .catch(next);
    }

    static async create(req, res, next) {
        HospedeService.create(req)
        .then(objs => res.json(objs))
        .catch(next);
    }

    static async update(req, res, next) {
        HospedeService.update(req)
        .then(obj => res.json(obj))
        .catch(next);
    }

    static async delete(req, res, next) {
        HospedeService.delete(req)
        .then(obj => res.json(obj))
        .catch(next);
    }       

}

export { HospedeController }