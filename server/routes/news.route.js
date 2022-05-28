import { Router } from "express";
import {News} from '../models/News.js';
export const routerNews = new Router();


routerNews.get('/news', async (req, res) => {
    try {
        const arr = await News.find({}).limit(4);
        res.json(arr)
    } catch(e) {
        console.log(e)
    }
})