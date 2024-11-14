// server.js
import express from "express";
import cors from "cors";
import 'dotenv/config'
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";

// Load environment variables
// import dotenv from 'dotenv';
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
// dotenv.config();


const app = express();
const port = process.env.PORT|| 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to the database
connectDB();

// Routes
app.use('/api/food', foodRouter);
app.use('/images', express.static('uploads'));
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter );
app.use('/api/order', orderRouter );
// Root endpoint
app.get('/', (req, res) => {
  res.send('API Working');
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
