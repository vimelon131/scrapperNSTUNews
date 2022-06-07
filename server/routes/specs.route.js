import { Router } from "express";
import specsController from "../controllers/specsConstroller.js";


const routerSpec = new Router();

routerSpec.get('/specs', specsController.getSpecs);
routerSpec.post('/syncSpecs', specsController.syncSpecs);
routerSpec.post('/updateSpecs', specsController.updateSpecs);
export default routerSpec;