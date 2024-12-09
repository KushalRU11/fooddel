import micromatch from "micromatch";
const { any } = micromatch;

import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import 'dotenv/config';
import Stripe from 'stripe';

// Use the Stripe secret key from environment variables
const stripe = new Stripe("sk_test_51QKil0KTOKQxgt2KJydTdLXDMbSip8J0G4Y9sfUHhDF5cDOV9urgPgBPJP25qpu5BcUlKRxl5DpvraMLvcYWOsbZ00Lz5u0S8E");

const placeOrder = async (req, res) => {
  const frontend_url = 'https://fooddel-front-end.vercel.app/'; // Corrected typo

  try {
    // Create a new order in the database
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();

    // Clear the cart after placing the order
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Create line items for the payment session
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100 * 80, // Convert price to cents (assuming it's in decimal format)
      },
      quantity: item.quantity,
    }));

    // Add delivery charges as a separate line item
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges"
        },
        unit_amount: 2 * 100 * 80, // Delivery charge
      },
      quantity: 1,
    });

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: 'payment',
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    // Log session URL for debugging
    console.log("Stripe session URL:", session.url);

    // Send the session URL to the frontend
    res.json({
      success: true,
      session_url: session.url, // This should be sent in the response
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error processing the order" });
  }
};

const verifyOrder = async (req,res) =>{
  const {orderId,success}=req.body;
  try {
      if(success=="true"){
        await orderModel.findByIdAndUpdate(orderId,{payment:true});
        res.json({success:true,message:"Paid"})
      }
      else{
        await orderModel.findByIdAndDelete(orderId);
        res.json({success:false,message:"Not Paid"})
      }

  } catch (error) {
    console.log(error)
    res.json({success:false,message:"Error"});
  }
}

const userOrders = async (req,res) =>{
    try {
      const orders = await orderModel.find({userId:req.body.userId})
      res.json({success:true,data:orders})
    } catch (error) {
      console.log(error)
      res.json({success:false,message:"Error"})
    }
}

const listOrders = async (req,res) =>{
try {
  const orders = await orderModel.find({});
  res.json({success:true,data:orders})
} catch (error) {
  console.log(error)
  res.json({success:false,message:"Error"})
}
}

// const updateStatus = async(req,res) =>{
// try {
//   await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
//   res.json({success:true,message:"Status Updated"});
// } catch (error) {
//   console.log(error)
//   res.json({success:false,message:"Error"})
// }
// }

// controllers/orderController.js

const updateStatus = async (req, res) => {
  const { orderId, status } = req.body;

  // Log to confirm orderId and status are received
  console.log("Received orderId:", orderId, "Received status:", status);

  if (!orderId || !status) {
    return res.status(400).json({ success: false, message: "Order ID or status missing" });
  }

  try {
    const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status: status }, { new: true });
    
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    
    res.json({ success: true, message: "Status Updated", data: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};

export { placeOrder,verifyOrder,userOrders,listOrders,updateStatus };
