import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = 'mongodb+srv://kushalru:9482717310@cluster0.sbece.mongodb.net/FOODDEL'; // Your connection URI
    await mongoose.connect(uri);
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection error: ", error);
    process.exit(1);  // Exit the process if the connection fails
  }
};
