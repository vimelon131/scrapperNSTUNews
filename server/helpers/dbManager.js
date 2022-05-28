import { MongoClient } from "mongodb";

const URI = "mongodb://localhost:27017/";

export class dbManager {
    constructor() {
        this.client = null;
    }
    async connetDB() {
        try {
            this.client = new MongoClient(URI);
            await this.client.connect();
            console.log('sex')
        } catch (err) {
            console.log(err);
        }
    }
    async ping() {
        const news = this.client.db('fuck');
        const res = await news.command({ping:1});
        console.log('Successfuly ping');
    
    }
    async findFour() {
        
    }
    async insertOne(db, collection, doc) {
        try {
            const database = this.client.db(db);
            const col = database.collection(collection);
            const res = await col.insertOne(doc);
            return res;
        } catch(err) {
            console.log(err);
        }
        
    }
    async closeDBConnection() {
        await this.client.close();
    }

}