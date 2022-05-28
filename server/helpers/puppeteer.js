import puppeteer from 'puppeteer';
import cherio from 'cherio';


export const PAGE_PUPPETEER_OPTS = {
    networdIdleTimeout: 5000,
    waitUntil: 'networkidle2',
    timeout: 30000000
};

// export class puppeteerHandler {
//     constructor() {
//         this.browser = null;
//     }

//     async initBrowser() {
//         this.browser = await puppeteer.launch();
//     }

//     closeBrowser() {
//         this.browser.close();
//     }

//     async getPageContent(url) {
//         if (!this.browser) {
//             await this.initBrowser();
//         }
//         try {
//             const page = await this.browser.newPage(PAGE_PUPPETEER_OPTS);
//             await page.goto(url, PAGE_PUPPETEER_OPTS);
//             const content = await page.content();
//             return content;
//         } catch (err) {
//             throw err;
//         }
//     }
// }