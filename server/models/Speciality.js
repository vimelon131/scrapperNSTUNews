import mongoose from 'mongoose'

const SpecialitySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    area: {type: String, required: true},
    description: String,
    budget: {type: String, required: true},
    contract: {type: String},
    cost: String,
    shortInfo: {type: String, default: ""},
    documents: [{name: String, url: String}],
    subjects: [String],
    exams: [String],
    passingScore: {budget: String, contract: String},
    studentPublications: [String],
    graduationsThemes: [String],
    activeTeachers: [{name: String, site: String}],
    programRelevance: [String],
    employment: [String],
    trace: {type: Boolean, default: false},
    helloWord: {type: String, default: "aasd"},
    specRuk: {name: String, job: String, contact: String, img: String},
    nauchRuk: [{
        name: String,
        job: String,
        site: String,
        specs: [String],
        img: String
    }]
});

export const Speciality = mongoose.model('Speciality', SpecialitySchema);