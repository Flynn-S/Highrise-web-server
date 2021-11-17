import nodemailer from "nodemailer";
import sendGridTransport from "nodemailer-sendgrid-transport";
import sgMail from "@sendgrid/mail";

import express from "express";
// import sendEmail from "../utilities/sendEmail.js";

const contactEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.EMAIL}`,
    pass: `${process.env.PSWRD}`,
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

const contactRouter = express.Router();

// contactRouter.post("/", async (req, res, next) => {
//   try {
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//     console.log(req.body);
//     const { name, email, subject, messageContent } = req.body;
//     const msg = {
//       to: email,
//       from: flynnstacey@hotmail.com,
//       subject: subject,
//       text: `${messageContent}, From ${name}`,
//     };
//     sgMail.send(msg);
//     console.log("email sent");
//     res.status(200).send(msg);
//   } catch (error) {
//     console.log("error sending email", error);
//     next(error);
//   }
// });

contactRouter.post("/", (req, res, next) => {
  const { name, email, subject, messageContent } = req.body;

  const mail = {
    from: name,
    to: `${process.env.EMAIL}`,
    subject: subject,
    html: `<p>Name: ${name}</p>
             <p>Email: ${email}</p>
             <p>Message: ${messageContent}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      next(error);
    } else {
      res.status(200).send("Message Sent");
    }
  });
});

export default contactRouter;

// contactRouter.post("/", (req, res) => {
//     const { name, email, message, subject } = req.body
//     transporter.sendMail({
//     to:`YOUR EMAIL`,
//     from: email,
//     subject:subject,
//     html:`<h3>${name}</h3>
//     <p>${message}</p>`
//     }).then(resp => {
//     res.json({resp})
//     })
//     .catch(err => {
//     console.log(err)
//     })
//     })
