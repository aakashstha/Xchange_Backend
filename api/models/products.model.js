const mongoose = require("mongoose");

// var date = new Date();
// var year = date.getFullYear();
// var month = date.getMonth();
// var day = date.getDay();
// var currentDate = year + "/" + month + "/" + day;

// Mobile
const mobileSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  adTitle: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  images: { type: Array },
});
const Mobile = mongoose.model("Mobile", mobileSchema);

// Car
const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  year: { type: String, required: true },
  kmDriven: { type: Number, required: true },
  adTitle: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  images: { type: Array },
});
const Car = mongoose.model("Car", carSchema);

// Service
const serviceSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  adTitle: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  images: { type: Array },
});
const Service = mongoose.model("Service", serviceSchema);

// Book
const bookSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  adTitle: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  images: { type: Array },
});
const Book = mongoose.model("Book", bookSchema);

// Electronic
const electronicSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  adTitle: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  images: { type: Array },
});
const Electronic = mongoose.model("Electronic", electronicSchema);

// Musical_Instrument
const musicInstrumentSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  adTitle: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  images: { type: Array },
});
const MusicInstrument = mongoose.model(
  "MusicInstrument",
  musicInstrumentSchema
);

// Bike
const bikeSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  year: { type: String, required: true },
  kmDriven: { type: Number, required: true },
  adTitle: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  images: { type: Array },
});
const Bike = mongoose.model("Bike", bikeSchema);

// Job
const jobSchema = new mongoose.Schema({
  salaryPeriod: { type: String, required: true },
  positionType: { type: String, required: true },
  salaryFrom: { type: String, required: true },
  salaryTo: { type: String, required: true },
  price: { type: Number, required: true },
  adTitle: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  images: { type: Array },
});
const Job = mongoose.model("Job", jobSchema);

// Room
const roomSchema = new mongoose.Schema({
  totalRooms: { type: Number, required: true },
  kitchen: { type: String, required: true },
  toilet: { type: String, required: true },
  waterSupply: { type: String, required: true },
  price: { type: Number, required: true },
  adTitle: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  images: { type: Array },
});
const Room = mongoose.model("Room", roomSchema);

// Property
const propertySchema = new mongoose.Schema({
  type: { type: String, required: true },
  bedrooms: { type: String, required: true },
  bathrooms: { type: String, required: true },
  furnishing: { type: String, required: true },
  listedBy: { type: String, required: true },
  totalFloors: { type: String, required: true },
  area: { type: String, required: true },
  facing: { type: String, required: true },
  price: { type: Number, required: true },
  adTitle: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  images: { type: Array },
});
const Property = mongoose.model("Property", propertySchema);

module.exports = {
  Mobile,
  Bike,
  Service,
  Book,
  Electronic,
  MusicInstrument,
  Car,
  Job,
  Room,
  Property,
};
