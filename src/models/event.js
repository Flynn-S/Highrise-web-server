import mongoose from "mongoose";

const { Schema, model } = mongoose;

const EventSchema = new Schema(
  {
    name: {type: String, required: true},
    eventDate: {type: Date, required: true},
    lineUp: [{ type: String }],
    ticketsAvailable: Number,
    ticketsSold: Number,
    // attendees: [{ type: Schema.Type.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default model("Event", EventSchema);
