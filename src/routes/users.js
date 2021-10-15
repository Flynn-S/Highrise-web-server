import { Router } from "express";
import user from "../models/user.js";
import { adminOnly } from "../auth/index.js";
import UserModel from "../models/user.js";
import ErrorResponse from "../utilities/errorResponse.js";
import Ticket from "../models/tickets.js";

import multerUpload from "../pictures/pictureUpload.js";
const upload = multerUpload();

const usersRouter = Router();

usersRouter.get("/me", async (req, res, next) => {
  try {
    const loggedInUser = await UserModel.findById(req.user.id).populate({
      path: "tickets",
      model: Ticket,
    });

    res.status(200).send({ user: loggedInUser });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.post("/me", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    await newUser.save();
    res.status(201).send(req[user]);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// upload profile image
usersRouter.post("/me/uploadPhoto", async (req, res, next) => {
  const modified = await UserModel.findByIdAndUpdate(
    req.user.id,
    {
      image: req.file.path,
    },
    { runValidators: true, new: true }
  );
  res.status(200).send(modified);
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

// Update a users profile details by id
usersRouter.put("/:id", upload, async (req, res, next) => {
  try {
    const modified = await Profile.findByIdAndUpdate(req.user._id, req.body, {
      runValidators: true,
      new: true,
    });
    if (!modified) {
      return next(new ErrorResponse(`resource not found with that id`, 404));
    }
    res.status(200).send(modified);
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

usersRouter.get("/", adminOnly, async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const total = await UserModel.countDocuments(query.criteria);
    const users = await UserModel.find(query.criteria, query.options.fields)
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort);
    res.send({ links: query.links("/users", total), total, users });
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
