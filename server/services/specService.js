import  puppeteer  from "puppeteer";
import cherio from 'cherio';
import config from 'config';
import needle from 'needle';
import { Speciality } from "../models/Speciality.js";

class SpecService {
    syncSpecs() {
        return new Promise((async (resolve, reject) => {
            try {
                const pageContent = await needle("get", config.get('specsURL'));
                const $1 = cherio.load(pageContent.body, { decodeEntities: false });
                const specsURL = [];
                $1('.spec-name-block')
                .filter((i, el) => $1(el).html().includes("04"))
                .filter((i, el) => {
                    return $1(el).next().find(".spec-sub-block").html()})
                .each((i, el) => {
                    specsURL.push({url: $1(el).find('.formitem_spec_name').attr('href'), name: $1(el).next().find(".spec-sub-block").html()});
                });            
                specsURL.forEach(async elem => {
                    const specInfo = {  exams: [], 
                        passingScore: {}, 
                        subjects: [], 
                        studentPublications: [], 
                        graduationsThemes: [],
                        activeTeachers: [],
                        programRelevance: [],
                        employment: [],
                        documents: []};
                    const browser = await puppeteer.launch();    
                    const page = await browser.newPage();
                    await page.goto(elem.url);
                    await page.click('#link1_doc > a');
                    await page.waitForSelector('#more_doc', {visible: true});
                    await page.click('#link1_disc > a');
                    await page.waitForSelector('#more_disc', {visible: true});
                    await page.click('#link1_thesis > a');
                    await page.waitForSelector('#more_thesis', {visible: true});
                    await page.click('#link1_publ > a');
                    await page.waitForSelector('#more_publ', {visible: true});
                    const content = await page.content();
                    const $ = cherio.load(content, { decodeEntities: false });
                    specInfo.area = $('body > div.page-wrapper > div > main > p:nth-child(5)').text().replace('Направление:', '').trim();
                    specInfo.name = $('body > div.page-wrapper > div > main > p:nth-child(6)').text().replace('Профиль:', '').trim().toLowerCase();
                    const textNodes = $("body > div.page-wrapper > div > main")
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
                    if (el.data.toLowerCase().includes('cтоимость обучения')){
                        
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
                    $('#more_doc > a').each((i,el) => {
                        specInfo.documents.push({name: $(el).text(), url: $(el).attr('href')});
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
                    $('body > div.page-wrapper > div > main').contents().each((i,el) => {
                                                                            
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
                    const spec = new Speciality(specInfo);                                                               
                    const specExists = await Speciality.findOne({name: elem.name.trim().toLowerCase()}).exec();
                    if (specExists == null) {
                        await spec.save();
                        console.log("Сохранено");
                    } else {
                        await Speciality.updateOne({_id: specExists._id},{ $set: specInfo});
                        console.log("Обновлено");
                    }                                                 
                    await browser.close();   
                    console.log("Закрыто");})
                     
                resolve({message: "Succesful parsing"})
                
            } catch (error) {
                console.log(error);
                return reject({message: "Error occured with specs!"});
            }
        })) 
    }
}

export default new SpecService();