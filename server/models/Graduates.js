import mongoose from "mongoose";

const GraduateSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    graduationDate: {type: String, required: true},
    review: {type: String, required: true},
    job: {type: String},
    faculty: {type: String, required: true},
    img: String, 
});

export const Graduate = mongoose.model('Graduate', GraduateSchema);