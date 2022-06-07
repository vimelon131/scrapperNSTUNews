import { Teacher } from "../models/Teacher.js";
import teacherService from "../services/teacherService.js";

class teacherController {
    async getTeachers(req,res) {
        try {
            const teachers = await Teacher.find({});
            return res.json(teachers);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }

    async syncTeachers(req,res) {
        try {
            await teacherService.syncTeachers();
            return res.json(200);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }

    async addNews(req, res) {
        try {

        } catch(e) {

        }
    }
    async syncAllSpecs(req,res) {
        try {

        } catch(e) {

        }
    }
    async addTraceSpec(req, res) {
        try {

        } catch(e) {

        }
    }
}

export default new teacherController();