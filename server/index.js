const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const port = 8080;
const Routes = require("./routes/authRoutes");
const { mongoose } = require("mongoose");
var jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// coneecting db
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database COnnected successfully"))
  .catch((err) => {
    console.log(`Error Occured due to ${err}`);
  });

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/", Routes);

app.listen(port, () => {
  console.log(`Listening On Port ${port}`);
});
