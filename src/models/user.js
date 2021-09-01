import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Must enter a valid email address"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    username: {
      type: String,
      trim: true,
      // required: [true, "Username cannot be blank"],
    },
    name: { type: String },
    surname: { type: String },
    image: {
      type: String,
      default:
        "https://st4.depositphotos.com/4329009/19956/v/600/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg",
    },
    password: {
      type: String,
      required: [true, "Please add a Password"],
      // select: false, //hides password when fetching profile
    },
    userType: { type: String, enum: ["user", "admin"], default: "user" },
    cart: { type: Schema.Types.ObjectId, ref: "Cart" },
    refreshToken: { type: String },
    // resetPasswordToken: String,
    // resetPasswordExpire: Date,
    // tickets: [{ type: Schema.Types.ObjectId, ref: "Ticket" }],
  },
  { timestamps: true }
);

// encrypt password using bcrypt
// UserSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }
//   next();
// });

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(
      this.password,
      parseInt(process.env.SALT_ROUNDS)
    );
  }
  next();
});

UserSchema.statics.checkCredentials = async function (email, pw) {
  const user = await this.findOne({ email });
  console.log(user);
  console.log(pw);
  if (user) {
    const isMatch = await bcrypt.compare(pw, user.password);
    if (isMatch) return user;
    else return null;
  } else return null;
};

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  delete userObject.refreshToken;
  return userObject;
};

export default model("User", UserSchema);
