import { News } from "../models/News.js";
import newsService from "../services/newsService.js";



class newsController {
    async getNews(req,res) {
        try {
            const {limit, page} = req.body;
            const news = await News.find({});
            return res.json(news);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }

    async updateNews(req,res) {
        try {
            await newsService.syncNews();
            return res.status(200);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }

    async syncNews(req, res) {
        try {
            await newsService.syncNews();
            return res.status(200);
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

export default new newsController();