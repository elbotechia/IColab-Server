import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    tagName: {
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
        enum: ['project', 'notebook', 'flashcard', 'presentation', 'book', 'article', 'research', 'podcast', 'video', 'other'],
        default: 'project'
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    mediasId:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Storage',
        required: false,
        default: []
    }],

    repo: {
        type: String,
        required: false,
        trim: true
    },
    deploy: {
        type: String,
        required: false,
        trim: true
    },
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
}
)

const ItemModel = mongoose.model("Item", itemSchema);

export { ItemModel };