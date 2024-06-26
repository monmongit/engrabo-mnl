const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "https://engrabo-mnl-frnt.vercel.app",
    credentials: true,
  })
);
app.use("/", express.static(path.join(__dirname, "uploads")));
app.use("/test", (req, res) => {
  res.send("Hello Stphenson");
});

app.use(cookieParser());

app.use(express.urlencoded({ limit: "5mb", extended: true }));

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
    // path: "backend/config/.env", (incoming changes)
  });
}

// Controller Routes
const user = require("./controller/user");
const order = require("./controller/order");
const admin = require("./controller/admin");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/couponCode");
const category = require("./controller/category");
const conversation = require("./controller/conversation");
const message = require("./controller/message");
const custom = require('./controller/custom');

app.use("/api/v2/user", user);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);
app.use("/api/v2/order", order);
app.use("/api/v2/admin", admin);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/category", category);
app.use('/api/v2/custom', custom);

// ErrorHandling
app.use(ErrorHandler);

module.exports = app;
