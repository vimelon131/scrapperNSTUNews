import  puppeteer  from "puppeteer";
import cherio from 'cherio';
import config from 'config';
import needle from 'needle';
import { Graduate } from "../models/Graduates.js";

class graduatesService {
    syncGraduates() {
        return new Promise((async (resolve, reject) => {
            try {
                const pageContent = await needle("get", `https://www.nstu.ru/alumnus/success_stories`);
                const $ = cherio.load(pageContent.body, { decodeEntities: false });
                const graduates = [];
                $('.row.success-stories__story').each(async (i, el) => {
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
                    const graduate = new Graduate({img, name, graduationDate, faculty, review, job});                                                               
                    const graduateExists = await Graduate.findOne({name: name.trim()}).exec();
                    if (graduateExists == null) {
                        await graduate.save();
                        console.log("Сохранено");
                    } else {
                        await Graduate.updateOne(graduateExists, {img, name, graduationDate, faculty, review, job});
                        console.log("Обновлено");
                    }       
                })
                    
                resolve({message: "Succesful parsing"})
            } catch (error) {
                console.log(error);
                return reject({message: "Error occured with !"});
            }
        })) 
    }
}

export default new graduatesService();