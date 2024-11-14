import foodModel from "../models/foodModel.js";
import fs from "fs";

// Add food item with image upload
const addFood = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image file uploaded" });
  }

  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    await food.save();
    res.status(201).json({ success: true, message: "Food added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error saving food", error: error.message });
  }
};

const listFood = async (req, res) => {
  try {
    const food = await foodModel.find({});
    res.json({ success: true, data: food }); // Corrected 'foods' to 'food'
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error retrieving food items", error: error.message });
  }
};

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`,()=>{})

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "food removed" }); // Corrected 'foods' to 'food'
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error retrieving food items", error: error.message });
  }
};


export { addFood,listFood,removeFood };