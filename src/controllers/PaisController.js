import { PaisService } from "../services/PaisService.js";

class PaisController {
    
    static async findAll(req, res) {
        console.log("findall");
        PaisService.findAll()
            .then(objs => res.json(objs))
            .catch(err => res.status(400).json({ err }));
    }

    static async findByPk(req, res) {
        PaisService.findByPk(req)
         .then(objs => res.json(objs))
         .catch(err => res.status(400).json({ err }));
    }

    static async create(req, res) {
        PaisService.create(req)
        .then(objs => res.json(objs))
        .catch(err => res.status(400).json({ err }));
    }

    static async update(req, res) {
        PaisService.update(req)
        .then(obj => res.json(obj))
        .catch(err => res.status(400).json({ err }));
    }

    static async delete(req, res) {
        PaisService.delete(req)
        .then(obj => res.json(obj))
        .catch(err => res.status(400).json({ err }));
    }

}

export { PaisController }