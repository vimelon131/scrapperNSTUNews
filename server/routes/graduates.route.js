import { Router } from "express";
import graduatesController from "../controllers/graduatesController.js";


const routerGraduates = new Router();

routerGraduates.get('/graduates', graduatesController.getGraduates);
routerGraduates.post('/syncGraduates', graduatesController.syncGraduates);

export default routerGraduates;