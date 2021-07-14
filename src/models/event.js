import mongoose from "mongoose";

const { Schema, model } = mongoose;

const EventSchema = new Schema(
  {
    name: String,
    eventDates: Date,
    lineUp: [{ type: String }],
    ticketsAvailble: Number,
    ticketsSold: Number,
    // attendees: [{ type: Schema.Type.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default model("Event", EventSchema);
