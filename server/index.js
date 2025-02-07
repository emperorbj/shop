import { connectDB } from "./config/connectDB.js";
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRouter from "./routes/productRoutes.js";
import authRouter from "./routes/userRoute.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// api routes endpoints
app.use('/api/auth',authRouter);
app.use('/api/products',productRouter)


app.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})