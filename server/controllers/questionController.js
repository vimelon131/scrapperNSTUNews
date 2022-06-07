import questionService from "../services/questionService.js";
import { Question } from "../models/Queistion.js";

class questionController {
    async getQuestions(req, res) {
        try {
            const questions = await Question.find({});
            return res.json(questions);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }
    async addQuestion(req, res) {
        try {
            const {name, answer, date, mail} = req.body;
            await questionService.addQuestion(name, answer, date, mail);
            return res.json(200);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e);
        }
    }
}

export default new questionController();