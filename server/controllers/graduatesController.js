import graduateService from "../services/graduateService.js";
import { Graduate } from "../models/Graduates.js";

class graduatesController {
    async getGraduates(req, res) {
        try {
            const graduates = await Graduate.find({});
            return res.json(graduates);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }
    async syncGraduates(req, res) {
        try {
            await graduateService.syncGraduates();
            return res.json(200);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e);
        }
    }
}

export default new graduatesController();