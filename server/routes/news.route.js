import { Router } from "express";
import newsController from "../controllers/newsController.js";


const routerNews = new Router();

routerNews.get('/news', newsController.getNews);
routerNews.post('/syncNews', newsController.syncNews);

export default routerNews;