require('dotenv').config();
import mongoose from 'mongoose';

export const connectDB = async () => {
    await mongoose.connect(`${process.env.MONGO_DB_CLUSTER}`);
    console.log('MongoDB is Connected...');
};
