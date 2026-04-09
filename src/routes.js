import express from "express";

import { PaisController } from './controllers/PaisController.js';
import { HospedeController } from "./controllers/HospedeController.js";
import { TipoDeQuartoController } from "./controllers/TipoDeQuartoController.js";

const routes = express.Router();

// routes hospedes Tracy
routes.get('/hospede', HospedeController.findAll);
routes.get('/hospede/:id', HospedeController.findByPk);
routes.get('/hospede/estado/:id', HospedeController.findByEstado);
routes.post('/hospede', HospedeController.create);
routes.put('/hospede/:id', HospedeController.update);
routes.delete('/hospede/:id', HospedeController.delete);

// routes tipos de quarto Tracy
routes.get('/tipo-de-quarto', TipoDeQuartoController.findAll);
routes.get('/tipo-de-quarto/:id', TipoDeQuartoController.findByPk);
routes.post('/tipo-de-quarto', TipoDeQuartoController.create);
routes.put('/tipo-de-quarto/:id', TipoDeQuartoController.update);
routes.delete('/tipo-de-quarto/:id', TipoDeQuartoController.delete);

routes.get('/pais', PaisController.findByPk);
routes.get('/pais/:id', PaisController.findByPk);
routes.post('/pais', PaisController.create);
routes.put('/pais/:id', PaisController.update);
routes.delete('/pais/:id', PaisController.delete);

export default routes;