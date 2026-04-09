import express from "express";

import { PaisController } from './controllers/PaisController.js';

const routes = express.Router();

routes.get('/pais', PaisController.findAll);
routes.get('/pais/:id', PaisController.findByPk);
routes.post('/pais', PaisController.create);
routes.put('/pais/:id', PaisController.update);
routes.delete('/pais/:id', PaisController.delete);

export default routes;