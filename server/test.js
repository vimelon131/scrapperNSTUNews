
import needle from 'needle';
import  puppeteer  from "puppeteer";
import config from 'config';
import cherio from 'cherio';
import mongoose from "mongoose";
import { Speciality } from "./models/Speciality.js";


async function getNewsContent(newsData) {
    try {
        const pageContent = await needle("get", `https://www.nstu.ru/news/news_more?idnews=139128`);
        const $ = cherio.load(pageContent.body, { decodeEntities: false });
        const result = [];
        const fotorama = $("div .fotorama");
        fotorama.children().each((i, el) => {
            result.push($(el).attr('src'));
        })
        // console.log(fotorama.attr('class'));
        // console.log(fotorama.filter($('div.fotorama__wrap fotorama__wrap--css3 fotorama__wrap--slide fotorama__wrap--toggle-arrows fotorama__wrap--no-controls')).length);//.find('img').each((i,el) => {
        // //     console.log($(el).attr('src'));
        // }));
        
        console.log(result);
    } catch (err) {
        throw err;
    }
}
function contentChecker(text) {
    const textLW = text.toLowerCase();
    const keyWords = ['автф', 'магистратура', 'партнерами'];
    keyWords.forEach(el => {
        console.log(el)
        const a = 'автф'.includes('автф');
        console.log(a)
        if (a) {
            console.log('asd')
            return true;
        }
    })
    return false;
}
const specsUrl = "https://www.nstu.ru/entrance/entrance_all/magistracy"

async function testSpec() {
    const pageContent = await needle("get", `https://ciu.nstu.ru/kaf/asu/study_activity/specs/`);
    const $1 = cherio.load(pageContent.body, { decodeEntities: false });
    const specsURL = [];
    $1('.spec-name-block')
    .filter((i, el) => $1(el).html().includes("04"))
    .filter((i, el) => {
        return $1(el).next().find(".spec-sub-block").html()})
    .each((i, el) => {
        specsURL.push({url: $1(el).find('.formitem_spec_name').attr('href'), name: $1(el).next().find(".spec-sub-block").html()});
    });   
                      
    await mongoose.connect("mongodb://localhost:27017/nstuDB");
    const browser = await puppeteer.launch();
   console.log(specsURL)
    specsURL.forEach(async el => {
        const specInfo = {  exams: [], 
            passingScore: {}, 
            subjects: [], 
            studentPublications: [], 
            graduationsThemes: [],
            activeTeachers: [],
            programRelevance: [],
            employment: []};
            let page = await browser.newPage();
        await page.goto(el.url);
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
        const specExists = await Speciality.findOne({name: el.name.trim().toLowerCase()}).exec();
        console.log(specExists)    
        if (specExists == null) {
            await spec.save();
            console.log("Сохранено");
        } else {
            await Speciality.updateOne(specExists, specInfo);
            console.log("Обновлено");
        }                                                 
        await browser.close();
        console.log("Закрыто");  
    })
    
                 
}
// await getNewsContent();
// console.log(contentChecker(`<p class="text-lead"></p>,<strong>в среду, 18 мая, на левом берегу новосибирска студенты, сотрудники и выпускники нашего вуза отметили день нгту нэти. на праздник собралось больше 1000 гостей, которые приняли участие в конкурсах, ивентах и дискотеке.<br><br></strong><span style="font-size: 16px;">показываем, как это было, в ярких фотографиях </span><a href="https://vk.com/kostya.zhukov" target="_blank" rel="noopener" style="font-size: 16px;">константина жукова</a><span style="font-size: 16px;"> и </span><a href="https://vk.com/tumaevak" target="_blank" rel="noopener" style="font-size: 16px;">кристины тумаевой</a><span style="font-size: 16px;">. найти себя на фотографиях со дня нгту нэти можно </span><a href="https://vk.com/day_nstu" target="_blank" rel="noopener" style="font-size: 16px;">по этой ссылке</a><span style="font-size: 16px;">.<br><br></span><span style="font-size: 16px;">в этом году день нгту нэти был вдохновлен ценностями семьи, культуры и преемственности поколений, объединяющими студентов, сотрудников, выпускников вуза и жителей новосибирска.<br><br></span><span style="font-size: 16px;">за всю свою 72-летную историю университет выпустил более 200 000 специалистов самых разных профессий, которые работают теперь по всему миру! сейчас каждый четвертый новосибирец — выпускник нгту нэти! а родители, бабушки и дедушки абитуриентов с гордостью говорят: «я учился в нэти». семья — вот что действительно объединяет жителей города.<br><br></span><span style="font-size: 16px;">в этом празднике мы собрали несколько смыслов. один курс — это и целая поточка однокурсников, и общий путь технологического развития университета как лидера отраслей.<br><br></span><strong style="font-size: 16px;">партнерами дня нгту нэти выступили:</strong><span style="font-size: 16px;"> чебурекми, mirotel, эфиоп coffee, vr гравитация, pro-bor, усоц нгту нэти, фаер-шоу аврора, hobby games, max-bus, грильница, laser love, «совесть», сбер и «страна гулливерия».</span>'`))
// console.log('автф'.includes('автф'))
async function syncTech() {
    const pageContent = await needle("get", `https://ciu.nstu.ru/kaf/asu/about/persons`);
    const $ = cherio.load(pageContent.body, { decodeEntities: false });
    const teachers = [];
    const subjTemplates = "/edu_actions/pcources";
    const el = $('.row.as-table').each((i,el) => {
        const name = $(el).find('div:nth-child(1) > a').text();
        const url = $(el).find('div:nth-child(1) > a').attr('href');
        const job = $(el).find('div:nth-child(2)').text().trim();
        teachers.push({name, url, job});
    });
    teachers.forEach(async (el) => {
        let content = await needle("get", `${el.url}${subjTemplates}`);
        let $1 = cherio.load(content.body, { decodeEntities: false });
        const table = $1('#t1').find('tr');
        const teacher = {...el, subj: []};
        table.each((i,elem)=> {
            if ($(elem).find('td:nth-child(3)').text().trim() == "09.04.01" || $(elem).find('td:nth-child(3)').text().trim() == "09.04.03") {
                teacher.subj.push($(elem).find('td:nth-child(1)').text().trim());
            }
        })
        content = await needle("get", `${el.url}`);
        $1 = cherio.load(content.body, { decodeEntities: false });
        const imgTemp = "https://ciu.nstu.ru/kaf";
        teacher.img = imgTemp + $1('.contacts__card-image > img').attr("src");
        console.log(teacher.subj.length > 0 ? teacher : '')
    });
    // console.log(teachers);
}

async function syncG() {
    const pageContent = await needle("get", `https://www.nstu.ru/alumnus/success_stories`);
    const $ = cherio.load(pageContent.body, { decodeEntities: false });
    const graduates = [];
    $('.row.success-stories__story').each((i, el) => {
        const img = $(el).find('.success-stories__story-photo > img').attr('src');
        const name = $(el).find('.success-stories__story-header').text().trim();
        const graduationDate = $(el).find('.col-9 > div:nth-child(2) > b').text();
        const faculty = $(el).find('.col-9 > div:nth-child(3) > a').text();
        let job;
        $(el).find('.col-9').children().each((i, e) => {
            if ($(e).text().trim().includes('Место работы')) {
                job = $(e).find('b').text();
            }
        })
        const review = $(el).find('.success-stories__story-text').text();
        console.log({img, name, graduationDate, faculty, review, job});
    })
}

syncG();