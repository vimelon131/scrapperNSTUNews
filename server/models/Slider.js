import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const SliderSchema = new mongoose.Schema({
    subtitle: { type: String, required: true },
    title: {type: Date, required: true},
    desc: {type: String, required: true},
    background: {type: String, required:true},
    news: {type: ObjectId, ref: "News"}
});

export const Slider = mongoose.model('Slider', NewsSchema);