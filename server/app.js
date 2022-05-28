import express from "express";
import config from 'config';
import mongoose from "mongoose";
import { routerNews } from "./routes/news.route.js";
const app = express();
const PORT = config.get('port') || 5000;

app.use(express.json())

app.use('/api',routerNews);

const start = async () => {
    try {
        await mongoose.connect(config.get('mongoURI'));

        app.listen(PORT, () => {
            console.log(`Server working on port ${PORT}`)
        })

    } catch(e) {
        console.log(e)
    }
}

start()