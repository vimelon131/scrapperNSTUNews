import mongoose from 'mongoose'

const NewsSchema = new mongoose.Schema({
    category: { type: String, required: true },
    date: {type: Date, required: true},
    title: {type: String, required: true, index: true},
    url: {type: String, required:true, unique: true},
    content: {type: String, required: true},
    images: [
       String 
    ]
})

export const News = mongoose.model('News', NewsSchema);