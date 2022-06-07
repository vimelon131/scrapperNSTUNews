import { Router } from "express";
import questionController from "../controllers/questionController.js";


const routerQuestion = new Router();

routerQuestion.get('/question', questionController.getQuestions);
routerQuestion.post('/addQuestion', questionController.addQuestion);

export default routerQuestion;