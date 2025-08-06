import mongoose, { Model, Document } from "mongoose";


const TagSchema = new mongoose.Schema(
    {
        tagName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        color: {
            type: String,
            required: true,
            trim: true,
        },
        mediaId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Storage",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const TagModel = mongoose.model("Tag", TagSchema);

export { TagModel };