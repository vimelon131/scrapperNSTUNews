import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    name: { type: String, required: true},
    answer: {type: String},
    date: Date,
    email: String 
});

export const Question = mongoose.model('Question', QuestionSchema);