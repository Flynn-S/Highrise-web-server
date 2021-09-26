// const app = express()
// require("dotenv").config()
import express from "express";
import stripe from "stripe";

import PaymentModel from "../models/payment.js";
const stripe1 = stripe(process.env.STRIPE_SECRET_TEST);

const paymentRouter = express.Router();

paymentRouter.post("/", async (req, res, next) => {
  let { amount, id } = req.body;
  try {
    const payment = await stripe1.paymentIntents.create({
      amount,
      currency: "GBP",
      payment_method: id,
      payment_method_types: ["card"],
      confirm: true,
    });
    console.log("Payment", payment);
    res.json({
      message: "Payment successful",
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: "Payment failed",
      success: false,
    });
  }
});

export default paymentRouter;
