import cherio from 'cherio';
import { taskQueue } from '../index.js';
import chalk from 'chalk';
import needle from 'needle';

export async function getLastPage(url) {
    const res = await needle("get", url);
    const $ = cherio.load(res.body);
    const regEx = /[1-9]\w*/g;
    const lastPageLink = $('.lineLink').last().attr('href');
    const lastPage = lastPageLink.match(regEx);
    return lastPage;
};


