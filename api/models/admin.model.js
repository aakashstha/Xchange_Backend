const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  //_id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: { type: String, required: true },
});
// match property above is basically buit in validation to validate email id = [ like if there is @ or not ]
// which is built in Mongoose

module.exports = mongoose.model("Admin", adminSchema);
