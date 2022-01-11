const mongoose = require("mongoose");

const mobileSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  adTitle: { type: String, required: true },
  description: { type: String, required: true }
});

module.exports = mongoose.model("Mobile", mobileSchema);