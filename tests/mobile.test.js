const mongoose = require("mongoose");

const dbHandler = require("./db_handler");
const mobileModel = require("../api/models/mobile.model");
const mobileRoute = require("../api/routes/mobile.routes");

// Connect to a new in-memory database before running any tests.
beforeAll(async () => {
  await dbHandler.connect();
});

// Clear all test data after every test.
afterEach(async () => {
  await dbHandler.clearDatabase();
});

// Remove and close the db and server.
afterAll(async () => {
  await dbHandler.closeDatabase();
});

// Mobile test suite.
describe("mobile ad created", () => {
  it("must have every filed filled", async () => {
    expect(async () => {
      await mobileRoute.post(completeMobileAd);
    }).not.toThrow();
  });

  it("find ad", async () => {
    await mobileRoute.post(completeMobileAd);

    const createdMobileAd = await mobileModel.findOne();
    expect(createdMobileAd.brand).toBe(completeMobileAd.brand);
  });
});

const completeMobileAd = {
  brand: "Apple",
  price: "6999",
  adTitle: "iPhone 11",
  description:
    "A new dual‑camera system captures more of what you see and love.",
  images: "uploads/1642758834837_Screen_Shot_2022-01-13_at_2.31.34_PM.png",
};
