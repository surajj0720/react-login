const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const port = 8080;
const Routes = require("./routes/authRoutes");

app.use("/", Routes);

app.listen(port, () => {
  console.log(`Listening On Port ${port}`);
});
