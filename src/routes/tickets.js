import { Router } from "express";
import { adminOnly } from "../auth/index.js";
import TicketModel from "../models/tickets.js";
import UserModel from "../models/user.js";
import EventModel from "../models/event.js";

import q2m from "query-to-mongo";

const ticketsRouter = Router();

// get all tickets
ticketsRouter.get("/", async (req, res, next) => {
  try {
    const tickets = await TicketModel.find({})
      .populate({
        path: "ownerId",
        model: UserModel,
      })
      .populate({ path: "eventId", model: EventModel });

    res.status(200).send({ tickets });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// get singular ticket by ID
ticketsRouter.get("/:id", async (req, res, next) => {
  try {
    const ticket = await TicketModel.findById(req.params.id).populate({
      path: "ownerId",
      select: "name",
    });
    // .populate({
    //   path: ("ownerId", "name email"),
    //   model: UserModel,
    // });
    // .populate({ path: "eventId", model: EventModel });
    if (ticket) {
      res.status(200).send(ticket);
    } else {
      res.status(404).send(`Post with id ${req.params.id} does not exist`);
    }
  } catch (error) {
    next(error);
  }
});

// post new ticket
ticketsRouter.post("/", async (req, res, next) => {
  try {
    // const newTicket = await TicketModel.create({...req.body});
    const newticket = new TicketModel(req.body);
    await newticket.save();

    res.status(201).send(newticket);
  } catch (error) {
    next(error);
  }
});

//  edit existing ticket details
ticketsRouter.put("/:id", async (req, res, next) => {
  try {
    const modifiedticket = await TicketModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
        useFindAndModify: false,
      }
    );
    if (!modifiedticket) {
      return next(new ErrorResponse(`resource not found with that id`, 404));
    }
    res.status(204).send(modifiedticket);
  } catch (error) {
    next(error);
  }
});

// delete ticket
ticketsRouter.delete("/:id", adminOnly, async (req, res, next) => {
  const ticket = await TicketModel.findByIdAndDelete(req.params.id);
  if (ticket) {
    res.send(`Ticket deleted`);
  } else {
    res.status(404).send(`Ticket with id ${req.params.postId} not found`);
  }
});

export default ticketsRouter;
