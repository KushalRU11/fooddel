import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";
import fs from "fs";  // Import fs module here

const foodRouter = express.Router();

// Multer configuration to store files in 'uploads' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = 'uploads';
    
    // Check if uploads directory exists, if not, create it
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    
    // Set the destination of the uploaded files
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename by appending the current timestamp to the original filename
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Multer middleware for handling single image upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Define POST route to add food with image
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);

export default foodRouter;
