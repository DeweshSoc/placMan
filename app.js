//internal node packages
const path = require("path");

//external node packages
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const bcrypt = require("bcryptjs");

//module imports
const util = require("./util/utility");

//app settings
const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

// db store
const store = new MongoDbStore({
  uri: process.env.MONGODB_URI,
  collection: "session",
});

//routers
const homeRoutes = require("./routes/home");
const studentRoutes = require("./routes/student");
const teacherRoutes = require("./routes/teacher");
const companyRoutes = require("./routes/company");

//models
const Record = require("./models/record");

//middlewares
app.use(
  session({
    secret: "i am dewesh jha this is my code evaluation app.",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: util.examDuration },
    store: store,
  })
);
app.use(flash());
app.use(multer().none());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const data0 = [
  { roll: 13000318103, name: "Dewesh", company: "LTI" },
  { roll: 13000318104, name: "Pewesh", company: "LTI" },
  { roll: 13000318105, name: "Lewesh", company: "LTI" },
  { roll: 13000318106, name: "Kewesh", company: "LTI" },
  { roll: 13000318107, name: "Uewesh", company: "LTI" },
  { roll: 13000318112, name: "Tewesh", company: "LTI" },
  { roll: 13000318113, name: "Qewesh", company: "LTI" },
  { roll: 13000318115, name: "Mewesh", company: "LTI" },
  { roll: 13000318116, name: "Yewesh", company: "LTI" },
];

Record.find({})
  .then((records) => {
    if (!records.length) {
      const newRecord1 = new Record({
        year: "2021",
        data: data0,
      });
      const newRecord2 = new Record({
        year: "2020",
        data: data0,
      });
      return newRecord1.save()
      .then(rec=>{
        return newRecord2.save();
      })
    }
    return records;
  })
  .then(records => {
    app.use("/home", homeRoutes);
    app.use("/student", studentRoutes);
    app.use("/teacher",teacherRoutes);
    app.use("/company",companyRoutes);
    app.use((error, req, res, next) => {
      console.log(error);
      console.log("In main error handling middleware!");
      res.status(error.setHttpStatusCode);
      res.render("error", {
        msg: error.message,
        authenticated: false,
        admin: false,
        homeLink: "/home",
      });
    });
  })
  .catch(err=>{
      console.log(err);
  });

const port = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((result) => {
    console.log("Connected to Database");
    app.listen(port, (req) => {
      console.log("Server Up at", port);
    });
  })
  .catch((err) => console.log(err));
