import  puppeteer  from "puppeteer";
import cherio from 'cherio';
import config from 'config';
import needle from 'needle';
import { Question } from "../models/Queistion.js";

class questionService {
    addQuestion(question, answer, date= Date.now(), mail=null) {
        return new Promise((async (resolve, reject) => {
            try {
                const ques = new Question({name: question, answer: answer, date: date, mail: mail});
                await ques.save();
                resolve({message: "Succesful add"})
            } catch(e) {
                console.log(e);
                return reject({message: "Error occured with question!"});
            }
                
        })) 
    }

    deleteQuestion(id) {
        return new Promise((async (resolve, reject) => {
            try {
                await Question.deleteOne({_id: id});
                resolve({message: "Succesful delete"})
            } catch(e) {
                console.log(e);
                return reject({message: "Error occured with question!"});
            }
                
        })) 
    }
}

export default new questionService();