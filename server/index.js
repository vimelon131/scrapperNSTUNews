import cherio from 'cherio';
import queue from 'async/queue.js';
import chalk from 'chalk';
import listPageHandler from './handlers/newsHandler.js';
import { getLastPage } from './helpers/getLastPage.js';
import needle from 'needle';
import mongoose from "mongoose";
import config from 'config';


const newsPageUrl = 'https://www.nstu.ru/news?page=';
const adsPageUrl = 'https://www.nstu.ru/announcements?page=';
const pages = 1;

const concurrency = 2;
const startTime = new Date();


export const taskQueue = queue(async (task, done) => {
    try {
        await task();
        console.log(chalk.bold.magenta('Task completed, tasks left: ' + taskQueue.length() + '\n'));
        // done(null); 
    } catch (err) {
        throw err;
    }
}, concurrency);


taskQueue.drain(function() {
    const endTime = new Date();
    console.log(chalk.green.bold(`🎉  All items completed [${(endTime - startTime) / 1000}s]\n`));
    process.exit();
});

async function updateAllNews() {
    await getNews();
    await getSliders();
    await getAds();
}

async function getAds() {
    try {
        const lastPage = await getLastPage(`${adsPageUrl}1`);
        for (let i = 1; i <= lastPage;i++){
            const url = `${adsPageUrl}${i}`;
            taskQueue.push(
                () => listPageHandler(url), 
                (err) => {
                    if (err) {
                        console.log(err);
                        //throw new Error('Error getting data from page#' + i);
                    }
                    console.log(chalk.green.bold(`Completed getting data from page#${i}\n`));
                }
            );
        }
    } catch (error) {
        console.log(error);
    }
}

async function getSliders() {

}

async function getNews() {
    try {
        await mongoose.connect(config.get('mongoURI'));
        const lastPage = await getLastPage(`${newsPageUrl}1`);
        for (let i = 1; i <= lastPage;i++){
            const url = `${newsPageUrl}${i}`;
            taskQueue.push(
                () => listPageHandler(url), 
                (err) => {
                    if (err) {
                        console.log(err);
                        //throw new Error('Error getting data from page#' + i);
                    }
                    console.log(chalk.green.bold(`Completed getting data from page#${i}\n`));
                }
            );
        }
    } catch (error) {
        console.log(error);
    }
};

async function getSpec() {
    
}

