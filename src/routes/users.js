import { Router } from "express";
import user from "../models/user.js";
import { adminOnly } from "../auth/index.js";
import UserModel from "../models/user.js";

const usersRouter = Router();

usersRouter.get("/me", async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.put("/me", async (req, res, next) => {
  try {
    const updates = Object.keys(req.body); // creates an array of User Object properties that are in the request body [email, password etc]

    updates.forEach((u) => (req.user[u] = req.body[u]));

    await req.user.save();

    res.status(200).send(req.user);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", adminOnly, async (req, res, next) => {
  try {
    const query = req.query.email;

    const findUser = await UserModel.find({
      email: { $regex: new RegExp(query, "i") },
    }).sort({ email: 1 });
    res.send(findUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
// s.get("/:id", async (req, res, next) => {});

export default usersRouter;
