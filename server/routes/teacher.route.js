import { Router } from "express";
import teacherController from "../controllers/teachersController.js";


const routerTeacher = new Router();

routerTeacher.get('/teachers', teacherController.getTeachers);
routerTeacher.post('/syncTeachers', teacherController.syncTeachers);

export default routerTeacher;