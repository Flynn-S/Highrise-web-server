// const app = express()
// require("dotenv").config()
import express from "express";
import Stripe from "stripe";
import payment from "../models/payment.js";

import PaymentModel from "../models/payment.js";
const stripe = Stripe(process.env.STRIPE_SECRET_TEST);

const paymentRouter = express.Router();

// const event = await EventModel.findById(req.params.id);

// checkout route
// find event by id
// if (event exists)
// check available tickets > no. of tickets
// calculate total = no.tickets
// attempt to process payment through stripe
// if success = true
// update available tickets
// create tickets
// res.send(payment success, tickets)

// const decoded = await verifyRefreshToken(oldRefreshToken);

//   const user = await UserModel.findOne({ _id: decoded._id });

paymentRouter.post("/", async (req, res, next) => {
  // const user = authenticateJWT(req, res);
  console.log(req.user);
  // const event = await EventModel.findById(req.body.id);

  let { amount, id } = req.body;
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "GBP",
      payment_method: id,
      payment_method_types: ["card"],
      confirm: true,
    });
    console.log("Payment", payment);

    res.json({
      message: { message: "Payment successful", payment: payment },
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
