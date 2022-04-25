const mongoose = require("mongoose");

// All Products
const productSchema = new mongoose.Schema({
  // car, bike, mobile, book, service, electronic, musicInstruments
  brand: { type: String },
  price: { type: Number },
  adTitle: { type: String },
  description: { type: String },
  location: { type: String },
  year: { type: String },
  kmDriven: { type: Number },

  // job
  salaryPeriod: { type: String },
  positionType: { type: String },
  salaryFrom: { type: String },
  salaryTo: { type: String },

  // room
  totalRooms: { type: Number },
  kitchen: { type: String },
  toilet: { type: String },
  waterSupply: { type: String },

  // property
  type: { type: String },
  bedrooms: { type: String },
  bathrooms: { type: String },
  furnishing: { type: String },
  listedBy: { type: String },
  totalFloors: { type: String },
  area: { type: String },
  facing: { type: String },
  images: { type: Array }, 

  // must have field
  date: { type: Date, default: Date.now() },
  category: { type: String, required: true },
  userId: { type: String, required: true },
});
const Product = mongoose.model("Product", productSchema);

module.exports = {
  Product,
};
