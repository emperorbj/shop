import mongoose from 'mongoose';

export const connectDB = async ()=> {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB database connected');
        
    } catch (error) {
        console.log('Error connecting to MongoDB database',error.message);
        process.exit(1)
    }
}