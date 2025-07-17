import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import formRoutes from './routes/formRoutes';
import responseRoutes from './routes/responseRoutes';

dotenv.config();
connectDB();

const app = express();

app.use(cors()); // Enable CORS for all origins (adjust in production)
app.use(express.json()); // Body parser for JSON

app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/responses', responseRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
