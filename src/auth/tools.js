import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

// generates a new JWT access token taking in user object generated from usermodel
const generateJWT = (userId) =>
  new Promise((res, rej) => {
    console.log(userId);
    jwt.sign(
      userId,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) rej(error);
        res(token);
      }
    );
  });

export const verifyJWT = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) rej(error);
      res(decoded);
    })
  );

const generateRefreshJWT = (userId) =>
  new Promise((res, rej) =>
    jwt.sign(
      userId,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" },
      (error, token) => {
        if (error) rej(error);
        res(token);
      }
    )
  );

const verifyRefreshToken = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
      if (error) rej(error);
      res(decoded);
    })
  );

// POTENTIAL FOR TICKET VERIFICATION
// const generateTicketJWT = (ticket) =>
// new Promise((res, rej) =>
//   jwt.sign(
//     ticket,
//     process.env.ACCESS_TOKEN_SECRET,
//     { expiresIn: "30d" },
//     (error, token) => {
//       if (error) rej(error);
//       res(token);
//     }
//   )
// );

export const auth = async (user) => {
  const newAccessToken = await generateJWT({ _id: user._id });

  const newRefreshToken = await generateRefreshJWT({ _id: user._id });

  user.refreshToken = newRefreshToken;
  await user.save();
  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const refreshJWT = async (oldRefreshToken) => {
  const decoded = await verifyRefreshToken(oldRefreshToken);

  const user = await UserModel.findOne({ _id: decoded._id });

  if (!user) {
    throw new Error("Try again");
  }
  const refreshToken = user.refreshToken;

  if (refreshToken !== oldRefreshToken) {
    throw new Error("Login again");
  }

  const newAccessToken = await generateJWT({ _id: user._id });
  const newRefreshToken = await generateRefreshJWT({ _id: user._id });

  user.refreshToken = newRefreshToken;
  await user.save();
  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
