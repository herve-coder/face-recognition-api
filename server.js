const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");
const { registerHandler } = require("./Controllers/Register");
const { signinHandler } = require("./Controllers/signin");
const { imageHandler, imageApiCall } = require("./Controllers/image");
const { profileIdHandler } = require("./Controllers/profile");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "dSMFB1T",
    database: "face_recognition"
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post("/signin", signinHandler(bcrypt, db));

app.get("/profile/:id", profileIdHandler(db));

app.put("/image", imageHandler(db));

app.post("/imageurl", (req, res) => {
  imageApiCall(req, res);
});

app.post("/register", registerHandler(bcrypt, db));

app.listen(process.env.PORT || 3000, () => {
  console.log(`App is listening to port ${process.env.PORT || 3000}`);
});
