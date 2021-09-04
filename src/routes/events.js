import express from "express";
import EventModel from "../models/event.js";
import { adminOnly } from "../auth/index.js";

const eventsRouter = express.Router();

// get all events
eventsRouter.get("/", async (req, res, next) => {
  try {
    const events = await EventModel.find({});

    res.status(200).send({ events });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

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
eventsRouter.get("/:id", async (req, res, next) => {
  try {
    const event = await EventModel.findById(req.params.id);
    if (event) {
      res.status(200).send(event);
    } else {
      res.status(404).send(`Post with iid ${req.params.id} does not exist`);
    }
  } catch (error) {
    next(error);
  }
});

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
eventsRouter.post("/:id", async (req, res, next) => {
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
eventsRouter.delete("/:id", adminOnly, async (req, res, next) => {
  const event = await EventModel.findByIdAndDelete(req.params.id);
  if (event) {
    res.send(`Post deleted`);
  } else {
    res.status(404).send(`Post with id ${req.params.postId} not found`);
  }
});

export default eventsRouter;
