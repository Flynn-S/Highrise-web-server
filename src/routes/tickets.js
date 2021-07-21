import { Router } from "express";
import user from "../models/user.js";
import { adminOnly } from "../auth/index.js";
import TicketModel from "../models/tickets.js";
import tickets from "../models/tickets.js";
import q2m from "query-to-mongo";

const ticketsRouter = Router();

ticketsRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const total = await TicketModel.countDocuments(query.criteria);
    const tickets = await TicketModel.find(query.criteria, query.options.fields)
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort);
    res.send({ links: query.links("/tickets", total), total, tickets });
  } catch (error) {
    next(error);
  }
});

ticketsRouter.post("/", async (req, res, next) => {
  try {
    // const newTicket = await TicketModel.create({...req.body});
    const newTicket = new TicketModel(req.body);
    const tic = await newTicket.save();

    res.status(201).send("Ticket created");
  } catch (error) {
    next(error);
  }
});

export default ticketsRouter;
