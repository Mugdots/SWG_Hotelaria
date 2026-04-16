import { FuncionarioService } from "../services/FuncionarioService.js";

class FuncionarioController {

    static async findAll(req, res) {
        FuncionarioService.findAll()
            .then(objs => res.json(objs))
            .catch(err => res.status(400).json({ err }));;
    }

    static async findByPk(req, res) {
        FuncionarioService.findByPk()
            .then(objs => res.json(objs))
            .catch(err => res.status(400).json({ err }));;
    }

    static async create(req, res) {
        FuncionarioService.create()
            .then(objs => res.json(objs))
            .catch(err => res.status(400).json({ err }));;
    }

    static async update(req, res) {
        FuncionarioService.update()
            .then(objs => res.json(objs))
            .catch(err => res.status(400).json({ err }));;
    }

    static async delete(req, res) {
        FuncionarioService.delete()
            .then(objs => res.json(objs))
            .catch(err => res.status(400).json({ err }));;
    }
}

export { FuncionarioController }