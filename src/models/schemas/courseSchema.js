import { Model, Document } from "mongoose";

import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    curso: {
        type: String,
        required: true,
        unique: true
    },
    anos: {
        type: Number,
        required: true,
    },
    abbr: {
        type: String,
        required: true,
    },
    variacoes:{
        type:[String],
        default:[]
    }
},{
    timestamps: true,
    versionKey: false
});

const CourseModel= mongoose.model("Course", CourseSchema);

export {  CourseModel };       