import express from "express";

import { PaisController } from './controllers/PaisController.js';
import { HospedeController } from "./controllers/HospedeController.js";
import { TipoDeQuartoController } from "./controllers/TipoDeQuartoController.js";
import { ReservaController } from './controllers/ReservaController.js';
import { FuncionarioController } from "./controllers/FuncionarioController.js";
import { EstadoController } from './controllers/EstadoController.js';
import { QuartoController } from './controllers/QuartoController.js';
import { EstadiaController } from './controllers/EstadiaController.js';

const routes = express.Router();

// routes tipos de quarto Tracy
routes.get('/tipo-de-quarto', TipoDeQuartoController.findAll);
routes.get('/tipo-de-quarto/:id', TipoDeQuartoController.findByPk);
routes.post('/tipo-de-quarto', TipoDeQuartoController.create);
routes.put('/tipo-de-quarto/:id', TipoDeQuartoController.update);
routes.delete('/tipo-de-quarto/:id', TipoDeQuartoController.delete);

// routes hospedes Tracy
routes.get('/hospede', HospedeController.findAll);
routes.get('/hospede/:id', HospedeController.findByPk);
routes.get('/hospede/estado/:id', HospedeController.findByEstado);
routes.post('/hospede', HospedeController.create);
routes.put('/hospede/:id', HospedeController.update);
routes.delete('/hospede/:id', HospedeController.delete);

// routes reservas Tracy
routes.get('/reserva', ReservaController.findAll);
routes.get('/reserva/:id', ReservaController.findByPk);
routes.post('/reserva', ReservaController.create);
routes.put('/reserva/:id', ReservaController.update);
routes.delete('/reserva/:id', ReservaController.delete);
routes.get('/reserva/hospede/:hospedeId', ReservaController.findByHospede);
routes.get('/reserva/tipo/:tipoDeQuartoId', ReservaController.findByTipoDeQuarto);
routes.post('/reserva/confirmar-automaticas', ReservaController.confirmarReservasAutomaticas);

routes.get('/funcionario', FuncionarioController.findAll);
routes.get('/funcionario/:id', FuncionarioController.findByPk);
routes.post('/funcionario', FuncionarioController.create);
routes.put('/funcionario/:id', FuncionarioController.update);
routes.delete('/funcionario/:id', FuncionarioController.delete);

routes.get('/pais', PaisController.findAll);
routes.get('/pais/:id', PaisController.findByPk);
routes.post('/pais', PaisController.create);
routes.put('/pais/:id', PaisController.update);
routes.delete('/pais/:id', PaisController.delete);

routes.get('/estado', EstadoController.findAll);
routes.get('/estado/:id', EstadoController.findByPk);
routes.post('/estado', EstadoController.create);
routes.put('/estado/:id', EstadoController.update);
routes.delete('/estado/:id', EstadoController.delete);

routes.get('/quarto', QuartoController.findAll);
routes.get('/quarto/:id', QuartoController.findByPk);
routes.post('/quarto', QuartoController.create);
routes.put('/quarto/:id', QuartoController.update);
routes.delete('/quarto/:id', QuartoController.delete);

routes.get('/estadia', EstadiaController.findAll);
routes.get('/estadia/:id', EstadiaController.findByPk);
routes.post('/estadia', EstadiaController.create);
routes.put('/estadia/:id', EstadiaController.update);
routes.delete('/estadia/:id', EstadiaController.delete);

export default routes;