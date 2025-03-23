const mongoose = require("mongoose");
const contactSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      unique: true,
      required: true,
    },
    profile_image: {
      type: String,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestampes: true,
  }
);

const ContactModel = new mongoose.model("Contact", contactSchema);
module.exports = ContactModel;
