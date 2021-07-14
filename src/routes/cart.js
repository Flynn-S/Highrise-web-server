import { Router } from "express";

import CartModel from "../models/cart.js";
import TicketModel from "../models/tickets.js";

const cartRouter = Router();

cartRouter.post("/:userId/addTicket", async (req, res, next) => {
  try {
    const Ticket = await TicketModel.findById(req.body._id);
    if (Ticket) {
      const TicketToAdd = {
        ...Ticket.toObject(),
      };

      const isTicketThere = await CartModel.findTicketInCart(
        req.params.userId,
        req.body._id
      );
      console.log(isTicketThere);
      if (isTicketThere) {
        await CartModel.incrementQuantity(req.params.userId, req.body._id);
        res.send("Quantity incremented");
      } else {
        await CartModel.addTicketToCart(req.params.userId, {
          ...TicketToAdd,
          quantity: 1,
        });
        res.send("New Ticket added");
      }
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

cartRouter.delete("/:userId/removeTicket", async (req, res, next) => {
  try {
    await CartModel.removeTicketFromCart(req.params.userId, req.body._id);
    res.send("Ticket removed from cart");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

cartRouter.get("/:userId/total", async (req, res, next) => {
  try {
    await CartModel.calculateCartTotal(req.params.userId);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default cartRouter;
