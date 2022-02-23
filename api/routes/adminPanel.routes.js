const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const AdminJSMongoose = require("@adminjs/mongoose");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// const { Mobile } = require("../models/products.model");
const Admin = require("../models/admin.model");

AdminJS.registerAdapter(AdminJSMongoose);
const adminJs = new AdminJS({
  databases: [mongoose],
});

const router = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    cookieName: "admin-bro",
    cookiePassword: "supersecret-and-long-password-for-a-cookie-in-the-browser",
    authenticate: async (email, password) => {
      try {
        const result = await Admin.find({ email: email }).exec();
        // if password match return true
        const resultPassword = await bcrypt.compare(
          password,
          result[0].password
        );

        if (email === result[0].email && resultPassword) {
          return { email: result[0].email };
        } else {
          console.log("Wrong email and/or password");
        }
        return null;
      } catch (error) {
        console.log(error);
      }
    },
  },
  null,
  {
    resave: true,
    saveUninitialized: true,
  }
);

module.exports = router;
