import { Speciality } from "../models/Speciality.js";
import specService from "../services/specService.js";

class specsController {
    async getSpecs(req,res) {
        try {
            const specs = await Speciality.find({});
            return res.json(specs);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }

    async updateSpecs(req,res) {
        try {
            const {id, ...info} = req.body;
            await Speciality.updateOne({_id: id, ...info})
            return res.json(200);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }

    async syncSpecs(req, res) {
        try {
            await specService.syncSpecs();
            return res.json(200);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
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

export default new specsController();