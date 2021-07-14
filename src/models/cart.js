import mongoose from "mongoose";
const { Schema, model } = mongoose;

const CartSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User" },
    tickets: [
      { id: { type: Schema.Types.ObjectId, ref: "Ticket" }, quantity: Number },
    ],
    status: { type: String, enum: ["active", "paid"], default: "active" },
  },
  { timestamps: true }
);

export default model("Cart", CartSchema);
