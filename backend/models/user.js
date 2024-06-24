const mongoose = require("mongoose");
const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "https://www.flaticon.com/free-icon/profile_3135715?term=user&page=1&position=4&origin=tag&related_id=3135715", // or a URL to a default avatar image
  },
  role: {
    type: String,
    enum: ["user", "admin"], // you can add more roles if necessary
    default: "user",
  },
  favourites: [
    {
      type: mongoose.Types.ObjectId,
      ref: "books",
    },
  ],
  cart: [
    {
      type: mongoose.Types.ObjectId,
      ref: "books",
    },
  ],
  orders: [
    {
      type: mongoose.Types.ObjectId,
      ref: "order",
    },
  ],
}, 
{ timestamps: true }
);

module.exports = mongoose.model("users", user);
