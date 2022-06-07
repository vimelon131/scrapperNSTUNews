import  puppeteer  from "puppeteer";
import cherio from 'cherio';
import config from 'config';
import needle from 'needle';
import { News } from "../models/News.js";
import queue from 'async/queue.js';
import listPageHandler from "../handlers/newsHandler.js";
import { getLastPage } from "../helpers/getLastPage.js";
import chalk from "chalk";

const concurrency = 2;
export const taskQueue = queue(async (task, done) => {
    try {
        await task();
        console.log(chalk.bold.magenta('Task completed, tasks left: ' + taskQueue.length() + '\n'));
    } catch (err) {
        throw err;
    }
}, concurrency);

// taskQueue.drain(function() {
//     const endTime = new Date();
//     console.log(chalk.green.bold(`🎉  All items completed [${(endTime - startTime) / 1000}s]\n`));
// });

class newsService {
    syncNews() {
        return new Promise((async (resolve, reject) => {
            try {
                await News.deleteMany({});
                for (let i = 1;i <=2; i++){
                    let pageURL;
                    switch (i) {
                        case 1:
                            pageURL = config.get('newsURL');
                            break;
                        case 2:
                            pageURL = config.get('adsURL');
                            break;
                    }
                    const lastPage = await getLastPage(`${pageURL}1`);
                    for (let i = 1; i <= lastPage;i++){
                        const url = `${pageURL}${i}`;
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
                }
                resolve({message: "Succesful parsing"})
            } catch (error) {
                console.log(error);
                return reject({message: "Error occured with !"});
            }
        })) 
    }
}

export default new newsService();