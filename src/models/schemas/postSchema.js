import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";
const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person',
        required: true,
    },
    tags: {
        type: [String],
        default: []
    },
    mediaIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'storage',
        default: []
    }],
    likes:{
        type: Number,
        default: 0
    },
    dislikes:{
        type: Number,
        default: 0
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: []
    }],
},{
    timestamps: true,
    versionKey: false
});
PostSchema.plugin(MongooseDelete, { overrideMethods: 'all',deletedAt: true}); 
export const Post = mongoose.model('Post', PostSchema);