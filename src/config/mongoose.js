import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
const MGDB = process.env.MONGODB_URI || "";

const mongooseConnect = async () => {
    try {
        await mongoose.connect(MGDB);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export { mongooseConnect };
