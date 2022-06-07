import mongoose from 'mongoose'

const TeacherSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    jobTitle: {type: String},
    url: {type: String},
    img: String,
    subjects: [{type: String, required:true}],
});

export const Teacher = mongoose.model('Teacher', TeacherSchema);