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

//models
const Student = require("./models/student");


//middlewares
app.use(session({secret:'i am dewesh jha this is my code evaluation app.', resave:false,saveUninitialized:false,cookie:{maxAge:util.examDuration},store:store}));
app.use(flash());
app.use(multer().none());
app.use("/uploads",express.static(path.join(__dirname,"uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));





Student.findOne({roll: "13000318103"})
.then(stud=>{
    if(!stud){
        bcrypt.hash("Steel@1234",12)
        .then(hashedPassword=>{
            const student1 = new Student({
                name:"Dewesh Jha",
                roll:"13000318103",
                password:hashedPassword,
                address:"Kadma, Jamshedpur",
                cgpa:9,
                semCgpa:[1,2,3,4,5],
                photoId:"1234"
            });
            return student1.save();
        });
    }
})
.then(student=>{
    app.use("/home",homeRoutes);
    app.use("/student",studentRoutes);
    app.use((error, req, res, next) => {
      console.log(error);
      res.status(error.setHttpStatusCode);
      res.render("error", {
        msg: error.message,
        authenticated: false,
        admin: false,
      });
    });
})




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
      console.log("Server Up at",port);
    });
  })
  .catch((err) => console.log(err));
