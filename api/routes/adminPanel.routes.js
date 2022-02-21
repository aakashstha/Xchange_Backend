const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const AdminJSMongoose = require("@adminjs/mongoose");
//const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin.model");
const {
  Mobile,
  Car,
  Service,
  Book,
  Electronic,
  MusicInstrument,
  Bike,
  Job,
  Room,
  Property,
} = require("../models/products.model");
const User = require("../models/user.model");

AdminJS.registerAdapter(AdminJSMongoose);
const adminJs = new AdminJS({
  //databases: [mongoose],
  resources: [
    User,
    Mobile,
    Car,
    Service,
    Book,
    Electronic,
    MusicInstrument,
    Bike,
    Job,
    Room,
    Property,
  ],
  rootPath: "/admin",
});

const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  cookieName: "admin-bro",
  cookiePassword: "supersecret-and-long-password-for-a-cookie-in-the-browser",
  authenticate: async (email, password) => {
    try {
      const result = await Admin.find({ email: email }).exec();
      console.log(result);
      // if password match return true
      const resultPassword = await bcrypt.compare(password, result[0].password);
      console.log(resultPassword);

      if (email === result[0].email && resultPassword) {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        return { email: result[0].email };
      } else {
        console.log("Wrong email and/or password");
      }
      return null;
    } catch (error) {
      console.log(error);
    }
  },
});

module.exports = router;
