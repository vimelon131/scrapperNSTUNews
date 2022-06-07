import express from "express";
import config from 'config';
import mongoose from "mongoose";
import routerNews  from "./routes/news.route.js";
import routerSpec from "./routes/specs.route.js";
import cors from "./middleware/cors.middleware.js";
import routerTeacher from "./routes/teacher.route.js";
import routerGraduates from "./routes/graduates.route.js";
import routerQuestion from "./routes/question.route.js";


const app = express();
const PORT = config.get('port') || 5000;

app.use(cors);
app.use(express.json())
app.use('/api',routerNews);
app.use('/api',routerSpec);
app.use('/api',routerTeacher);
app.use('/api',routerGraduates);
app.use('/api',routerQuestion);

process.on('uncaughtException', (err) => {
    console.error(err);
});

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