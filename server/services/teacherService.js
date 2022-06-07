import  puppeteer  from "puppeteer";
import cherio from 'cherio';
import config from 'config';
import needle from 'needle';
import { Teacher } from "../models/Teacher.js";

class teacherService {
    syncTeachers() {
        return new Promise(async (resolve, reject) => {
            try {
                const pageContent = await needle("get", `https://ciu.nstu.ru/kaf/asu/about/persons`);
                const $ = cherio.load(pageContent.body, { decodeEntities: false });
                const teachers = [];
                const subjTemplates = "/edu_actions/pcources";
                const el = $('.row.as-table').each((i,el) => {
                    const name = $(el).find('div:nth-child(1) > a').text();
                    const url = $(el).find('div:nth-child(1) > a').attr('href');
                    const jobTitle = $(el).find('div:nth-child(2)').text().trim();
                    teachers.push({name, url, jobTitle});
                });
                teachers.forEach(async (el) => {
                    let content = await needle("get", `${el.url}${subjTemplates}`);
                    let $1 = cherio.load(content.body, { decodeEntities: false });
                    const table = $1('#t1').find('tr');
                    const teacher = {...el, subjects: []};
                    table.each((i,elem)=> {
                        if ($(elem).find('td:nth-child(3)').text().trim() == "09.04.01" || $(elem).find('td:nth-child(3)').text().trim() == "09.04.03") {
                            teacher.subjects.push($(elem).find('td:nth-child(1)').text().trim());
                        }
                    })
                    content = await needle("get", `${el.url}`);
                    $1 = cherio.load(content.body, { decodeEntities: false });
                    const imgTemp = "https://ciu.nstu.ru/kaf/";
                    teacher.img = imgTemp + $1('.contacts__card-image > img').attr("src");
                    if (teacher.subjects.length > 0) {
                        const teacherDB = new Teacher(teacher);                                                              
                        const teacherExists = await Teacher.findOne({name: teacher.name.trim()}).exec();
                        if (teacherExists == null) {
                            await teacherDB.save();
                            console.log("Сохранено");
                        } else {
                            await Teacher.updateOne({_id: teacherExists._id}, {$set: teacher});
                            console.log("Обновлено");
                        }           
                    }
                });
                resolve("Teachers parsed succesful");
            } catch(e) {
                console.log(e);
                reject("Error occured while parsing teachers");
            }
        })
    }
}
export default new teacherService();