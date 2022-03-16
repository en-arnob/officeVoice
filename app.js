require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

//Import routes

const authRoutes = require("./routes/authRoutes");
const feedRoute = require("./routes/feedRoute");

const { bindUserWithRequest } = require("./middleware/authMiddleware");
const setLocals = require("./middleware/setLocals");

let DB_ADMIN = process.env.DB_ADMIN;
let DB_PASSWORD = process.env.DB_PASSWORD;

// const dbUri =
//   "mongodb+srv://khalid15:iLOVEFUCkingPASS@officevoice.wmmle.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const dbUri = `mongodb+srv://${DB_ADMIN}:${DB_PASSWORD}@officevoice.wmmle.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const store = new MongoDBStore({
  uri: dbUri,
  collection: "mySessions",
  expires: 1000 * 60 * 60 * 2,
});

const app = express();

//Setup View Engine
app.set("view engine", "ejs");
app.set("views", "views");

if (app.get("env").toLowerCase() === "development") {
  app.use(morgan("dev"));
}

//Middleware Array
const middleware = [
  express.static("public"),
  express.urlencoded({ extended: true }),
  express.json(),
  session({
    secret: process.env.SECRET_KEY || "SECRET_KEY",
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
  bindUserWithRequest(),
  setLocals(),
];
app.use(middleware);

app.use("/auth", authRoutes);
app.use("/feed", feedRoute);

app.get("/", (req, res) => {
  res.redirect("/feed");
});

const PORT = process.env.PORT || 8080;

mongoose
  .connect(dbUri, { useNewUrlParser: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
      console.log("Database is connected successfully");
    });
  })
  .catch(e => {
    return console.log(e);
  });
