const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const connectToMongoDB = require("./config/db");
const api = require("./routes/index");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerJson = require("../swagger.json");

// MongoDB
connectToMongoDB();

//Configs
app.use(express.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//Swagger

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));

//Home
app.get("/", function (req, res) {
  res.send("Hello world!");
});

//Import routes
app.use("/api/auth", api.auth);
app.use("/api/user", api.user);

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
