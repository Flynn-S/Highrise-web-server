import express from "express";
import UserModel from "../models/user.js";
import ErrorResponse from "../utilities/errorResponse.js";
import { jwtAuth } from "../auth/index.js";
import { auth, refreshJWT } from "../auth/tools.js";
// import passport from "passport";
const authRouter = express.Router();

authRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = await UserModel.create(req.body);
    const { _id } = newUser;
    console.log(newUser);
    const user = await UserModel.checkCredentials(
      req.body.email,
      req.body.password
    );
    const tokens = await auth(user);
    res.cookie("accessToken", tokens.accessToken, {
      sameSite: "lax",
      httpOnly: true,
    });
    res.cookie("refreshToken", tokens.refreshToken, {
      sameSite: "lax",
      httpOnly: true,
    });
    res.status(201).send({ message: "Registration succesful" });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.checkCredentials(email, password);
    if (user) {
      const tokens = await auth(user);
      res.cookie("accessToken", tokens.accessToken, {
        sameSite: "lax",
        httpOnly: true,
      });
      res.cookie("refreshToken", tokens.refreshToken, {
        sameSite: "lax",
        httpOnly: true,
      });
      res.status(200).send({ message: "Login Successful" });
    } else {
      res.status(401).send({ error: "Incorrect credentials" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

authRouter.post("/logout", jwtAuth, async (req, res, next) => {
  try {
    req.user.refreshToken = null;
    await req.user.save();
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).send({ message: "Log out successfull" });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/refreshToken", async (req, res, next) => {
  const oldRefreshToken = req.body.refreshToken;
  if (!oldRefreshToken)
    return next(new ErrorResponse("Refresh token is missing", 400));

  try {
    const newTokens = await refreshJWT(oldRefreshToken);
    res.cookie("accessToken", newTokens.accessToken, {
      sameSite: "lax",
      httpOnly: true,
    });
    res.cookie("refreshToken", newTokens.refreshToken, {
      sameSite: "lax",
      httpOnly: true,
    });

    res.send();
  } catch (error) {
    console.log(error);
    next(new ErrorResponse(error, 401));
  }
});

// **************** OAuth ****************

// authRouter.get(
//   "/googleLogin",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );
// authRouter.get(
//   "/auth/google/test",
//   passport.authenticate("google"),
//   async (req, res, next) => {
//     try {
//       res.cookie("accessToken", req.user.tokens.accessToken, {
//         sameSite: "lax",
//         httpOnly: true,
//       });

//       res.cookie("refreshToken", req.user.tokens.refreshToken, {
//         sameSite: "lax",
//         httpOnly: true,
//       });
//       res.status(200).redirect("http://localhost:3000");
//     } catch (error) {
//       next(error);
//     }
//   }
// );

export default authRouter;
