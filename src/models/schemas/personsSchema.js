import mongoose, { Model, Document } from "mongoose";


const PersonSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    roles:{
        type: [String],
        enum: ["user", "admin", "professor", "mentor", "orientador", "monitor", "aluno", "pesquisador"],
        default: ["user"]
    }
    ,
    avatarId:{
             type: mongoose.Schema.Types.ObjectId,
             ref: 'Storage'
    },
    coverId:{
             type: mongoose.Schema.Types.ObjectId,
             ref: 'Storage'
    },
    hex: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: false,
        default: ""
    },
    social: {
        github: {
            type: String,
            required: false,
            default: ""
        },
        linkedin: {
            type: String,
            required: false,
            default: ""
        },
        twitter: {
            type: String,
            required: false,
            default: ""
        },
        instagram: {
            type: String,
            required: false,
            default: ""
        },
        facebook: {
            type: String,
            required: false,
            default: ""
        }
    }
},{
    timestamps: true,
    versionKey: false
});

const Person = mongoose.model("Person", PersonSchema);

export { Person };