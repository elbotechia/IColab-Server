import mongoose, { Document } from 'mongoose'

const AsignatureSchema = new mongoose.Schema({
    tagName: {
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
        enum: ['superior', 'ensino médio', 'EAD','ensino fundamental', 'infantil', 'pós-graduação', 'MBA', 'master', 'curso', 'técnico', 'certificação', 'other'],
        default: 'superior'
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    mediasId:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Storage',
    }],

    modulesId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Modules',
        default: []
    }],
    tasksId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tasks',
        default: []
    }],
    classroomsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classrooms',
        default: []
    }],
    institutionsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
        default: []
    }],
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    feedbacks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: []
    }],
    tags:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag',
        }
    ]
},
{
    timestamps: true,
    versionKey: false       
})

const AssignatureModel = mongoose.model("Assignature", AsignatureSchema);

export { AssignatureModel };