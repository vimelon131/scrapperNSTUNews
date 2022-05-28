import mongoose from 'mongoose'

const SpecialitySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    area: {type: String, required: true},
    budget: {type: String, required: true},
    contract: {type: String, required:true},
    cost: String,
    subjects: [String],
    exams: [String],
    passingScore: {budget: String, contract: String},
    studentPublications: [String],
    graduationsThemes: [String],
    activeTeachers: [{name: String, site: String}],
    programRelevance: String,
    employment: String
});

export const Speciality = mongoose.model('Speciality', SpecialitySchema);