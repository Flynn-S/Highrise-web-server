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

CartSchema.static("findTicketInCart", async function (userId, ticketId) {
  const isTicketThere = await this.findOne({
    ownerId: userId,
    "tickets._id": mongoose.Types.ObjectId(ticketId),
  });
  return isTicketThere;
});

CartSchema.static("incrementQuantity", async function (userId, ticketId) {
  await this.findOneAndUpdate(
    {
      ownerId: mongoose.Types.ObjectId(userId),
      "tickets._id": mongoose.Types.ObjectId(ticketId),
    },
    {
      $inc: { "tickets.$.quantity": 1 },
    },
    {
      upsert: true,
    }
  );
});

CartSchema.static("addTicketToCart", async function (userId, ticket) {
  const cart = await this.findOneAndUpdate(
    {
      ownerId: userId,
    },
    {
      $addToSet: {
        tickets: ticket,
      },
    },
    {
      upsert: true,
    }
  );
  await UserModel.findByIdAndUpdate(
    { _id: userId },
    {
      $set: {
        cart: cart,
      },
    },
    { runValidators: true, new: true }
  );
});

CartSchema.static("removeTicketFromCart", async function (userId, ticketId) {
  await this.findByIdAndUpdate(
    {
      ownerId: userId,
      status: "active",
    },
    {
      $pull: {
        tickets: { _id: ticketId },
      },
    }
  );
});

CartSchema.static("calculateCartTotal", async function (userId) {
  const { tickets } = await this.findOne({
    ownerId: userId,
    status: "active",
  });
  const total = tickets
    .map((ticket) => ticket.price * ticket.quantity)
    .reduce((acc, cv) => acc + cv, 0);
  return total;
});

export default model("Cart", CartSchema);
