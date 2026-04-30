import { ReservaService } from "../services/ReservaService.js";

class ReservaController {

  static async findAll(req, res, next) {
    ReservaService.findAll()
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    ReservaService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    ReservaService.create(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    ReservaService.update(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    ReservaService.delete(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async findByHospede(req, res, next) {
    ReservaService.findByHospede(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findByTipoDeQuarto(req, res, next) {
    ReservaService.findByTipoDeQuarto(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async confirmarReservasAutomaticas(req, res, next) {
    ReservaService.confirmarReservasAutomaticas()
      .then(result => res.json(result))
      .catch(next);
  }
}

export { ReservaController }