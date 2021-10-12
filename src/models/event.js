import mongoose from "mongoose";

const { Schema, model } = mongoose;

const EventSchema = new Schema(
  {
    name: { type: String, required: true },
    eventDate: { type: Date, required: true },
    lineUp: [{ type: String }],
    location: { type: String, required: true },
    description: String,
    image: { type: String },
    ticketsAvailable: Number,
    capacity: { type: Number, required: true },
    ticketPriceTiers: [
      {
        pricingTier: Number,
        pricePence: Number,
      },
    ],

    // attendees: [{ type: Schema.Type.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default model("Event", EventSchema);
