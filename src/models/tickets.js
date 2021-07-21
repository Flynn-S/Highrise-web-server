import mongoose from "mongoose";
const { Schema, model } = mongoose;

const TicketSchema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: "Event" },
  ownerId: { type: Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: [true, "Field must not be blank"] },
  surname: { type: String, required: [true, "Field must not be blank"] },
  price: Number,
  isValid: { type: Boolean, default: true },
});

export default model("Ticket", TicketSchema);
