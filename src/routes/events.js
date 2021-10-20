import express from "express";
import EventModel from "../models/event.js";
import Stripe from "stripe";
import { adminOnly } from "../auth/index.js";
import TicketModel from "../models/tickets.js";

import multerUpload from "../pictures/pictureUpload.js";
const upload = multerUpload();

const stripe = Stripe(process.env.STRIPE_SECRET_TEST);

export const checkoutHandler = async (req, res, next) => {
  const { amount, id, ticketQuantity, name, surname, price } = req.body;
  console.log(req.user);
  const user = req.user;

  const event = await EventModel.findById(req.params.id);
  console.log(event);
  if (!event) {
    res.status(404).send(`event with id ${req.params.id} does not exist`);
    return;
  }
  if (event.ticketsAvailable - ticketQuantity < 0) {
    res.status(200).send({
      message:
        "The requested number of tickets is not available - reduce and try again",
    });
    return;
  }

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
      paymentObject: { message: "Payment successful", payment: payment },
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: "Payment failed",
      success: false,
    });
    return;
  }
  // create paid for tickets
  const newticket = new TicketModel({
    name,
    surname,
    price,
    eventId: event._id,
    ownerId: user._id,
  });
  event._id = await newticket.save();

  res.status(201).send(newticket);
};

export const getEventHandler = async (req, res, next) => {
  try {
    const event = await EventModel.findById(req.params.id);
    if (event) {
      res.status(200).send(event);
    } else {
      res.status(404).send(`Event with id ${req.params.id} does not exist`);
    }
  } catch (error) {
    next(error);
  }
};

export const getAllEventsHandler = async (req, res, next) => {
  try {
    // const events = await EventModel.find({});
    // res.status(200).send({ events });
    // const pageSize = req.query.eventsPerPage;
    // console.log(req.query.currentPage);
    // const page = Number(req.query.currentPage) || 1;
    // console.log(req.query.name);
    // const total = await EventModel.countDocuments(req.query.name);

    console.log(req.query.name);
    const filteredEvents = await EventModel.find({
      name: { $regex: req.query.name, $options: "i" },
    });
    // .limit(pageSize)
    // .skip(pageSize * (page - 1));
    res.status(200).send({
      events: filteredEvents,
      // page,
      // pages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const eventsRouter = express.Router();

// get all events
eventsRouter.get("/", getAllEventsHandler);

// eventsRouter.get("/", async (req, res, next) => {
//   try {
//     const query = q2m(req.query);
//     const total = await EventModel.countDocuments(query.criteria);
//     const events = await EventModel.find(query.criteria, query.options.fields)
//       .skip(query.options.skip)
//       .limit(query.options.limit)
//       .sort(query.options.sort);
//     res.send({ links: query.links("/events", total), total, events });
//   } catch (error) {
//     next(error);
//   }
// });

// get singular event by ID

eventsRouter.get("/:id", getEventHandler);

// post new event
eventsRouter.post("/", async (req, res, next) => {
  try {
    // const newTicket = await TicketModel.create({...req.body});
    const newEvent = new EventModel(req.body);
    await newEvent.save();

    res.status(201).send(newEvent);
  } catch (error) {
    next(error);
  }
});

// upload event picture
eventsRouter.post("/:id/uploadPhoto", upload, async (req, res, next) => {
  const modifiedEvent = await EventModel.findByIdAndUpdate(
    req.params.id,
    {
      image: req.file.path,
    },
    { runValidators: true, new: true }
  );
  res.status(201).send(modifiedEvent);
});

//  edit existing event details
eventsRouter.put("/:id", async (req, res, next) => {
  try {
    const modifiedEvent = await EventModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
        useFindAndModify: false,
      }
    );
    if (!modifiedEvent) {
      return next(new ErrorResponse(`resource not found with that id`, 404));
    }
    res.status(204).send(modifiedEvent);
  } catch (error) {
    next(error);
  }
});

// delete event
eventsRouter.delete("/:id", async (req, res, next) => {
  const event = await EventModel.findByIdAndDelete(req.params.id);
  if (event) {
    res.send(`Event deleted`);
  } else {
    res.status(404).send(`Event with id ${req.params.eventId} not found`);
  }
});

// checkout route
eventsRouter.post("/:id/checkout", checkoutHandler);

export default eventsRouter;
