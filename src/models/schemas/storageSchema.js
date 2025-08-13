import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";

const StorageSchema = new mongoose.Schema({
  url: { 
    type: String, 
    required: true 
  },
  filename: { 
    type: String, 
    required: true 
  },
  originalName: { 
    type: String,
    required: false 
  },
  mimetype: { 
    type: String,
    required: false 
  },
  size: { 
    type: Number,
    required: false 
  },
  uploadedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
    timestamps: true,
    versionKey: false
});

StorageSchema.plugin(MongooseDelete, { 
  overrideMethods: 'all',
  deletedAt: true
}); 

export const Storage = mongoose.model('Storage', StorageSchema);