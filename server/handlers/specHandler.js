import  puppeteer  from "puppeteer";
import config from 'config';
import cherio from 'cherio';
import needle from 'needle';
import { Speciality } from "../models/Speciality.js";
import mongoose from "mongoose";


const specsUrl = "https://www.nstu.ru/entrance/entrance_all/magistracy"//config.get('specsURL');

async function getSpec(specName) {
    const specInfo = {  exams: [], 
                        passingScore: {}, 
                        subjects: [], 
                        studentPublications: [], 
                        graduationsThemes: [],
                        activeTeachers: [],
                        programRelevance: [],
                        employment: []};
    await mongoose.connect("mongodb://localhost:27017/nstuDB");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(specsUrl);
    let specs = cherio.load(content, { decodeEntities: false });
    await page.click('div.price__faculties > div > div:nth-child(1) > a:nth-child(1)');
    await page.waitForSelector('.price__content', {visible: true});
    await page.click('body > div.page-wrapper > div > main > div.price > div.price__content.js-price-content.is-load > div.price__content-table > div:nth-child(3) > div:nth-child(3) > p > strong > a');
    await page.waitForSelector('.popup', {visible: true});
    await page.click('#link1_disc > a');
    await page.waitForSelector('#more_disc', {visible: true});
    await page.click('#link1_thesis > a');
    await page.waitForSelector('#more_thesis', {visible: true});
    await page.click('#link1_publ > a');
    await page.waitForSelector('#more_publ', {visible: true});
    const content = await page.content();
    const $ = cherio.load(content, { decodeEntities: false });
    specInfo.area = $('div.popup__dynamic-content > p:nth-child(3)').text().replace('Направление:', '').trim();
    specInfo.name = $('div.popup__dynamic-content > p:nth-child(4)').text().replace('Профиль:', '').trim();
    const textNodes = $("#popup-price-1 > div > div > div > div.popup__dynamic-content")
                                                                                    .contents()
                                                                                    .filter(function () {
                                                                                        return this.type === "text";
                                                                                    });
     
    textNodes.each((i, el) => {
        if (el.data.trim().match(/\w/)){
            if (el.data.toLowerCase().includes('бюджетных')){
                specInfo["budget"] = el.data.match(/\d+/)[0];
            }
            if (el.data.toLowerCase().includes('контрактных')){
                specInfo["contract"] = el.data.match(/\d+/)[0];
            }
            if (el.data.toLowerCase().includes('стоимость обучения')){
                specInfo["cost"] = el.data.match(/\d+/g)[1];
            }
            if (el.data.toLowerCase().includes('на бюджет')){
                specInfo.passingScore.budget = el.data.match(/\d+,\d+/g)[0];
            }
            if (el.data.toLowerCase().includes('на контракт')){
                specInfo.passingScore.contract = el.data.match(/\d+,\d+/g)[0];
            }
        }
        if (!el.data.trim().match(/\s/)){
            if (el.data.trim().match(/\D+/)){
                specInfo["exams"].push(el.data.trim());
            }
        }
    });
    $('#more_disc > ul > li').each((i,el) => {
        specInfo.subjects.push($(el).text());
    });
    $('#more_publ > ul > li').each((i,el) => {
        specInfo.studentPublications.push($(el).text());
    });
    $('#more_thesis > ul > li').each((i,el) => {
        specInfo.graduationsThemes.push($(el).text());
    });
    $('#more_prep > ul > li > a').each((i,el) => {
        specInfo.activeTeachers.push({name: $(el).text(), site: $(el).attr('href')});
    });
    let parseAct = false;
    let parseEmp = false;
    $('#popup-price-1 > div > div > div > div.popup__dynamic-content').contents().each((i,el) => {
                                                                        
                                                                                    if (el.type === "text") {
                                                                                        if (parseAct) {
                                                                                            if ($(el).text().trim() != '') {
                                                                                                specInfo.programRelevance.push($(el).text())
                                                                                            }
                                                                                        } else if (parseEmp) {
                                                                                            if ($(el).text().trim() != '') {
                                                                                                specInfo.employment.push($(el).text())
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    if ($(el).text().includes('Трудоустройство')) {
                                                                                        parseAct = false;
                                                                                        parseEmp = true;
                                                                                    }
                                                                                    if ($(el).text().includes('Основные дисциплины')) {
                                                                                        parseEmp = false;
                                                                                    }
                                                                                    if ($(el).text().includes('Актуальность программы')) {
                                                                                        parseAct = true;
                                                                                    }
                                                                                });
    specInfo.programRelevance = specInfo.programRelevance.join('');
    specInfo.employment = specInfo.employment.join('');
    const spec = new Speciality(specInfo);
      
    const specExists = await Speciality.findOne({name: "Компьютерное моделирование систем"}).exec();    
    if (specExists == null) {
        await spec.save();
        console.log("Сохранено");
    } else {
        await Speciality.updateOne(specExists, specInfo);
        console.log("Обновлено");
    }                                                 
    await browser.close();
    console.log("Закрыто");
}

async function syncAllSpecs() {
    
}

await getSpec();

export default getSpec;