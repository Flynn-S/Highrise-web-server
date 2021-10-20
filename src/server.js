import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";

import cookieParser from "cookie-parser";
import listEndpoints from "express-list-endpoints";

import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import ticketsRouter from "./routes/tickets.js";
import cartRouter from "./routes/cart.js";
import eventsRouter from "./routes/events.js";
import paymentRouter from "./routes/payment.js";
import contactRouter from "./routes/contact.js";

import { jwtAuth } from "./auth/index.js";

import ErrorResponse from "./utilities/errorResponse.js";

import { errorHandler, routeNotFoundHandler } from "./errors/errorHandling.js";

const app = express();

app.use(morgan("dev"));

// app.use(cors({ origin: "localhost:3000", credentials: true }));
//fill cors white list later
const whiteList = [process.env.FE_URL_DEV, process.env.FE_URL_PROD];
// heroku config

const corsOptions = {
  origin: function (origin, next) {
    if (whiteList.indexOf(origin) !== -1) {
      console.log("ORIGIN: ", origin);
      //origin is in whitelist
      next(null, true);
    } else {
      // origin is not in whitelist,
      next(
        new ErrorResponse(`URL NOT FOUND IN WHITELIST - blocked by cors`, 403)
      );
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
// app.use(cors());

app.use(express.json());
app.use(cookieParser());

// process.env.NODE_ENV !== 'production' &&

//ROUTES
app.use("/", authRouter);
app.use("/users", usersRouter);
app.use("/tickets", ticketsRouter);
app.use("/payment", paymentRouter);
app.use("/cart", jwtAuth, cartRouter);
app.use("/contact", contactRouter);
app.use("/events", eventsRouter);

// ERROR HANDLERS

app.use(routeNotFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

console.table(listEndpoints(app));

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      if (process.env.NODE_ENV === "production") {
        // no need to configure it manually on Heroku
        console.log("Server running on cloud on port: ", PORT);
      } else {
        console.log("Server running locally on port: ", PORT);
      }
    });
  })
  .catch((err) => console.log(err));

// export default app;
