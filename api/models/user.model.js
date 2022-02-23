const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fullName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: { type: String, required: true },
  confirmed: { type: Boolean, default: false },
  confirmationCode: { type: String, unique: true },
  dateCreated: { type: Date, default: Date.now() },
});
// match property above is basically buit in validation to validate email id = [ like if there is @ or not ]
// which is built in Mongoose


// Methods in Schema
//userSchema.prev("save", function () {});

module.exports = mongoose.model("User", userSchema);
