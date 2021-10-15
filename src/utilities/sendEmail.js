import sgMail from "@sendgrid/mail";

// export default sendEmail = async (email, name, subject, messageContent) => {
//   try {
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//     const msg = {
//       to: "flynnstacey@hotmail.com",
//       from: email,
//       subject: subject,
//       text: `${messageContent} + From ${name}`,
//     };
//     await sgMail.send(msg);
//     console.log("email sent");
//   } catch (error) {
//     console.log("error sending email", error);
//     next(error);
//   }
// };

// export const getEventHandler = async (req, res, next) => {
//   try {
//     const event = await EventModel.findById(req.params.id);
//     if (event) {
//       res.status(200).send(event);
//     } else {
//       res.status(404).send(`Event with id ${req.params.id} does not exist`);
//     }
//   } catch (error) {
//     next(error);
//   }
// };
